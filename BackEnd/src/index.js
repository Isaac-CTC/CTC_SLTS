const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db.js');
const PORT = process.env.PORT || 2007;

const authRoutes = require('./Routes/authRoutes.js');
const itemRoutes = require('./Routes/itemRoutes.js');

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

connectDB().then(() => {
    app.listen(PORT,  () => {
        console.log(`Server is running on port ${PORT}`);
    });
});