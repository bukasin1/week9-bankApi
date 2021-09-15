import {Request, Response} from 'express';
import { balanceSchema } from '../utils/validation';
// import { getAllAccounts, getOneAccount, createNewAccount } from '../model/accountModel'

const Balances = require('../model/accountModel')

// function accountGenerator(){
//   let accNum = '01'
//   while(accNum.length < 10){
//     accNum += Math.floor(Math.random() * 10)
//   }
//   return accNum
// }

async function getAccounts(req: Request, res: any): Promise<void>{
  try{
    // const accounts = await getAllAccounts()
    const accounts = await Balances.find()
    if(accounts.length === 0){
      res.status(404).send({msg: "No accounts created yet"})
    }else{
      res.status(200).send(res.paginatedResult)
    }
  }catch(error){
    console.log(error)
  }
}

async function getUserAccounts(req: Request, res: any){
  try{
    if(res.paginatedResult.data.length === 0){
      res.status(404).send({msg: "You have no accounts created yet"})
    }else{
      res.status(200).send(res.paginatedResult)
    }
  }catch(err){
    console.log(err)
  }
}

async function getAccount(req: any, res: Response): Promise<void>{
  try{
    // const accounts = await getAllAccounts()
    // const accounts = await Balances.find()
    // if(accounts === undefined || accounts.length === 0){
    //   res.status(404).send("No accounts created yet")
    // }else{
      const accNum = req.params.accountNumber
      // const account = await getOneAccount(accNum)
      const account = await Balances.findOne({accountNr : accNum})
      if(!account){
        res.status(404).send({message : 'Account not found'})
      }else{
        if(req.user._id.toString() !== account.userId){
          res.status(404).send({message : 'Account not yours'})
          return;
        }
        res.status(200).send(account)
      }
    // }
  }catch(error){
    console.log(error)
  }
}

async function createAccount(req: any, res: Response): Promise<void>{
  try{
    // const accounts = await getAllAccounts()
    const validation = balanceSchema.validate(req.body)
    if(validation.error){
      throw {
        message : validation.error.details[0].message
      }
    }
    const { amount, accountNr } = req.body
    const check = await Balances.findOne({accountNr})
    console.log(check)
    if(check){
      throw {
        message : "Account number already exists"
      }
    }else{
      const userId = req.user._id
      const accDetails = {
        userId,
        accountNr,
        balance : amount,
        updatedAt : Date.now()
      }
      // const newAcc = await createNewAccount(accDetails)
      const newAcc = new Balances(accDetails)
      const saveAcc = await newAcc.save()
      // res.status(201).send(newAcc)
      if(saveAcc){
        res.status(201).send(newAcc)
      }else{
        throw{
          message : 'Unable to save'
        }
      }
    }
  }catch(error){
    res.status(404).send(error)
  }
}


export { getAccounts, getAccount, createAccount, getUserAccounts }
