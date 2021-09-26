const router= require('express').Router();

const verify=require('./verifyUser')
const verifyAdmin=require('./verifyAdmin')


router.get('/',verify,verifyAdmin,(req,res)=>{
    res.json({
        posts:{
            title:"My first Post",
            description:"Imagine a short description"
        }
    })
})


module.exports=router;
