import { Transaction as TransactionDTO } from "src/interfaces/transaction"
import { PrismaClient, Transaction as TransactionPrisma } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

async function insert(transactions: TransactionDTO[]): Promise<void> {
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
            update: {} // se já existir, não faz nada
        })
    }
}

async function getAll(): Promise<TransactionPrisma[]> {
    console.log("getAll")
    const transactions = await prisma.transaction.findMany()
    return transactions
}

function getDiff(
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

export default {
    insert,
    getAll,
    getDiff
}
