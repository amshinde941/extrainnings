import express from 'express';
const app =express();
import dotenv from 'dotenv';
import connectDB from "./db/mongoose.js";

dotenv.config();

//import Routes
import {UserRouter,courseRouter} from './routes/index.js';

//connect to DB
connectDB();

//middleware
app.use(express.json());

//Route middleware
app.use(UserRouter);
app.use(courseRouter);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log("Server up and running available at http://localhost:" + port)
);

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
