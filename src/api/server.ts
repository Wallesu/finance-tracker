import express from 'express'
import cors from 'cors'
import transactionRoutes from './routes/transactions'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', transactionRoutes)

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok' })
})

const PORT = process.env.API_PORT || 4000

export function startServer() {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running on http://localhost:${PORT}`)
    })
}

export default app
