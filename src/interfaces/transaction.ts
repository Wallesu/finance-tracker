export type TransactionType = "INCOME" | "EXPENSE"

export interface Transaction {
    date: string
    description: string
    value: number
    type: TransactionType
    category?: string
    card?: {
        id: number
        name: string
    }
}
