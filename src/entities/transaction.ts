import { Card } from "./card"
import { Category } from "./category"

export type TransactionType = "INCOME" | "EXPENSE"

export interface Transaction {
    id: number,
    date: Date
    description: string
    value: number
    type: TransactionType
    hash: string,
    category?: Category | string
    card?: Card
}
