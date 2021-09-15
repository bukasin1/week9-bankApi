import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction } from 'express'
// import { NextFunction } from 'express-serve-static-core'

interface authRequest extends Request {
    user? : {[key : string] : string | boolean | {[key : string] : {[key : string] : string | boolean}}[]},
    token? : string
}


const Users = require('../model/userModel')
// const secret: string = process.env.JWT_SECRET as string;
const secret: string = "gshyhbdn@Jgwvdi_ohhbkjw";
// const days: string =process.env.JWT_EXPIRES_IN as string;
const days: string ="90d";

export function signToken(id: string, admin: boolean){
    return jwt.sign({ id, admin }, secret, {
        expiresIn: days,
    });
}

// export async function authAdmin (req: any, res: Response, next: NextFunction){
//     try{
//         const token = req.cookies.myCookie
//         const decoded: any = jwt.verify(token, secret)
//     }catch(err){
//         res.status(301).send(err)
//     }
// }

export async function auth (req: authRequest, res: Response, next: NextFunction){
    try{
        console.log('entered auth')
        const token = req.cookies.myCookie
        // const token = req.headers["auth"] as string
        console.log('no token')
        const decoded: any = jwt.verify(token, secret)
        if(req.url.includes('user') && decoded.admin){
            console.log('first')
            throw {
                message : "Not authenticated."
            }
        }
        if(req.url.includes('admin') && !decoded.admin){
            console.log('second')
            throw {
                message : "Not authenticated"
            }
        }
        console.log(decoded.admin)
        if(!decoded.admin){
            const user = await Users.findOne({_id : decoded.id, admin: false, 'tokens.token': token })
            if (!user) {
                console.log('third')
                throw {
                    message : "Not authenticated"
                }
            }
            req.token = token
            req.user = user
        }else{
            const admin = await Users.findOne({_id : decoded.id, admin: true, 'tokens.token': token })
            if (!admin) {
                console.log('fourth')
                throw {
                    message : "Not authenticated"
                }
            }
            req.token = token
            req.user = admin 
        }
        next()
    }catch(err:any){
        console.log("auth error")
        res.status(301).send({message: `${err.message}`})
    }
}