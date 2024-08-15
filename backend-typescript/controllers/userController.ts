import User from "../models/usermodel"
import { Request ,Response} from "express-serve-static-core";
import {generateToken} from "../config/config"

const  userRegister=async (req: Request,res: Response)=>
{
    const {name,email,password,pic}=req.body;
    if(!(name&&email&&password))
        throw new Error('Provide all of the mandatory fields')
    const existuser=await User.findOne({email});
    if(existuser)
        return res.status(400).send('EmailId already exists');
    const newuser=new User({name,email,password,pic});
    await newuser.save();
    if(newuser)
        res.status(201).json(
    {
            name: newuser.name,
            email: newuser.email,
            pic: newuser.pic,
            token: generateToken(newuser._id)});
    else
        throw new Error("User account creation failed");
}
const authUser=async (req: Request,res: Response)=>
{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(user&&await user.matchPassword(password))
    {
        return res.json({
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            _id:user._id
        });
    }
    throw new Error("Invalid credentials")
}

const allUsers=async(req: Request,res: Response)=>{
    try{
    const keyword=req.query.search?{
        $or:[
            {
                name:{$regex: req.query.search, $options: "i"}
            },
            {
                email:{$regex: req.query.search, $options: "i"}
            }
        ]
    }:{};
    const users=await User.find(keyword).find({_id:{$ne:req.user?._id}});
    res.status(200).json(users);
}catch(err)
{
    throw new Error('Error while fetching the users')
}
}
export {userRegister,authUser,allUsers}