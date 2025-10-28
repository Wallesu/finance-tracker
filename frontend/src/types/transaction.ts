export type TransactionType = "INCOME" | "EXPENSE"

export interface Transaction {
  id: number
  date: string
  type: TransactionType
  description: string
  value: number
  hash: string
  categoryId: number | null
  cardId: number | null
  category?: {
    id: number
    description: string
  } | null
  card?: {
    id: number
    name: string
  } | null
}
