import { TransactionType } from "../types/transactionType"
import { Card } from "./card"
import { Category } from "./category"

export interface Transaction {
    id?: number,
    date: Date
    description: string
    value: number
    type: TransactionType
    hash?: string,
    category?: Category | string
    card?: Card
}
