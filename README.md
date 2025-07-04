# 💸 Expense Tracker

A full-stack expense tracking application built with **React (Vite)** for the frontend, **Express.js** for the backend, and **MySQL** as the database. Dockerized for seamless deployment.

---

## 📦 Tech Stack

- **Frontend:** React + Vite + Axios
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Containerization:** Docker, Docker Compose


---

## 🚀 Features

- Add, update, and delete expense entries
- Filter expenses by category and date
- Summary of expenses by category
- RESTful API integration
- Responsive UI

---

## 🧱 Project Structure

```
ExpenseTracker/
│
├── backend/             # Node.js + Express API
│   ├── config/          # DB config
│   ├── controllers/     # API logic
│   ├── models/          # Sequelize models
│   └── routes/          # Route definitions
│
├── frontend/            # React (Vite) app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # App pages
│   │   └── services/    # Axios API logic
│
├── docker-compose.yml   # Docker multi-service setup
├── Dockerfile           # Dockerfile for backend
└── README.md
```

---

## 🐳 Getting Started with Docker

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Run with Docker

```bash
# Clone the repository
git clone https://github.com/prashant-siddhpura/ExpenseTracker.git
cd ExpenseTracker

# Build and run containers
docker compose up -d --build
```

- Frontend runs at: `http://localhost:3000`
- Backend API at: `http://localhost:5000`
- MySQL exposed on port: `3306`

> Make sure to open ports if using on cloud (e.g., AWS EC2)

---

## ⚙️ Environment Variables

Create a `.env` file in the `/backend` directory with the following:

```
DB_HOST=mysql_db
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expensetracker
PORT=5000
```

Note: Update `docker-compose.yml` to match these credentials.

---



## 🧪 Development Setup (Without Docker)

### Backend

```bash
cd backend
npm install
node index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```



