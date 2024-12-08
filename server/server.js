const express = require('express');
const mongoose = require('mongoose');
const candidateRoutes = require('./routes/candidateRoutes');
const cors = require('cors'); // Import CORS
const app = express();

const PORT = process.env.PORT || 5000;


const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Database Connection
mongoose
    .connect('mongodb://localhost:27017/candidateDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', candidateRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
