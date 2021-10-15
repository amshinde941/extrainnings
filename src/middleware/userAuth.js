import jwt from 'jsonwebtoken';
import {User} from '../models/index';

const userAuth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ","");
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({
            _id: decodedToken._id,
            "tokens.token": token,
        });
        
        if(!user){
            throw new Error();
        }

        req.user = user;
        req.token = token;

        next();
    }catch(e){
        res.status(401).send("authentication failed");
    }
};

export default userAuth ;
//changes