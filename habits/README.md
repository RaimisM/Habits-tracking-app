# Habits Tracking App

A Vue 3 application for tracking and managing personal habits, built with Vite and tested using Vitest and Playwright

## 🌟 Project Overview

Habits is a modern, responsive web application designed to help users track, monitor, and improve their daily habits. Built with Vue 3 and cutting-edge web technologies, this app provides an intuitive interface for personal habit management.

## 🛠 Tech Stack

- **Frontend**: Vue 3
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Stylelint
- **Tests**: Vitest, Playwright

## 📋 Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RaimisM/Habits-tracking-app.git
cd habits
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to view the app.

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run format` | Format code using Prettier |
| `npm run stylelint` | Lint CSS/styling |
| `npx playwright test app-flow.spec.ts` | Playwright testing of application flow |
| `npx vitest run habits.test.ts` | Vitest testing non-trivial functions |

## 🖥️ Recommended IDE Setup

- VSCode
- Extensions:
  - ESLint
  - Prettier
  - Stylelint
  - Playwright
  - Vitest
