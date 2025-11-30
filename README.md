# Atena NestJS Challenge - Personal Finance Tracker API

REST API built with **NestJS**, **DDD**, **TypeORM**, and **PostgreSQL** to help users track their personal finances.

## Project Overview

This backend service allows users to:
1.  **Register Transactions**: Record income and expenses with support for multiple currencies (automatically converted to USD).
2.  **Manage Budgets**: Set monthly spending limits per category.
3.  **View Summaries**: Get a monthly overview of total income, expenses, budget usage, and warnings for over-budget categories.

## Architecture (DDD)

The project follows Domain-Driven Design principles and is structured in modules:

```
/src/modules
  /users         (User management)
  /categories    (Category management)
  /transactions  (Income/Expense recording)
  /budgets       (Budget setting and summary calculation)
/shared          (Shared kernel, value objects, infrastructure services)
```

## Tech Stack

*   **Framework**: NestJS
*   **Database**: PostgreSQL
*   **ORM**: TypeORM
*   **Validation**: Class-validator / DTOs
*   **External API**: ExchangeRate-API (for currency conversion)

## Setup Instructions

### Prerequisites

*   Node.js (v18+)
*   PostgreSQL
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd atena-nest-challenge
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Copy `.env.example` to `.env` and fill in your values.
    ```bash
    cp .env.example .env
    ```
    
    **Required Variables:**
    *   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Database connection details.
    *   `EXCHANGE_RATE_API_KEY`: API key for [ExchangeRate-API](https://www.exchangerate-api.com/).

4.  Run the application:
    ```bash
    # Development
    npm run start:dev
    
    # Production
    npm run start:prod
    ```

## Running Tests

The project includes unit and end-to-end (e2e) tests.

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e:transactions
```

## API Examples (cURL)

### 1. Create a Transaction

**Endpoint:** `POST /transactions`

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EXPENSE",
    "amount": 50.00,
    "currency": "USD",
    "category": "Food",
    "date": "2023-10-25",
    "description": "Lunch at restaurant"
  }'
```

### 2. Set a Monthly Budget

**Endpoint:** `POST /budgets`

```bash
curl -X POST http://localhost:3000/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food",
    "amount": 500,
    "currency": "USD",
    "monthYear": "2023-10"
  }'
```

### 3. Get Monthly Summary

**Endpoint:** `GET /budgets/summary?month=YYYY-MM`

```bash
curl "http://localhost:3000/budgets/summary?month=2023-10"
```

**Response Example:**
```json
{
  "totalIncome": 0,
  "totalExpenses": 50,
  "balance": -50,
  "categories": [
    {
      "category": "Food",
      "budget": 500,
      "spent": 50,
      "remaining": 450,
      "percentageUsed": 10
    }
  ],
  "warnings": []
}
```

