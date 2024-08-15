import jwt from 'jsonwebtoken';

export const generateToken=(id:string)=>
{
    return jwt.sign({id},"secretkey",{
        expiresIn : '1d'
    });
}

