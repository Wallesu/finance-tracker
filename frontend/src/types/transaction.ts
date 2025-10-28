export type TransactionType = "INCOME" | "EXPENSE"

export interface Transaction {
  id: number
  date: string
  type: TransactionType
  description: string
  value: number
  hash: string
  categoryId: number | null
  category?: {
    id: number
    description: string
  } | null
}
