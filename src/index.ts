import dotenv from "dotenv"
dotenv.config()

import telegramService from "./services/telegram/telegramService"
import synchronizer from "./services/synchronizer/synchronizer"
import { Transaction } from "src/dtos/transaction"
import { Transaction as TransactionPrisma } from "@prisma/client"
import categoryMapper from "./services/categoryMapper/categoryMapper"
import sheetService from "./services/sheet/sheetService"

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

telegramService.startBot(TELEGRAM_TOKEN, async (transactions: Transaction[]) => {
    const directoryGoogleKeyFile = "src/credentials/"
    const sheetClient = sheetService.buildClient(
        directoryGoogleKeyFile + GOOGLE_KEY_FILE_NAME
    )

    const startCell = "dados!A1"
    //const transactionsAlreadyInSheet = await sheetReader(sheetClient, SPREADSHEET_ID, startCell)

    console.log("buscando transações da base de dados...")
    const transactionsAlreadyInDb: TransactionPrisma[] =
        await synchronizer.getAllTransactions()

    console.log("comparando diferenças da base com as transações enviadas...")
    const newTransactions: Transaction[] = synchronizer.getDiffTransactions(
        transactionsAlreadyInDb,
        transactions
    )

    console.log("inserindo novas transações na base...")
    await synchronizer.insertTransactions(newTransactions)

    console.log("categorizando transações...")
    const newTransactionsWithCategories = newTransactions.map((transaction) => {
        transaction.category = categoryMapper.map(transaction.description)
        return transaction
    })

    console.log("inserindo transações na planilha...")
    await sheetService.upload(
        sheetClient,
        newTransactionsWithCategories,
        SPREADSHEET_ID,
        startCell
    )
})
