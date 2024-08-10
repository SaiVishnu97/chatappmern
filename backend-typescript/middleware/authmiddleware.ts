import { UserType } from '../CommonTypes';
import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/usermodel";


export const protect=expressAsyncHandler(async(req: Request,res: Response,next: NextFunction)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer "))
    {
        try
        {
            token=req.headers.authorization.split(" ")[1];
            const decoded=(jwt.verify(token,'secretkey'))as jwt.JwtPayload;
            req.user =(await User.findById(decoded.id).select("-password") as UserType);
            next();
        }
        catch(err)
        {
            res.status(401);
            throw new Error("User not authorised");
        }
    }
    else
    throw new Error("User not authorised");
});

