import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Transaction } from '../types/transaction'

interface MonthData {
  month: string
  value: number
}

interface MonthExpenseChartProps {
  transactions: Transaction[]
}

export default function MonthExpenseChart({ transactions }: MonthExpenseChartProps) {
  const monthData = useMemo(() => {
    // Filtra apenas despesas
    const expenses = transactions.filter(t => t.type === 'EXPENSE')
    
    // Agrupa por mês e soma os valores
    const monthMap = new Map<string, number>()
    
    expenses.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = `${date.toLocaleString('pt-BR', { month: 'short' })}/${date.getFullYear()}`
      
      const currentValue = monthMap.get(monthKey) || 0
      monthMap.set(monthKey, currentValue + transaction.value)
    })
    
    // Converte para array e ordena por data (mais recente primeiro)
    const data: Array<{ key: string, month: string, value: number }> = Array.from(monthMap.entries())
      .map(([key, value]) => {
        const [year, month] = key.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        const monthLabel = `${date.toLocaleString('pt-BR', { month: 'short' })}/${year}`
        return { key, month: monthLabel, value }
      })
      .sort((a, b) => b.key.localeCompare(a.key))
    
    // Pega apenas os últimos 6 meses
    return data.slice(0, 6).map(({ key, ...rest }) => rest)
  }, [transactions])
  
  if (monthData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        Não há dados de despesas mensais para exibir
      </div>
    )
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 12px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].payload.month}</p>
          <p style={{ margin: '4px 0 0 0', color: '#333' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <BarChart data={monthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
