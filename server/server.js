require('dotenv').config();
const express         = require('express');
const mongoose        = require('mongoose');
const cors            = require('cors');
const authRoutes      = require('./routes/auth');
const usersdataRoutes = require('./routes/usersdata');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',  // your CRA dev server
  credentials: true                // <— allow cookies to be sent
  }))
app.use(express.json());

// AUTH (register & login)
app.use('/api/auth', authRoutes);

// DATA (user & log CRUD)
app.use('/api', usersdataRoutes);

mongoose.connect(process.env.MONG_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server listening on port', process.env.PORT || 5000);
    })
  })
  .catch(err => console.error(err));
