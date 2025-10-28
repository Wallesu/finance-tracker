import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getOrCreateCard(fileName?: string): Promise<number> {
    let cardName: string

    if (!fileName) {
        // caso sem filename (ex.: foto -> Caju)
        cardName = "caju"
    } else {
        const lowerName = fileName.toLowerCase()
        if (lowerName.includes("nubank")) {
            cardName = "nubank"
        } else {
            // default para Banco do Brasil
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
        console.log(`Card criado: ${cardName}`)
    }

    return card.id
}

export default {
    getOrCreateCard
}
