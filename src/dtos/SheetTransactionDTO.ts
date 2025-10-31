import { TransactionType } from "../types/transactionType"

export interface SheetTransactionDTO {
    date: string
    description: string
    value: number
    type: TransactionType
    category?: string,
    card?: string
}