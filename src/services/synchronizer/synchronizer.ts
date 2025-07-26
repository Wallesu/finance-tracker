import { Transaction } from "src/dtos/transaction"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function insert(transactions: Transaction[]): Promise<void> {
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


function gerarHash({ date, type, description, value }: Transaction): string {
    const base = `${date}|${type}|${description}|${value}`
    return crypto.createHash("sha256").update(base).digest("hex")
}