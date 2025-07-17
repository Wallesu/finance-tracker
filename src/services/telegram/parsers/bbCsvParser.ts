import { parse } from "csv-parse/sync"
import { Transaction } from "src/dtos/transaction"

export function parseCsvToTransactions(csv: string): Transaction[] {
    const records = parse(csv, {
        columns: true,
        skip_empty_lines: true
    })

    return records
        .filter((row: any) => row["Data"] !== "00/00/0000")
        .map((row: any) => {
            const rawDate = row["Data"]
            const rawDescription = `${row["Lançamento"]} - ${row["Detalhes"]}`.trim()
            const rawValue = row["Valor"]
            const rawType = row["Tipo Lançamento"]

            const [day, month, year] = rawDate.split("/")
            const isoDate = new Date(`${year}-${month}-${day}`).toISOString()

            const valueInCents = parseInt(
                rawValue.replace(/\./g, "").replace(",", "")
            )

            const type = rawType === "Entrada" ? "INCOME" : "EXPENSE"

            return {
                date: isoDate,
                description: rawDescription,
                value: valueInCents,
                type
            } satisfies Transaction
        })
}