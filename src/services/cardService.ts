import { PrismaClient } from "@prisma/client"
import { Card } from "src/entities/card"

const prisma = new PrismaClient()

async function getOrCreateCard(fileName?: string): Promise<Card> {
    let cardName: string

    if (!fileName) {
        cardName = "caju"
    } else {
        const lowerName = fileName.toLowerCase()
        if (lowerName.includes("nubank")) {
            cardName = "nubank"
        } else {
            cardName = "bb"
        }
    }

    let card = await prisma.card.findUnique({
        where: { name: cardName }
    })

    if (!card) {
        card = await prisma.card.create({
            data: { name: cardName }
        })
    }

    return card as Card
}

export default {
    getOrCreateCard
}
