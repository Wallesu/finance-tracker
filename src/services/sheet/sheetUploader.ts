import { Transaction } from "src/dtos/transaction"
import { google, sheets_v4 } from "googleapis"

export async function sheetUploader(
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
            t.type
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

export function buildSheetsClient(keyFileName: string): sheets_v4.Sheets {
    const auth = new google.auth.GoogleAuth({
        keyFile: keyFileName,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    return google.sheets({ version: "v4", auth })
}
