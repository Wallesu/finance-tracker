import { TransactionType } from "../entities/transaction"

export interface TransactionSheetDTO {
    date: string
    description: string
    value: number
    type: TransactionType
    category?: string
}