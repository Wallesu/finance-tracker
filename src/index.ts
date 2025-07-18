import dotenv from "dotenv"
dotenv.config()

import { startBot } from "./services/telegram/telegramStatementReader"
import { parseCsvToTransactions } from "./services/telegram/parsers/bbCsvParser"
import { syncronizer } from "./services/syncronizer/syncronizer"

const TOKEN = process.env.TELEGRAM_TOKEN || ""
if (!TOKEN) {
    console.error("Token não definido.")
    process.exit(1)
}

startBot(TOKEN, parseCsvToTransactions, syncronizer)
