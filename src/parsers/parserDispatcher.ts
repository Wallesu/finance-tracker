import { SheetTransactionDTO } from "src/dtos/SheetTransactionDTO"
import bbCsvParser from "./bbParser"
import nubankParser from "./nubankParser"

export function selectCsvParser(
    fileName: string
): (csv: string) => SheetTransactionDTO[] {
    const lowerName = fileName.toLowerCase()

    if (lowerName.includes("nubank")) {
        console.log("identificado extrato da Nubank")
        return nubankParser.csvToTransactions
    }

    console.log("identificado extrato do Banco do Brasil")
    return bbCsvParser.csvToTransactions
}
