import { parseCsvToTransactions as parseBbCsv } from "./bbCsvParser"
import { parseNubankCsvToTransactions as parseNubankCsv } from "./nubankCsvParser"
import { Transaction } from "src/dtos/transaction"

export function selectCsvParser(
    fileName: string
): (csv: string) => Transaction[] {
    const lowerName = fileName.toLowerCase()

    if (lowerName.includes("nubank")) {
        console.log("identificado extrato da Nubank")
        return parseNubankCsv
    }

    console.log("identificado extrato do Banco do Brasil")
    return parseBbCsv
}
