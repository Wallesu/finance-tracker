# API REST - Finance Tracker

Esta API fornece endpoints RESTful para acessar as transações financeiras do sistema.

## Endpoints

### GET /api/transactions

Lista todas as transações cadastradas.

**Resposta:**
```json
[
  {
    "id": 1,
    "date": "2024-01-15T00:00:00.000Z",
    "type": "EXPENSE",
    "description": "Compra no supermercado",
    "value": 150.50,
    "hash": "abc123...",
    "categoryId": 5,
    "category": {
      "id": 5,
      "description": "Alimentação"
    }
  }
]
```

### GET /api/transactions/:id

Busca uma transação específica por ID.

**Resposta:**
```json
{
  "id": 1,
  "date": "2024-01-15T00:00:00.000Z",
  "type": "EXPENSE",
  "description": "Compra no supermercado",
  "value": 150.50,
  "hash": "abc123...",
  "categoryId": 5,
  "category": {
    "id": 5,
    "description": "Alimentação"
  }
}
```

### GET /health

Endpoint de health check.

**Resposta:**
```json
{
  "status": "ok"
}
```

## Configuração

A API roda na porta definida pela variável de ambiente `API_PORT` (padrão: 4000).

Você pode adicionar ao seu `.env`:
```
API_PORT=4000
```

## CORS

A API está configurada para aceitar requisições de qualquer origem. Em produção, considere configurar o CORS para permitir apenas a origem do seu frontend.
