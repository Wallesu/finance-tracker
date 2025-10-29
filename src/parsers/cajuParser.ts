import Tesseract from "tesseract.js"
import { Transaction } from "src/entities/transaction"

async function imageToText(imagePath: string) {
    const result = await Tesseract.recognize(imagePath, "por") // "por" = português
    const teste: string = result.data.text
    return teste
}

function textToTransaction(text: string): Transaction[] {
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

    const transactions: Transaction[] = []
    let currentDate = ""
    const monthMap: Record<string, string> = {
        JAN: "01",
        FEV: "02",
        MAR: "03",
        ABR: "04",
        MAI: "05",
        JUN: "06",
        JUL: "07",
        AGO: "08",
        SET: "09",
        OUT: "10",
        NOV: "11",
        DEZ: "12"
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Detecta data (ex: "20 OUT")
        const dateMatch = line.match(/^(\d{1,2})\s*([A-ZÇ]{3})$/i)
        if (dateMatch) {
            const day = dateMatch[1].padStart(2, "0")
            const month = monthMap[dateMatch[2].toUpperCase()]
            const year = new Date().getFullYear()
            currentDate = `${year}-${month}-${day}`
            continue
        }

        // Detecta linha com valor (ex: "- R$2,50" ou "-R$ 20,00")
        const valueMatch = line.match(/-?\s*R\$\s*([\d.,]+)/)
        if (valueMatch && currentDate) {
            const description = line.replace(/-?\s*R\$\s*[\d.,]+/, "").trim()

            const value = Math.abs(
                Number(valueMatch[1].replace(".", "").replace(",", "."))
            )

            const type = "EXPENSE" // Caju só mostra gastos
            const nextLine = lines[i + 1]
            const timeMatch = nextLine?.match(/^(\d{2}:\d{2})$/)
            const hour = timeMatch ? nextLine : "00:00"

            const isoDate = new Date(`${currentDate}T${hour}:00Z`).toISOString()

            transactions.push({
                date: isoDate,
                description,
                value,
                type
            })

            if (timeMatch) i++ // pular a linha da hora
        }
    }

    return transactions
}

export default {
    imageToText,
    textToTransaction
}
