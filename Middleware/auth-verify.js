const jwt               =       require('jsonwebtoken');
const keys              =       require('../Config/keys');

let authVerify=(req,res,next)=>{

    //check if token provided or not
    const token=req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{

        //to verify the token
        const verified=jwt.verify(token,keys.jwt.SECRET_TOKEN);
        req.user=verified;
        next();

    }catch(err){

        res.status(400).send('Invalid Token');

    }
}

module.exports=authVerify;