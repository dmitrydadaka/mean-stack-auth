import jwt from 'jsonwebtoken';
import { CreateError } from './error';


export const verifyToken = (req, res, next) => {
    const token = req.cookie.access_token;
    if( !token ) return CreateError(401, 'You Are Not Authenticated');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return CreateError(403, 'Token Is Not Valid');
    });
    req.user = user;
    next();    
}

export const verifyUser = (req, res, next) => { 
    
}