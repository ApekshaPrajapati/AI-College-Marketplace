
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://campusmart.vercel.app'  // add after Vercel deploy
  ],
  credentials: true
}))
app.use(express.json());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/ai', require('./routes/ai'));

// Test route — just to confirm server is running
app.get('/', (req, res) => {
  res.json({ msg: 'Server is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected!'))
  .catch(err => console.log('❌ MongoDB error:', err));

app.listen(5000, () => console.log(' Server running on port 5000'));
