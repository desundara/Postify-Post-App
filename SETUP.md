# 🚀 React Fullstack - Setup Guide

## 📁 Structure
```
react_fullstack/
├── backend/    → Express + Sequelize + MySQL API
├── frontend/   → React + Tailwind CSS
└── vercel.json → Monorepo deployment config
```

---

## 💻 Local Development

### 1. Setup MySQL Database
Make sure MySQL is running locally and create the database:
```sql
CREATE DATABASE react_fullstack;
```

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env if your MySQL password is different (default: root / 1234)
npm run dev       # runs on http://localhost:3001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# .env already set to REACT_APP_API_URL=http://localhost:3001
npm start         # runs on http://localhost:3000
```

### ✅ Now open http://localhost:3000 - Registration should work!

---

## ☁️ Vercel Deployment (Monorepo)

1. Push the entire `react_fullstack` folder to GitHub
2. Import to Vercel
3. Set **Root Directory** to the repo root
4. Add Environment Variables in Vercel dashboard:
   - `JWT_SECRET` = any long random string
   - `DATABASE_URL` = your MySQL connection string  
     e.g. `mysql://user:pass@host:3306/dbname`
   - `NODE_ENV` = `production`
5. The `vercel.json` handles routing automatically

---

## 🔧 Common Issues

| Problem | Fix |
|---|---|
| Registration CORS error | Make sure backend is running on port 3001 |
| DB connection failed | Check MySQL is running + `.env` credentials match |
| JWT errors | Make sure `JWT_SECRET` is same in `.env` |
| Vercel deploy fails | Check `DATABASE_URL` is set in Vercel env vars |
