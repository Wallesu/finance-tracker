import TelegramBot from "node-telegram-bot-api"
import axios from "axios"
import iconv from "iconv-lite"
import fs from "fs"
import { Transaction } from "src/dtos/transaction"
import { selectCsvParser } from "./parsers/parserDispatcher"
import cajuParser from "./parsers/cajuParser"

function startBot(
    token: string,
    callback: (statementContent: Transaction[]) => void
) {
    const bot = new TelegramBot(token, { polling: true })

    bot.on("message", async (msg: TelegramBot.Message) => {
        try {
            if (!isAllowedUser(msg.chat.id)) {
                console.log(`O id ${msg.chat.id} tentou usar o bot`)
                return
            }

            if (!isValidFile(msg)) {
                await bot.sendMessage(
                    msg.chat.id,
                    "Por favor, envie um arquivo CSV ou uma imagem"
                )
                return
            }

            let records: Transaction[] = []

            if (msg.document) {
                const fileName = msg.document.file_name!
                const parser = selectCsvParser(fileName)

                const csvData = await downloadAndDecodeCsv(
                    bot,
                    msg.document.file_id
                )
                records = parser(csvData)

                await bot.sendMessage(
                    msg.chat.id,
                    `Recebi o CSV e converti para JSON com ${records.length} registros!`
                )
            }

            if (msg.photo) {
                const photo = msg.photo?.pop()
                if (!photo) return

                const fileId = photo.file_id

                const fileLink = await bot.getFileLink(fileId)
                const response = await axios.get(fileLink, {
                    responseType: "arraybuffer"
                })

                const dirPath: string = "./src/temp/"
                const fileName: string = "imagem.jpg"

                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath)
                }

                fs.writeFileSync(dirPath + fileName, Buffer.from(response.data))

                const cajuText: string = await cajuParser.imageToText(
                    dirPath + fileName
                )
                records = cajuParser.textToTransaction(cajuText)
            }

            callback(records)
        } catch (error) {
            console.error("Erro:", error)
            await bot.sendMessage(
                msg?.chat?.id || 0,
                "Ocorreu um erro ao processar o arquivo."
            )
        }
    })
}

function isAllowedUser(chatId: Number): Boolean {
    return chatId === 6816392883
}

function isCsvFile(fileName?: string): boolean {
    return !!fileName && fileName.toLowerCase().endsWith(".csv")
}

async function downloadAndDecodeCsv(
    bot: TelegramBot,
    fileId: string
): Promise<string> {
    const fileLink = await bot.getFileLink(fileId)

    const response = await axios.get<ArrayBuffer>(fileLink, {
        responseType: "arraybuffer"
    })

    return iconv.decode(Buffer.from(response.data), "windows-1252")
}

function isValidFile(msg: TelegramBot.Message): boolean {
    if (msg.document && !isCsvFile(msg.document.file_name)) return false

    return !!msg.photo
}

export default {
    startBot
}
