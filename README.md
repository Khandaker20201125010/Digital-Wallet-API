# Digital Wallet API

## 🚀 Project Overview

This project is a **secure, modular, role-based backend API** for a digital wallet system inspired by popular platforms like Bkash and Nagad.  
Built with **Express.js** and **Mongoose**, the API supports user registration, wallet management, and financial transactions such as add money, withdraw, send money, and agent-specific cash-in/out operations.

---

## 🎯 Packages 


---

## 📦 Install Packages

### ✅ Install Dependencies

```bash
npm install bcryptjs cookie-parser cors dotenv express express-session http-status-codes jsonwebtoken mongoose passport passport-google-oauth20 passport-local zod

``` 
- For typescripts

```bash
npm install -D @eslint/js @types/bcryptjs @types/cookie-parser @types/cors @types/dotenv @types/express @types/express-session @types/jsonwebtoken @types/passport @types/passport-google-oauth20 @types/passport-local eslint ts-node-dev typescript typescript-eslint

```

## 🎯 Features

- **Authentication & Authorization**
  - JWT-based login system with three roles: `admin`, `user`, and `agent`
  - Secure password hashing with bcrypt
  - Role-based route protection

- **Wallet Management**
  - Automatic wallet creation for users and agents at registration with an initial balance of ৳50
  - Wallet status management (blocked/unblocked by admin)
  
- **Transaction System**
  - Add money (top-up), withdraw, send money functionalities for users
  - Agents can perform cash-in and cash-out on users' wallets
  - Transactions include fees and are fully tracked
  - Atomic transaction logic ensures consistency
  
- **Admin Controls**
  - View all users, agents, wallets, and transactions
  - Block/unblock wallets
  - Approve/suspend agents
  - Set system parameters (optional)

- **Utilities**
  - Transaction fee calculation
  - Console-based notification stubs for user alerts

---

## 📁 Project Structure

```bash
src/
├── modules/
│ ├── auth/ # Authentication and authorization logic
│ ├── user/ # User registration, profile, and management
│ ├── wallet/ # Wallet schema, creation, and wallet logic
│ └── transaction/ # Transaction handling, fees, and history
├── middlewares/ # Express middlewares (auth, error handling)
├── config/ # Environment and app configuration
├── utils/ # Helper functions (fee calculation, notifications)
├── app.ts # Express app bootstrap and routes

```