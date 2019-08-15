const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());

const postRoute = require('./routes/posts');

app.use('/posts' , postRoute);


mongoose.connect(`${process.env.DB_CONNECTION}`,
    { useNewUrlParser: true },
    () => console.log('connected to db'));

app.listen(3000 , () => {
    console.log('Server running at port 3000')
})