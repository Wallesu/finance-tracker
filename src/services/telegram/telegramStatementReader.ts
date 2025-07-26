import TelegramBot from "node-telegram-bot-api"
import axios from "axios"
import iconv from "iconv-lite"
import { Transaction } from "src/dtos/transaction"

export function startBot(
    token: string,
    parseCsv: (csv: string) => Transaction[],
    callback: (statementContent: Transaction[]) => void
) {
    const bot = new TelegramBot(token, { polling: true })

    bot.on("message", async (msg) => {
        try {
            if (!isAllowedUser(msg.chat.id)) {
                console.log(`O id ${msg.chat.id} tentou usar o bot`)
                return
            }

            if (!msg.document || !isCsvFile(msg.document.file_name)) {
                await bot.sendMessage(
                    msg.chat.id,
                    "Por favor, envie um arquivo CSV."
                )
                return
            }

            const csvData = await downloadAndDecodeCsv(
                bot,
                msg.document.file_id
            )
            const records = parseCsv(csvData)

            await bot.sendMessage(
                msg.chat.id,
                `Recebi o CSV e converti para JSON com ${records.length} registros!`
            )

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
