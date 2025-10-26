import { parse } from "csv-parse/sync"
import { Transaction } from "src/dtos/transaction"

export function parseCsvToTransactions(csv: string): Transaction[] {
    const records = parse(csv, {
        columns: true,
        skip_empty_lines: true
    })

    return records
        .filter((row: any) => rowShouldBeIncluded(row))
        .map((row: any) => {
            const rawDate = row["Data"]
            const rawDescription =
                `${row["Lançamento"]} - ${row["Detalhes"]}`.trim()
            const rawValue = row["Valor"]
            const rawType = row["Tipo Lançamento"]

            const [day, month, year] = rawDate.split("/")
            const isoDate = new Date(`${year}-${month}-${day}`).toISOString()

            const valueInCents = Number(
                rawValue.replace(".", "").replace(",", ".")
            )

            const type = rawType === "Entrada" ? "INCOME" : "EXPENSE"

            return {
                date: isoDate,
                description: rawDescription,
                value: toPositive(valueInCents),
                type
            } satisfies Transaction
        })
}

function rowShouldBeIncluded(row: any): Boolean {
    if (row["Data"] === "00/00/0000") return false

    const excludeTerms = ["Aplicação Poupança", "Saldo Anterior", "S A L D O"]

    return !excludeTerms.some((term) => row["Lançamento"].includes(term))
}

function toPositive(value: number): number {
    return Math.abs(value)
}
