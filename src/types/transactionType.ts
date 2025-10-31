export type TransactionType = "INCOME" | "EXPENSE"

export function convertToTransactionType(str: string):  TransactionType {
    if (str.toUpperCase() === "INCOME" || str.toUpperCase() === "EXPENSE") return str.toUpperCase() as TransactionType

    throw new Error(`Não é possível converter o valor '${str}' em TransactionType`)
}