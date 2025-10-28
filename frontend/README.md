# Finance Tracker Frontend

Dashboard para visualização de transações financeiras.

## Tecnologias

- React 18
- TypeScript
- Vite
- Axios
- React Router DOM

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── pages/          # Páginas da aplicação
│   │   └── Dashboard.tsx
│   ├── services/       # Serviços de API
│   │   └── api.ts
│   ├── types/          # Definições de tipos TypeScript
│   │   └── transaction.ts
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Ponto de entrada
│   └── index.css       # Estilos globais
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Funcionalidades

- Visualização de todas as transações do banco de dados
- Estatísticas de receitas, despesas e saldo
- Tabela responsiva com informações detalhadas
- Categorização de transações
- Interface moderna e intuitiva

## API Esperada

O frontend espera que o backend forneça:

```
GET /api/transactions
Retorna: Transaction[]
```

Interface Transaction:
```typescript
{
  id: number
  date: string
  type: "INCOME" | "EXPENSE"
  description: string
  value: number
  hash: string
  categoryId: number | null
  category?: { id: number, description: string } | null
}
```
