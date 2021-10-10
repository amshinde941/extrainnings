import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const con = await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        console.log("mongodb connected :"+con.connection.host);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

export default connectDB;