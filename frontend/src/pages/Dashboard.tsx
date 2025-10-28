import { useEffect, useState } from 'react'
import { Transaction } from '../types/transaction'
import { transactionService } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [categorizing, setCategorizing] = useState<boolean>(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError('Erro ao carregar transações')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorize = async () => {
    try {
      setCategorizing(true)
      await transactionService.categorizeAll()
      // Aguarda um pouco para o backend processar
      setTimeout(() => {
        loadTransactions()
        setCategorizing(false)
      }, 500)
    } catch (err) {
      setError('Erro ao categorizar transações')
      console.error(err)
      setCategorizing(false)
    }
  }

  if (loading) {
    return <div className="dashboard loading">Carregando...</div>
  }

  if (error) {
    return <div className="dashboard error">{error}</div>
  }

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.value, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.value, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Finance Tracker Dashboard</h1>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card income">
          <h3>Receitas</h3>
          <p className="stat-value positive">
            {totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="stat-card expense">
          <h3>Despesas</h3>
          <p className="stat-value negative">
            {totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="stat-card balance">
          <h3>Saldo</h3>
          <p className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-content-header">
          <h2>Transações ({transactions.length})</h2>
          <button 
            onClick={handleCategorize} 
            disabled={categorizing}
            className="categorize-button"
          >
            {categorizing ? 'Categorizando...' : 'Categorizar Transações'}
          </button>
        </div>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category?.description || 'Sem categoria'}</td>
                  <td>
                    <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={transaction.type === 'INCOME' ? 'positive' : 'negative'}>
                    {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
