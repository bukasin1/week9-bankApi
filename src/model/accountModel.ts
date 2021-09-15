// import fs from 'fs'

// interface accountObj {
//     [key: string] : string | number | string[] | Date
//     // [email: string]: string | number | string[]
// }

// let accounts: accountObj[];

// try{
//     accounts = require('../../databases/accounts.json')
// }catch(err){
//     console.log(err)
// }

// function getAllAccounts(): Promise<accountObj[]>{
//   return new Promise((resolve) => {
//     resolve(accounts)
//   })
// }

// function getOneAccount(accNum: string): Promise<accountObj | undefined>{
//   let account: accountObj | undefined
//   return new Promise((resolve) => {
//     if(accounts){
//       account = accounts.find(account => account.accountNr === accNum)
//       resolve(account)
//     }else{
//       resolve(account)
//     }
//   })
// }

// function createNewAccount(account: accountObj): Promise<accountObj>{
//   return new Promise((resolve) => {
//     const date = new Date
//     let newAcc: accountObj;
//     if(!accounts || accounts.length < 1){
//         newAcc = {createdAt: date, ...account}
//         accounts = [newAcc]
//     }else{
//         newAcc = {createdAt: date, ...account}
//         accounts.push(newAcc)
//     }
//     const writeStream = fs.createWriteStream('./databases/accounts.json')
//     writeStream.write(JSON.stringify(accounts, null, 4));
//     writeStream.end()
//     resolve(newAcc);
//   })
// }

// function updateAccout(role: string, accNum: string, amount: number): Promise<null>{
//   return new Promise((resolve) => {
//     // const date = new Date
//     const index = accounts.findIndex(account => account.accountNr === accNum)
//     if(role === 'sender'){
//       // (accounts[index].balance as number) -= amount
//       accounts[index].balance = accounts[index].balance as number - amount
//     }else{
//       // (accounts[index].balance as number) += amount
//       accounts[index].balance = accounts[index].balance as number + amount
//     }
//     const writeStream = fs.createWriteStream('./databases/accounts.json')
//     writeStream.write(JSON.stringify(accounts, null, 4));
//     writeStream.end()
//     resolve(null)
//   })
// }

// export { getAllAccounts, getOneAccount, createNewAccount, updateAccout }

import mongoose from 'mongoose'

const balanceSchema = new mongoose.Schema({
  userId : String,
  accountNr : String,
  balance : Number,
  createdAt : {type : Date, default : Date.now()},
  updatedAt : Date
})

module.exports = mongoose.model('Balance', balanceSchema);

