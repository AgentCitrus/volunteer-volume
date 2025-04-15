require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({mssg: 'Hello World!'});
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port ', process.env.PORT);
})

process.env



