import { Transaction } from "src/entities/transaction"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

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
    transactionInComing: Transaction[]
): Transaction[] {
    const existingHashes = new Set(transactionAlreadyInDb.map((tx) => tx.hash))

    return transactionInComing.filter((tx) => {
        const hash = gerarHash(tx)
        return !existingHashes.has(hash)
    })
}

function gerarHash({ date, type, description, value }: Transaction): string {
    const base = `${date}|${type}|${description}|${value}`
    return crypto.createHash("sha256").update(base).digest("hex")
}

export default {
    insert,
    getAll,
    getDiff
}
