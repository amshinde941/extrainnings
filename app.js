const express=require("express");
const app=express();
const dotenv = require('dotenv');
const mongoose=require('mongoose');

dotenv.config();

//import Routes
const authRoute=require('./routes/auth');
//const postRoute=require('./routes/posts')

//connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     },
    ()=>console.log('Connected to DB')
);



//middleware
app.use(express.json());


//Route middleware
app.use('/api/user',authRoute);
//app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('Server up and running'));