import { errorHandler } from "./error.js";
import  jwt  from "jsonwebtoken";
export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token){  //if no token is present in the request header then return an error
        return next(errorHandler(401,"You are not authorized!"));
    }

    jwt.verify(token, process.env.JWT_SECRET,(err,user) => {
        if(err) return next(errorHandler(403,"Forbidden"));
        req.user = user;
        next();
    });
};