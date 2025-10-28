import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed...')

    // Verifica se os cards já existem
    const existingCards = await prisma.card.findMany()
    
    if (existingCards.length > 0) {
        console.log('Cards já existem, pulando seed.')
        return
    }

    // Cria os cards
    const cards = [
        { name: 'Caju' },
        { name: 'Nubank' },
        { name: 'BB' }
    ]

    for (const card of cards) {
        await prisma.card.create({
            data: card
        })
        console.log(`✅ Card criado: ${card.name}`)
    }

    console.log('✨ Seed concluído!')
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
