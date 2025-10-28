# Setup da API REST

Este guia explica como configurar e executar a API REST do Finance Tracker.

## Instalação das Dependências

Primeiro, instale as novas dependências adicionadas:

```bash
npm install
```

Isso instalará:
- `express` - Framework web para Node.js
- `cors` - Middleware para habilitar CORS
- `@types/express` - Tipos TypeScript para Express
- `@types/cors` - Tipos TypeScript para CORS

## Estrutura da API

A API foi criada na pasta `src/api/`:

```
src/api/
├── server.ts              # Servidor Express principal
└── routes/
    └── transactions.ts   # Rotas de transações
```

## Endpoints Disponíveis

### GET /api/transactions
Lista todas as transações do banco de dados.

### GET /api/transactions/:id
Busca uma transação específica por ID.

### GET /health
Health check da API.

## Executando a API

A API será iniciada automaticamente junto com o bot do Telegram:

```bash
npm run dev
```

A API estará rodando em `http://localhost:4000`

## Configuração da Porta

Você pode configurar a porta da API adicionando ao `.env`:

```
API_PORT=4000
```

## Integração com o Frontend

O frontend já está configurado para consumir a API em `http://localhost:4000`. O proxy do Vite redireciona `/api/*` para `http://localhost:4000/api/*`.

Para testar:

1. Inicie o backend: `npm run dev` (na raiz do projeto)
2. Inicie o frontend: `cd frontend && npm install && npm run dev`
3. Acesse: `http://localhost:3000`

## Estrutura Completa

```
finance-tracker/
├── src/
│   ├── api/                    # Nova pasta da API
│   │   ├── server.ts
│   │   └── routes/
│   │       └── transactions.ts
│   ├── services/
│   ├── index.ts                 # Modificado para iniciar a API
│   └── ...
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts          # Cliente HTTP
│   │   └── ...
│   └── ...
└── package.json                 # Atualizado com Express e CORS
```
