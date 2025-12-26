const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const serviceRouter = require('./routes/service');
const counterRouter = require('./routes/counter');
const tokenRouter = require('./routes/token');
const settingsRouter = require('./routes/settings');

// Middleware
const { sanitizeBody } = require('./middleware/validators');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(sanitizeBody); // Sanitize all incoming request bodies

// Database connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/service', serviceRouter);
app.use('/counter', counterRouter);
app.use('/token', tokenRouter);
app.use('/settings', settingsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});
