import dotenv from "dotenv"
dotenv.config()

import { startBot } from "./services/telegram/telegramStatementReader"
import { parseCsvToTransactions } from "./services/telegram/parsers/bbCsvParser"
import { insertTransactions, getDiffTransactions, getAllTransactions } from "./services/synchronizer/synchronizer"
import { Transaction } from "src/dtos/transaction"
import {
    buildSheetsClient,
    sheetUploader
} from "./services/sheet/sheetUploader"

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

startBot(
    TELEGRAM_TOKEN,
    parseCsvToTransactions,
    async (transactions: Transaction[]) => {
        const directoryGoogleKeyFile = "src/credentials/"
        const sheetClient = buildSheetsClient(
            directoryGoogleKeyFile + GOOGLE_KEY_FILE_NAME
        )


        const startCell = "dados!A1"
        //const transactionsAlreadyInSheet = await sheetReader(sheetClient, SPREADSHEET_ID, startCell)

        const transactionsAlreadyInDb = await getAllTransactions()
        const newTransactions = getDiffTransactions(transactionsAlreadyInDb, transactions)

        await insertTransactions(newTransactions)

        await sheetUploader(sheetClient, newTransactions, SPREADSHEET_ID, startCell)
    }
)
