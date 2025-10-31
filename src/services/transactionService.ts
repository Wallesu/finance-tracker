import { Transaction } from "src/entities/transaction"
import { TransactionType, convertToTransactionType } from "../types/transactionType"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { SheetTransactionDTO } from "src/dtos/SheetTransactionDTO"

const prisma = new PrismaClient()

async function insert(transactions: Transaction[]): Promise<void> {
    for (const tx of transactions) {
        const hash = gerarHash(tx)

        await prisma.transaction.upsert({
            where: { hash },
            create: {
                date: new Date(tx.date),
                type: tx.type,
                description: tx.description,
                value: tx.value,
                hash,
                cardId: tx.card?.id
            },
            update: {}
        })
    }
}

async function getAll(): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany()
    return transactions as Transaction[]
}

function getDiff(
    transactionAlreadyInDb: Transaction[],
    transactionInComing: SheetTransactionDTO[]
): Transaction[] {
    const existingHashes = new Set(transactionAlreadyInDb.map((tx) => tx.hash))

    const transactionInComingAsTransaction: Transaction[] = transactionInComing.map(transactionInComing => {
        return {
            date: new Date(transactionInComing.date),
            description: transactionInComing.description,
            value: transactionInComing.value,
            type: convertToTransactionType(transactionInComing.type)
        }
    });

    return transactionInComingAsTransaction.filter((tx) => {
        const hash = gerarHash(tx)
        return !existingHashes.has(hash)
    })
}

function gerarHash({ date, type, description, value }: { date: Date, type: TransactionType, description: string, value: number }): string {
    const base = `${date}|${type}|${description}|${value}`
    return crypto.createHash("sha256").update(base).digest("hex")
}

export default {
    insert,
    getAll,
    getDiff
}
