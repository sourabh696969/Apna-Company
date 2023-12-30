const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/agent', require('./routes/agentRoutes'));
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`)
});