import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function map(description: string): string {
    const patterns: Record<string, string[]> = {
        bebida: ["bebida", "cervejaria"],
        animais: ["nutri norte"],
        alimentação: [
            "ifood",
            "bodega do ju",
            "janaina cun",
            "Mercado",
            "sorveteria",
            "mercado",
            "ifd*",
            "condorSuperCenter",
            "mc donalds"
        ],
        entretenimento: ["cinema", "ALLES PARK", "Rufino"],
        roupa: ["youcom"],
        "cosméticos/aparência": ["ronaldodanielsala"],
        tech: ["kabum"],
        educação: ["instituto de educacao"],
        transporte: ["uber"],
        outros: [
            "cia aguas de joinville",
            "tim s a",
            "Seguro de Vida - SEGURO DE VIDA"
        ]
    }

    const lowerDesc = description.toLowerCase()

    for (const [category, keywords] of Object.entries(patterns)) {
        if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
            return category
        }
    }

    return ""
}

async function categorizeAllUncategorizedTransactions(): Promise<void> {
    console.log("Buscando transações sem categoria...")
    
    const transactions = await prisma.transaction.findMany({
        where: {
            categoryId: null
        }
    })

    console.log(`Encontradas ${transactions.length} transações sem categoria`)

    let categorizedCount = 0

    for (const transaction of transactions) {
        const categoryName = map(transaction.description)
        
        if (categoryName && categoryName !== "") {
            // Busca ou cria a categoria
            let category = await prisma.category.findUnique({
                where: { description: categoryName }
            })

            if (!category) {
                category = await prisma.category.create({
                    data: { description: categoryName }
                })
                console.log(`Categoria criada: ${categoryName}`)
            }

            // Atualiza a transação com a categoria
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { categoryId: category.id }
            })

            categorizedCount++
        }
    }

    console.log(`${categorizedCount} transações foram categorizadas`)
}

export default {
    map,
    categorizeAllUncategorizedTransactions
}
