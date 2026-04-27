# CampusMart — AI College Marketplace

A full-stack MERN marketplace where students can buy and sell books, notes, gadgets and digital study materials within their college community.

## Features
- 🤖 AI-powered listing descriptions using Groq (LLaMA)
- 📸 Image upload for physical products via Cloudinary
- 📄 PDF/PPT upload for digital notes
- 🔐 JWT authentication
- 🎓 College-verified student accounts

## Tech Stack
- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Groq API (LLaMA 4 Scout — vision, LLaMA 3.3 — text)
- **Storage:** Cloudinary

## Project Structure
ai-college-marketplace/
├── client/          → React frontend
├── server/          → Node.js backend
└── README.md

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/YOURNAME/ai-college-marketplace.git
cd ai-college-marketplace

### 2. Backend setup
cd server
npm install
cp .env.example .env
Fill in your values in .env
node server.js

### 3. Frontend setup
cd client
npm install
npm run dev

### 4. Environment Variables
Create `.env` in `/server` folder using `.env.example` as reference.

## Live Demo
[Add your deployed link here]
