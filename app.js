const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app=express()
const port=process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.send("Hello World !!");
});


app.listen(port,()=>{
    console.log(`App running at port ${port}`);
});