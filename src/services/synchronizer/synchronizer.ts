import { Transaction as TransactionDTO } from "src/dtos/transaction"
import { PrismaClient, Transaction as TransactionPrisma } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function insertTransactions(
    transactions: TransactionDTO[]
): Promise<void> {
    for (const tx of transactions) {
        const hash = gerarHash(tx)

        const exist = await prisma.transaction.findUnique({ where: { hash } })

        if (!exist) {
            await prisma.transaction.create({
                data: {
                    date: new Date(tx.date),
                    type: tx.type,
                    description: tx.description,
                    value: tx.value,
                    hash
                }
            })
        }
    }
}

export async function getAllTransactions(): Promise<TransactionPrisma[]> {
    const transactions = await prisma.transaction.findMany()
    return transactions
}

export function getDiffTransactions(
    transactionAlreadyInDb: TransactionPrisma[],
    transactionInComing: TransactionDTO[]
): TransactionDTO[] {
    const existingHashes = new Set(transactionAlreadyInDb.map((tx) => tx.hash))

    return transactionInComing.filter((tx) => {
        const hash = gerarHash(tx)
        return !existingHashes.has(hash)
    })
}

function gerarHash({ date, type, description, value }: TransactionDTO): string {
    const base = `${date}|${type}|${description}|${value}`
    return crypto.createHash("sha256").update(base).digest("hex")
}
