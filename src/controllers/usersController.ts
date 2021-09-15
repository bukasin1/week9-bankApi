import {NextFunction, Request, Response} from 'express'
import { userSchema } from '../utils/validation'
import {promises as dns} from 'dns'
import bcrypt from 'bcryptjs'

import { signToken } from '../middleware/auth'
const Users = require('../model/userModel')

export async function createUser(req: Request, res: Response, next: NextFunction){
    try{
        // console.log(req.body)
        const validation = userSchema.validate(req.body)
        if(!req.body.cPassword){
            throw {
                message : "Password not confirmed"
            } 
        }
        if(validation.error){
            res.status(404).send({
                message : validation.error.details[0].message
            })
            return;
        }
        const domainName = req.body.email.split('@')[1]
        const resolveBool = await dns
        .resolveMx(domainName)
        .then((data) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
        if(!resolveBool){
            throw {
                message : "Invalid email"
            }
        }
        const user = await Users.findOne({email : req.body.email})
        if(user){
            throw {
                message : "Email already exists"
            }
        }
        const {name, email, password, admin} = req.body
        const pass = await bcrypt.hash(password, 10)
        const newUser = new Users({
            name,
            email,
            password : pass,
            admin
        })
        const saveUser = await newUser.save()
        if(saveUser){
            res.status(201).send(saveUser)
        }else{
            throw {
                message : "Unable to save"
            }
        }
    }catch(err){
        res.status(404).send(err)
    }
}

export async function signInUser(req: Request, res: any){
    try{
        const user = await Users.findOne({email : req.body.email})
        console.log(user, 'user')
        if((user && user.admin && req.url.includes('admin')) || (user && !user.admin && req.url.includes('user'))){
            const validUser = await bcrypt.compare(req.body.password, user.password)
            console.log(validUser)
            if(validUser){
                const token = signToken(user._id, user.admin)
                user.tokens = user.tokens.concat({token})
                await user.save()
                // res.token = token
                res.cookie("myCookie", token)
                // res.setHeader('auth', token)
                // res.set('auth', token)
                // res.header('auth', token)
                // console.log(req.cookies.myCookie)
                res.status(201).send({msg: "Logged in", token})
                // res.redirect('/user/account')
                return;
            }
            throw{
                message : "Invalid login details"
            }
        }else{
            throw {
                message : "You can't login on this route"
            }
        }
    }catch(err){
        console.log("error")
        res.status(404).send(err)
    }
}

export async function logout(req: any, res: Response){
    try{
        req.user.tokens = req.user.tokens.filter((token: {[key: string]: string}) => {
            return token.token !== req.token
        })
        // res.clearCookie("myCookie")
        // res.removeHeader('auth')
        await req.user.save()
        res.status(200).send({message: 'logged out'})
    }catch(err){
        res.status(404).send(err)
    }
}