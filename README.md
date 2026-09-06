# Famvexa - Smarter Finances for Everyday Living

**Famvexa.com** is a modern, high-performance **Multi-Tenant SaaS Finance Application** built with Next.js App Router, Tailwind CSS, MySQL connection pooling, and bcrypt/JWT session security.

*A Devsankalp Solutions product.*

---

## 🌟 Key Features

- **Strict Multi-Tenant SaaS Isolation**: Every registered user gets a completely private, isolated database space.
- **Smarter Personal Finances**: Manage bank balances, cash wallet, monthly salary, expected income, daily expenses, and loan EMIs from a unified dashboard.
- **Trip Expense Manager (Splitwise-Style)**: Split trip expenses, track equal/custom shares, and record group settlements.
- **House & PG Ledger**: Manage flatmate rent, maid expenses, electricity bills, advance credits, and member settlements.
- **MySQL Database Integration**: Connected directly to MySQL database with automatic table schema initialization and connection pooling.
- **Modern Responsive Design**: Premium dark mode (oceanic navy `#081631`) and light mode tailored to the official **Famvexa** brand identity.

---

## 🚀 Getting Started

First, ensure your `.env.local` contains your MySQL database connection:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345
DB_NAME=gharkharch
JWT_SECRET=famvexa_super_secret_saas_jwt_key_2026!
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Famvexa application.
