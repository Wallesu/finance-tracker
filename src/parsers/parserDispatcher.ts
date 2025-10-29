import bbCsvParser from "./bbParser"
import nubankParser from "./nubankParser"
import { Transaction } from "src/entities/transaction"

export function selectCsvParser(
    fileName: string
): (csv: string) => Transaction[] {
    const lowerName = fileName.toLowerCase()

    if (lowerName.includes("nubank")) {
        console.log("identificado extrato da Nubank")
        return nubankParser.csvToTransactions
    }

    console.log("identificado extrato do Banco do Brasil")
    return bbCsvParser.csvToTransactions
}
