import TelegramBot from "node-telegram-bot-api"
import axios from "axios"

export function startBot(token: string, parseCsv: (csv: string) => object[]) {
    const bot = new TelegramBot(token, { polling: true })

    bot.on("message", async (msg) => {
        try {
            if (msg.chat.id !== 6816392883) {
                console.log(`O id ${msg.chat.id} tentou usar o bot`)
                return
            }

            if (!msg.document) return

            const fileName = msg.document.file_name || ""
            if (!fileName.endsWith(".csv")) {
                await bot.sendMessage(
                    msg.chat.id,
                    "Por favor, envie um arquivo CSV."
                )
                return
            }

            const fileId = msg.document.file_id
            const fileLink = await bot.getFileLink(fileId)

            const response = await axios.get<string>(fileLink)
            const csvData = response.data

            const records = parseCsv(csvData)

            console.log(records)
            await bot.sendMessage(
                msg.chat.id,
                `Recebi o CSV e converti para JSON com ${records.length} registros!`
            )
        } catch (error) {
            console.error("Erro:", error)
            await bot.sendMessage(
                msg?.chat?.id || 0,
                "Ocorreu um erro ao processar o arquivo."
            )
        }
    })
}
