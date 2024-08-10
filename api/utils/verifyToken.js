import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    //console.log(token);
    if( !token ) return CreateError(401, 'You Are Not Authenticated');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return CreateError(403, 'Token Is Not Valid');
        req.user = user;
        next();
    });    
}

export const verifyUser = (req, res, next) => { 
   verifyToken(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        next();
    } else {
        return next(CreateError(403, 'You Are Not Authorized'))
    }
   })                                        
}

export const verifyAdmin = (req, res, next) => { 
    verifyToken(req, res, () => {
     if(req.user.isAdmin) {
        next();
     } else {
        return next(CreateError(401, 'You Are Not Authorized'))
    }
    })                                        
 }
