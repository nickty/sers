const express = require('express')
const app = express();
const mongoose = require('mongoose'); 
const cors = require('cors');
require('dotenv').config();

// const url = 'mongodb://127.0.0.1:27017/shaadi'

mongoose.connect(process.env.MONGO_ONLINE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`MongoDB database connected`)
} )

app.use(express.json())
app.use(cors());

const users = require('./routes/user')


//app.get('/', (req, res) => console.log("test"))

app.use('/api/', users)


app.listen(4000, () => console.log('server is running on port'));
