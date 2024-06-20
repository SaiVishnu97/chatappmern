const expressAsyncHandler = require('express-async-handler');
const jwt=require('jsonwebtoken');
const User = require('../models/UserModel');

const protect=expressAsyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer "))
    {
        try
        {
            token=req.headers.authorization.split(" ")[1];
            console.log(token);
            decoded=jwt.verify(token,'secretkey');
            console.log(decoded);
            req.user=await User.findById(decoded.id).select("-password");
            console.log(req.user);
            next();
        }
        catch(err)
        {
            res.status(401);
            throw new Error("User not authorised");
        }
    }
});

module.exports={
    protect
}