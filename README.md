# Finance Tracker

Sistema para leitura de extratos bancários e envio para planilhas Google Sheets, com dashboard web para visualização.

## Estrutura do Projeto

```
finance-tracker/
├── src/                    # Backend (bot Telegram + API REST)
│   ├── api/                # API REST
│   │   ├── server.ts
│   │   └── routes/
│   │       └── transactions.ts
│   ├── services/
│   │   ├── telegram/      # Bot do Telegram
│   │   ├── transaction/   # Serviços de transações
│   │   ├── category/      # Categorização
│   │   └── sheet/         # Integração com Google Sheets
│   └── parsers/            # Parsers para diferentes bancos
├── frontend/              # Frontend React
│   └── src/
│       ├── pages/
│       ├── services/
│       └── types/
└── prisma/                # Schema do banco de dados
```

## Tecnologias

### Backend
- Node.js + TypeScript
- Prisma ORM (MySQL)
- Express (API REST)
- node-telegram-bot-api
- Google Sheets API

### Frontend
- React 18
- TypeScript
- Vite
- Axios

## Setup Inicial

### 1. Backend

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Executar em desenvolvimento
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

### Bot Telegram
- Recebe extratos bancários em formato CSV
- Suporta Nubank e Banco do Brasil
- Processa e armazena transações no banco de dados
- Categoriza automaticamente as transações
- Envia dados para planilha Google Sheets

### API REST
- `GET /api/transactions` - Lista todas as transações
- `GET /api/transactions/:id` - Busca transação específica
- `GET /health` - Health check

### Dashboard Web
- Visualização de todas as transações
- Estatísticas de receitas, despesas e saldo
- Interface responsiva
- Categorização de transações

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Telegram
TELEGRAM_TOKEN=seu_token_aqui

# Google Sheets
GOOGLE_KEY_FILE_NAME=nome_do_arquivo.json
SPREADSHEET_ID=id_da_planilha

# API
API_PORT=4000

# Database
DATABASE_URL="mysql://user:password@localhost:3306/finance_tracker"
```

## Scripts Disponíveis

### Backend
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Executa em produção

### Frontend
- `npm run dev` - Executa servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## API Endpoints

### Transactions

**GET /api/transactions**
```bash
curl http://localhost:4000/api/transactions
```

**GET /api/transactions/:id**
```bash
curl http://localhost:4000/api/transactions/1
```

## Desenvolvimento

O backend roda na porta 4000 por padrão, e o frontend na porta 3000. O Vite está configurado para fazer proxy das requisições `/api/*` para o backend.

## Licença

ISC