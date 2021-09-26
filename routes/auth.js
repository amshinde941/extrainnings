const router= require('express').Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const { registerValidation,loginValidation } = require('../Validation');
const { reset } = require('nodemon');


router.post('/register',async (req,res)=>{
    //Validation
     const {error}= registerValidation(req.body);
     if(error) return res.status(400).send(error.details[0].message);


    //Checking if user is admin or user 
    if(await req.body.isAdmin===true){
        //checking if the admin is present in database
        const emailExist= await Admin.findOne({email:req.body.email});
        if(emailExist) return res.status(400).send("Email already exists");

        //Hash Password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //Creating a user
        const admin = new Admin({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            sign:req.body.sign
        });

        try {
            const savedAdmin = await admin.save();
            res.send("Registered Successfully !!");
        } catch (error) {
            res.status(400).send(error);
        }

    }else{
        //checking if the user is present in database
        const emailExist= await User.findOne({email:req.body.email});
        if(emailExist) return res.status(400).send("Email already exists");

        //Hash Password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //Creating a user
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
        });
        try {
            const savedUser = await user.save();
            res.send("Registered Successfully !!");
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
});

router.get('/login',async (req,res)=>{
    //Validation
    const {error}= loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if(req.body.isAdmin===true){
        //checking if the user is present in database
        const admin= await Admin.findOne({email:req.body.email});
        if(!admin) return res.status(400).send("Email does not exist");

        //password is correct or not
        const validPass = await bcrypt.compare(req.body.password,admin.password);
        if(!validPass) return res.status(400).send("Invalid Password");

        //creating and assign a token
        const token = jwt.sign({_id:admin._id},process.env.TOKEN_SECRET);
        res.header('auth-token',token);
        res.send('Logged in as Admin!!');
    }else{
        //checking if the user is present in database
        const user= await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("Email does not exist");

        //password is correct or not
        const validPass = await bcrypt.compare(req.body.password,user.password);
        if(!validPass) return res.status(400).send("Invalid Password");

        //creating and assign a token
        const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
        res.header('auth-token',token);
        res.send('Logged in as user!!');
    }
   
});


module.exports=router;