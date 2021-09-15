// import fs from 'fs';
// import { v4 } from 'uuid';

// interface transactionObj {
//   [key: string] : string | number | Date
// }

// let transactions: transactionObj[];

// try{
//   transactions = require('../../databases/transactions.json')
// }catch(error){
//   console.log(error)
// }


// function create(transaction: transactionObj): Promise<transactionObj>{
//   return new Promise((resolve) => {
//     const date = new Date
//     const id = v4()
//     const newTranz = {id: id, createdAt: date, ...transaction}
//     if(!transactions || transactions.length < 1){
//         transactions = [newTranz]
//     }else{
//         transactions.push(newTranz)
//     }
//     const writeStream = fs.createWriteStream('./databases/transactions.json')
//     writeStream.write(JSON.stringify(transactions, null, 4));
//     writeStream.end()
//     resolve(newTranz);
//   })
// }

// function getAllTransactions(): Promise<transactionObj[]>{
//   return new Promise((resolve) => {
//     resolve(transactions)
//   })
// }

// function getOneTransaction(id: string): Promise<transactionObj | undefined>{
//   let transaction: transactionObj | undefined
//   return new Promise((resolve) => {
//     if(transactions){
//       transaction = transactions.find(transaction => transaction.id === id)
//       resolve(transaction)
//     }else{
//       resolve(transaction)
//     }
//   })
// }

// function getTransactionsByAcc(accNum: string): Promise<(transactionObj | undefined)[]>{
//   let accTranz, accTranz2
//   return new Promise((resolve) => {
//     if(transactions){
//       accTranz = transactions.filter(tranz => tranz.senderAccount === accNum || tranz.receiverAccount === accNum)
//       accTranz2 = accTranz.map(tranz => {
//         if(tranz.senderAccount === accNum){
//           console.log('sender')
//           // tranz.amount = -tranz.amount
//           // return tranz
//           return {
//             ...tranz,
//             amount:  - (tranz.amount as number)
//           }
//         }
//         if(tranz.receiverAccount === accNum){
//           console.log('receiver')
//           // return tranz
//           return {
//             ...tranz,
//             amount: tranz.amount
//           }
//         }
//       })
//       resolve(accTranz2)
//     }
//   })
// }

// export { create, getAllTransactions, getOneTransaction, getTransactionsByAcc }


import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  senderAccount : String,
  receiverAccount : String,
  amount : Number,
  description : String,
  createdAt : {type : Date, default : Date.now()},
})

module.exports = mongoose.model('Transaction', transactionSchema);
