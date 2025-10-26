import { parse } from "csv-parse/sync"
import { Transaction } from "src/interfaces/transaction"

export function csvToTransactions(csv: string): Transaction[] {
    const records = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })

    return records.map((row: any) => {
        const rawDate = row["date"]
        const rawDescription = row["title"]
        const rawValue = row["amount"]

        const isoDate = new Date(`${rawDate}T00:00:00Z`).toISOString()

        const valueInCents = Number(rawValue.replace(",", "."))
        const type = valueInCents >= 0 ? "EXPENSE" : "INCOME"

        return {
            date: isoDate,
            description: rawDescription,
            value: Math.abs(valueInCents),
            type
        } satisfies Transaction
    })
}

export default {
    csvToTransactions
}
