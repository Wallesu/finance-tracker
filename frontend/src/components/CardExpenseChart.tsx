// src/components/CardExpenseChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction } from '../types/transaction'

interface Props {
    transactions: Transaction[]
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#8dd1e1']

export default function CardExpenseChart({ transactions }: Props) {
    // Filtra apenas despesas
    const expenses = transactions.filter(t => t.type === 'EXPENSE')

    // Agrupa despesas por cartão
    const dataMap = new Map<string, number>()
    expenses.forEach(t => {
        const cardName = t.card?.name || 'Sem cartão'
        dataMap.set(cardName, (dataMap.get(cardName) || 0) + t.value)
    })

    const data = Array.from(dataMap.entries()).map(([name, value]) => ({
        name,
        value
    }))

    if (data.length === 0) {
        return <p>Nenhum gasto encontrado.</p>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                        `${entry.name} (${(entry.percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) =>
                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                } />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}
