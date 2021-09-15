import {Request, Response} from 'express'
import { transactionSchema } from '../utils/validation';
// import { create, getAllTransactions, getOneTransaction, getTransactionsByAcc } from '../model/transactionModel'
// import { updateAccout, getOneAccount } from '../model/accountModel'

const Balances = require('../model/accountModel')
const Transactions = require('../model/transactionModel')

async function getPageNotFound(req: Request, res: Response): Promise<void> {
  try{
      res.status(404).end('Page Not found');
  }catch (err) {
      console.log(err)
  }
}

async function createTransaction(req: any, res: Response): Promise<void>{
  try{
    const validation = transactionSchema.validate(req.body)
    if(validation.error){
      console.log(validation.error.details[0].message)
      throw validation.error.details[0].message
    }
    const {from, to, amount, description} = req.body;
    // const sender = await getOneAccount(from)
    // const receiver = await getOneAccount(to)
    const sender = await Balances.findOne({accountNr : from , userId : req.user._id})
    const receiver = await Balances.findOne({accountNr : to})
    if(sender){
      if(receiver){
        if(sender.balance >= amount){
          const tranzDetails = {
            senderAccount : from,
            amount,
            receiverAccount : to,
            description
          }
          // await updateAccout('sender', from, amount)
          // await updateAccout('receiver', to, amount)
          // await Balances.findByIdAndUpdate({_id : sender._id}, {
          //   balance : sender.balance - amount,
          //   updatedAt : Date.now()
          // })
          // await Balances.findByIdAndUpdate({_id : receiver._id}, {
          //   balance : receiver.balance + amount,
          //   updatedAt : Date.now()
          // })
          sender.balance -= amount
          sender.updatedAt = Date.now()
          receiver.balance += amount
          receiver.updatedAt = Date.now()
          await sender.save()
          await receiver.save()
          const newTranz = new Transactions(tranzDetails)
          const saveTranz = await newTranz.save()
          if(saveTranz){
            res.status(201).send(newTranz)
          }else{
            throw {
              error : "Unable to save"
            }
          }
        }else{
          res.status(404).send({error : "Insufficient funds"})
        }
      }else{
        res.status(404).send({error : 'Receiver not on the database'})
      }
    }else{
      res.status(404).send({error : 'You do not own the sending account'})
    }
  }catch(error){
    console.log(error)
    res.status(404).send(error)
  }
}

async function getTransactions(req: Request, res: any): Promise<void>{
  try{
    const transactions = await Transactions.find()
    if(transactions.length === 0){
      res.status(404).send("No transactions made yet")
    }else{
      res.status(200).send(res.paginatedResult)
    }
  }catch(err){
    console.log(err)
  }
}

async function getTransaction(req: Request, res: Response): Promise<void>{
  try{
    const transactions = await Transactions.find()
    if(transactions.length === 0){
      res.status(404).send("No transactions made yet")
    }else{
      console.log(req.params)
      const id = req.params.id
      // const transaction = await getOneTransaction(id)
      const transaction = await Transactions.find({})
      if(!transaction){
        res.status(404).send({message : 'Transaction not found'})
      }else{
        res.status(200).send(transaction)
      }
    }
  }catch(error){
    console.log(error)
  }
}

async function getAccTransactions(req: any, res: any): Promise<void>{
  try{
    // const transactions = await Transactions.find()
    if(res.paginatedResult.data.length === 0){
      res.status(404).send("No transactions made yet on this account")
    }else{
      res.status(200).send(res.paginatedResult)
    }
  }catch(err){
    console.log(err, "next")
    res.status(404).send(err)
  }
}


export { createTransaction, getPageNotFound, getTransactions, getTransaction, getAccTransactions }
