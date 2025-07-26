import dotenv from "dotenv"
dotenv.config()

import { startBot } from "./services/telegram/telegramStatementReader"
import { parseCsvToTransactions } from "./services/telegram/parsers/bbCsvParser"
import { insert } from "./services/synchronizer/synchronizer"
import { Transaction } from "src/dtos/transaction"
import { buildSheetsClient, sheetUploader } from "./services/sheet/sheetUploader"

function getRequiredEnvVar(name: string): string {
    const value = process.env[name]
    if (!value) {
        console.error(`Parâmetro '${name}' não definido.`)
        process.exit(1)
    }
    return value
}

const TELEGRAM_TOKEN = getRequiredEnvVar("TELEGRAM_TOKEN")
const GOOGLE_KEY_FILE_NAME = getRequiredEnvVar("GOOGLE_KEY_FILE_NAME")
const SPREADSHEET_ID = getRequiredEnvVar("SPREADSHEET_ID")


startBot(TELEGRAM_TOKEN, parseCsvToTransactions, async (transactions: Transaction[]) => {
    await insert(transactions)

    const directoryGoogleKeyFile = "src/credentials"
    const sheetClient = buildSheetsClient(directoryGoogleKeyFile + GOOGLE_KEY_FILE_NAME)

    const range = "dados!A1" // ou "Sheet1!A1"

    await sheetUploader(sheetClient, transactions, SPREADSHEET_ID, range)
})
