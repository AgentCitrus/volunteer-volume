require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userdataRoutes = require('./routes/userdata');


const app = express();

app.use(cors());
app.use(express.json());


app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path, req.method);
    next();
})

//routes
app.use('/api/userdata', userdataRoutes);

app.listen(process.env.PORT, () => {
    console.log('Listening on port ', process.env.PORT);
})




