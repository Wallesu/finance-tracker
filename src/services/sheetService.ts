import { Transaction, TransactionType } from "src/entities/transaction"
import { google, sheets_v4 } from "googleapis"
import { TransactionSheetDTO } from "src/dtos/SheetTransactionsDTO"

export async function upload(
    sheetsClient: sheets_v4.Sheets,
    transactions: Transaction[],
    spreadsheetId: string,
    range: string
) {
    try {
        const values = transactions.map((t) => [
            t.date,
            t.description,
            t.value,
            t.type,
            t.category ?? ""
        ])

        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values
            }
        })

        console.log("Transações inseridas com sucesso!")
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        } else {
            console.error("Erro desconhecido", error)
        }
    }
}

export async function read(
    sheetsClient: sheets_v4.Sheets,
    spreadsheetId: string,
    startCell: string
): Promise<TransactionSheetDTO[]> {
    const response = await sheetsClient.spreadsheets.values.get({
        spreadsheetId,
        range: `${startCell}:E1000`
    })

    const rows = response.data.values || []

    return rows
        .map((row): TransactionSheetDTO => {
            return {
                date: row[0],
                description: row[1],
                value: parseFloat(row[2]),
                type: row[3] as TransactionType,
                category: row[4] || undefined
            }
        })
        .filter((row: TransactionSheetDTO) => {
            if (!row.date || !row.description || !row.value || !row.type)
                return false

            return true
        })
}

export function buildClient(keyFileName: string): sheets_v4.Sheets {
    const auth = new google.auth.GoogleAuth({
        keyFile: keyFileName,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    return google.sheets({ version: "v4", auth })
}

export default {
    upload,
    read,
    buildClient
}
