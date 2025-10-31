export type TransactionType = "INCOME" | "EXPENSE"

export interface Transaction {
  id: number
  date: string
  type: TransactionType
  originalDescription: string
  description: string | null
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
