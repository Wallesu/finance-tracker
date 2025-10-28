import axios from 'axios'
import { Transaction } from '../types/transaction'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions')
    return response.data
  },

  async getById(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  async categorizeAll(): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/transactions/categorize')
    return response.data
  },
}
