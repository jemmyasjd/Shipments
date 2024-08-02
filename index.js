

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailRoutes = require('./routes/email.js');
const {connectDB} = require('./connection.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URL);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/emails', emailRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

