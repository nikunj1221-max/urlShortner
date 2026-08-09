const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
const cors = require("cors");
const app = express();


// ⚠️ FIX: Allow requests from Vercel (and local) 
const corsOptions = {
  origin: [
    'https://my-next-app-123.vercel.app', // YOUR Vercel preview URL
    'http://localhost:3000',              // Your Next.js dev server
    'http://localhost:5173',              // Your Vite dev server
  ],
  credentials: true,                  // ← IMPORTANT
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(express.json());
app.use('/api', urlRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});