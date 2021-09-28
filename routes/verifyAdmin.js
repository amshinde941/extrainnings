const jwt =require('jsonwebtoken');

module.exports=function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified =jwt.verify(token,process.env.TOKEN_SECRET);
        if(req.body.isAdmin===true){
            req.user=verified;
            next();
            console.log("isAdmin");
        }
    } catch (error) {
        res.status(400).send('Invalid Token');
        
    }
}