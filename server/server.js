require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const usersdataRoutes = require('./routes/usersdata');
const authRoutes = require('./routes/auth')



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)

app.use((req,res,next)=>{
    console.log(req.path, req.method);
    next();
})

//routes
app.use('/api/usersdata', usersdataRoutes);

//connect to db
mongoose.connect(process.env.MONG_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Listening on port & connected to database', process.env.PORT);
    })
})
.catch((error) => {
    console.log(error)
})





