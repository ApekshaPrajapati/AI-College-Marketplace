# CampusMart — AI College Marketplace

A full-stack MERN marketplace where college students buy and sell books, notes, gadgets and digital study materials. Upload a photo or PDF — AI writes the listing description automatically.

![MERN](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square) ![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-green?style=flat-square) ![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-orange?style=flat-square)

---

## Features

- 🤖 AI generates listing description from product photo or PDF
- 📸 Physical products — image upload via Cloudinary
- 📄 Digital products — PDF, PPT, DOCX support
- 🔐 JWT authentication with college-verified accounts
- 🔍 Search and filter by category
- 📬 Contact seller directly — no platform fees

---

## Tech Stack

| | |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Groq API — LLaMA 4 Scout Vision + LLaMA 3.3 |
| Storage | Cloudinary |

---

## Setup

```bash
# 1. Clone
git clone https://github.com/YOURNAME/ai-college-marketplace.git

# 2. Backend
cd server && npm install
cp .env.example .env   # fill in your keys
node server.js

# 3. Frontend
cd client && npm install
npm run dev
```

---

## Environment Variables

Create `.env` inside `/server` using `.env.example`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace
JWT_SECRET=your_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=gsk_your_groq_key
```

---

## Live Demo

🔗 [Add deployed link here]

---

## Author

**Apeksha** — [GitHub](https://github.com/ApekshaPrajapati) 
