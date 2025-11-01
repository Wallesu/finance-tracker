import Tesseract from "tesseract.js"
import { SheetTransactionDTO } from "src/dtos/SheetTransactionDTO"

async function imageToText(imagePath: string) {
    const result = await Tesseract.recognize(imagePath, "por")
    const text: string = result.data.text
    return text
}

function textToTransaction(text: string): SheetTransactionDTO[] {
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

    const transactions: SheetTransactionDTO[] = []
    let currentDate = ""
    const now = new Date()

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

        // Data "HOJE"
        if (/^HOJE$/i.test(line)) {
            currentDate = now.toISOString().split("T")[0]
            continue
        }

        // Data "20 OUT"
        const dateMatch = line.match(/^(\d{1,2})\s*([A-ZÇ]{3})$/i)
        if (dateMatch) {
            const day = dateMatch[1].padStart(2, "0")
            const month = monthMap[dateMatch[2].toUpperCase()]
            const year = now.getFullYear()
            currentDate = `${year}-${month}-${day}`
            continue
        }

        // Transações com valor
        const valueMatch = line.match(/([+-]?)\s*R\$\s*([\d.,]+)/)
        if (valueMatch && currentDate) {
            let description = line.replace(/([+-]?)\s*R\$\s*[\d.,]+/, "").trim()

            if (/caiu\s*caju!?/i.test(description)) {
                description = "Vale Caju"
            }

            const signal = valueMatch[1] === "+" ? 1 : -1
            const value = Math.abs(
                Number(valueMatch[2].replace(".", "").replace(",", "."))
            )
            const type = signal > 0 ? "INCOME" : "EXPENSE"

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

            if (timeMatch) i++
        }
    }

    return transactions
}

export default {
    imageToText,
    textToTransaction
}
