import express, { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import categoryMapper from '../../services/categoryService'

const router = Router()
const prisma = new PrismaClient()

// GET /api/transactions - Lista todas as transações
router.get('/transactions', async (req: express.Request, res: express.Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                category: true,
                card: true,
            },
            orderBy: {
                date: 'desc',
            },
        })

        return res.json(transactions)
    } catch (error) {
        console.error('Erro ao buscar transações:', error)
        return res.status(500).json({ error: 'Erro ao buscar transações' })
    }
})

// GET /api/transactions/:id - Busca uma transação específica
router.get('/transactions/:id', async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id)

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                category: true,
                card: true,
            },
        })

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' })
        }

        return res.json(transaction)
    } catch (error) {
        console.error('Erro ao buscar transação:', error)
        return res.status(500).json({ error: 'Erro ao buscar transação' })
    }
})

// POST /api/transactions/categorize - Categoriza todas as transações sem categoria
router.post('/transactions/categorize', async (req: express.Request, res: express.Response) => {
    try {
        await categoryMapper.categorizeAllUncategorizedTransactions()
        return res.json({ 
            success: true, 
            message: 'Transações categorizadas com sucesso' 
        })
    } catch (error) {
        console.error('Erro ao categorizar transações:', error)
        return res.status(500).json({ error: 'Erro ao categorizar transações' })
    }
})

export default router
