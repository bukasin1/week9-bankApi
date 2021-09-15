// const express = require('express');
import express from 'express';
// import { createTransaction, getPageNotFound, getTransactions, getTransaction, getAccTransactions } from '../controllers/transactionController'
import { getAccounts, getAccount, createAccount, getUserAccounts } from '../controllers/accountsController'
import { createTransaction, getAccTransactions, getTransaction, getTransactions } from '../controllers/transactionController';
import { createUser, logout, signInUser } from '../controllers/usersController';
import { auth } from '../middleware/auth';
import { adminPaginate } from '../middleware/pagination';
const router = express.Router();

const Balances = require('../model/accountModel')
const Transactions = require('../model/transactionModel')

// import express from 'express';

/* GET home page. */
// router.get('/', function(req: express.Request, res: express.Response) {
//   res.render('index', { title: 'Express' });
// });
router.post('/signup', createUser);
router.post('/user/login',signInUser);
router.post('/user/create-account', auth, createAccount);
router.get('/user/balances/:accountNumber', auth, getAccount);
router.post('/user/transfer',auth, createTransaction);
router.get('/user/balances/:accNum/transactions', auth,adminPaginate(Transactions, Balances), getAccTransactions)
router.get('/user/balances',auth, adminPaginate(Balances, Transactions), getUserAccounts);
// router.get('/user/transactions/:id', auth, getTransaction)
router.post('/admin/login',signInUser);
router.get('/admin/transactions', auth, adminPaginate(Transactions, Balances), getTransactions)
router.get('/admin/balances',auth, adminPaginate(Balances, Transactions), getAccounts);
// router.get('/balance/:accountNumber/transactions', getAccTransactions)
// router.get('/*', getPageNotFound);
router.get('/user/logout',auth, logout)
router.get('/admin/logout',auth, logout)

// module.exports = router;

export default router
