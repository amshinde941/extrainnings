const express=require("express");
const app=express();
const dotenv = require('dotenv');
const mongoose=require('mongoose');

dotenv.config();

//import Routes
const authRoute=require('./routes/auth');
//const postRoute=require('./routes/posts')
const courseRouter=require('./routes/course');
const moduleRouter=require('./routes/module');

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
app.use('/courses',courseRouter);
app.use('/courses',moduleRouter);
//app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('Server up and running'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
    
  });