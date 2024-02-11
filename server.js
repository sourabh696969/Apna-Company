const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();
const cors = require('cors');

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;  

app.use(cors());
app.use(express.json());
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/agent', require('./routes/agentRoutes'));
app.use('/api/others', require('./routes/workPostRoutes'));
app.use('/images', express.static('upload/images'));
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`)
});