// import '@types/jest';
// const app = require('../src/app').default;
import app from '../src/app'
// const request = require ('supertest');
import request from 'supertest';
import bcrypt from 'bcryptjs'

const Users = require('../src/model/userModel')
const Balances = require('../src/model/accountModel')
const Transactions = require('../src/model/transactionModel')

const {
  dbConnect,
  dbDisconnect,
} = require('../tests-utils/dbHandler.utils');

// let user
beforeAll(async () => {
  await dbConnect()
})

afterAll(async () => await dbDisconnect());

const validUserSignup = {
  name: "Daniel Bright",
  email: "bukasin0@gmail.com",
  password: "12345",
  cPassword: "12345"
}

const existingUserSignup = {
  name: "Daniel Bright",
  email: "bukasin2@gmail.com",
  password: "12345",
  cPassword: "12345"
}

const inValidUserSignup1 = {
  name: "Daniel Bright",
  email: "bukasin0@gmail.com",
  cPassword: "12345"
}

// const inValidUserSignup2 = {
//   email: "bukasin0@gmail.com",
//   password: "12345",
//   cPassword: "12345"
// }

const userLogin = {
  email: "bukasin2@gmail.com",
  password: "12345"
}


const invalidUserLogin = {
  email: "bukasin0@gmail.com",
  password: "1234"
}

const userAccount = {
  accountNr: "1234546578",
  amount: 5000
}

const invalidAccount = {
  accountNr: "1234546",
  amount: 5000
}

const existingAccount = {
  accountNr: "1234567890",
  amount: 5000
}

const transactionData = {
  from: "1234546578",
  to: "1234567890",
  amount: 1000,
  description: "tests"
}

const insufficientTransactionData = {
  from: "1234546578",
  to: "1234567890",
  amount: 10000,
  description: "tests"
}
// test("ROUTE: /users/signup, METHOD: POST >>> can signup with valid data", async () => {

//   await request(app)
//     .post("/users/signup")
//     .send(userComplete)
//     .set("Accept", "application/json")
//     .expect("Content-Type", /json/)
//     .expect(201)
//     .expect(res=>{
//         // console.log(res)
//         const {email, fullname, password, date_created} = res.body.data;
//         expect(email).toBe(userComplete.email);
//         expect(fullname).toBe(userComplete.fullname);
//         expect(password).toBeDefined();
//         expect(date_created).toBeDefined();
//     })
// });

describe('Testing database', () => {
  test('Succesfully creates a new user', async () => {
    const pass = await bcrypt.hash('12345', 10)
    const user = new Users({
      name: "Daniel Bright",
      email: "bukasin2@gmail.com",
      password: pass
    })
    const saveUser = await user.save()
    expect(saveUser).not.toBeNull();
    expect(saveUser).not.toBeUndefined()
    expect(saveUser).toBeTruthy()
    expect(saveUser.name).toBe("Daniel Bright")
    expect(saveUser.email).toBe("bukasin2@gmail.com")
  })

  test('Succesfully creates a new account', async () => {
    const user = Users.findOne({ email: 'bukasin2@gmail.com' })
    const date = new Date
    const account = new Balances({
      userId: user._id,
      accountNr: "1234567890",
      balance: 5000,
      updatedAt: date
    })
    const saveAcc = await account.save()
    expect(saveAcc).not.toBeNull();
    expect(saveAcc).not.toBeUndefined()
    expect(saveAcc).toBeTruthy()
    expect(saveAcc.updatedAt).toBe(date)
    expect(typeof saveAcc.createdAt).toBe("object")
  })

  test('Succesfully creates a new transaction', async () => {
    const date = new Date
    const account = new Balances({
      from: "1234546437",
      to: "1234567885",
      amount: 1000,
      description: "tests"
    })
    const saveTranz = await account.save()
    expect(saveTranz).not.toBeNull();
    expect(saveTranz).not.toBeUndefined()
    expect(saveTranz).toBeTruthy()
    expect(typeof saveTranz.createdAt).toBe("object")
  })

})

describe('Post endpoints', () => {
  test('Succesfully signs up a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send(validUserSignup)
    expect(res.statusCode).toBe(201)
    expect(res.body.name).toBe(validUserSignup.name)
    expect(res.body.email).toBe(validUserSignup.email)
    jest.setTimeout(10 * 1000)
  }, 10000)

  test('Returns error for already existing user signup', async () => {
    const res = await request(app)
      .post('/signup')
      .send(existingUserSignup)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe("Email already exists")
    jest.setTimeout(10 * 1000)
  }, 10000)

  test('Returns error for incomplete signup details', async () => {
    const res = await request(app)
      .post('/signup')
      .send(inValidUserSignup1)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).not.toBeUndefined()
    expect(res.body.message).toBe("\"password\" is required")
  })

  test('Returns 404 for a signed in user with no accounts created', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/balances')
     .set('Cookie', `myCookie=${logRes.body.token}`)
    // expect(res.statusCode).toEqual(200)
    expect(res.statusCode).toEqual(404)
    expect(res.body.msg).toEqual("You have no accounts created yet")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Succesfully creates an account for a signed in user', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .post('/user/create-account')
      .set("Cookie", `myCookie=${logRes.body.token}`)
      .send(userAccount)
    expect(res.statusCode).toBe(201)
    expect(res.body.accountNr).toBe(userAccount.accountNr)
    expect(res.body.balance).toBe(userAccount.amount)
    expect(typeof res.body.createdAt).toBe("string")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Returns error when creating an already existing account number', async() => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .post('/user/create-account')
      .set("Cookie", `myCookie=${logRes.body.token}`)
      .send(existingAccount)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe("Account number already exists")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Returns error when creating an invalid account number', async() => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .post('/user/create-account')
      .set("Cookie", `myCookie=${logRes.body.token}`)
      .send(invalidAccount)
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe("\"accountNr\" length must be 10 characters long")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Succesfully creates a transaction for a signed in user', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .post('/user/transfer')
      .set("Cookie", `myCookie=${logRes.body.token}`)
      .send(transactionData)
    expect(res.statusCode).toBe(201)
    expect(res.body.senderAccount).toBe(transactionData.from)
    expect(res.body.receiverAccount).toBe(transactionData.to)
    expect(res.body.amount).toBe(transactionData.amount)
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Returns transaction error for insufficient funds transfer', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .post('/user/transfer')
      .set("Cookie", `myCookie=${logRes.body.token}`)
      .send(insufficientTransactionData)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe("Insufficient funds")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })
})

describe('Get Requests', () => {
  test('Returns status 301 for unauthenticated user', async () => {
    const res = await request(app).get('/user/balances')
    expect(res.statusCode).toEqual(301)
    expect(res.body.message).toBe("jwt must be provided")
  })

  test('Gets all balances for a signed in user and returns status 200', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/balances')
      .set('Cookie', `myCookie=${logRes.body.token}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("data")
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Gets an updated balance for a user after a transaction', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/balances/1234546578')
      .set('Cookie', `myCookie=${logRes.body.token}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.balance).toBe(userAccount.amount - transactionData.amount)
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Returns an error trying to get an account balance not yours', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/balances/1234567890')
      .set('Cookie', `myCookie=${logRes.body.token}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toBe('Account not yours')
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
  })

  test('Returns an error trying to get an account not on the database', async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/balances/1234567891')
      .set('Cookie', `myCookie=${logRes.body.token}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toBe('Account not found')
    await request(app).get(`/user/logout`).set('Cookie', `myCookie=${logRes.body.token}`)
    jest.setTimeout(10 * 1000)
  }, 10000)

  test('Returns 404 for invalid login details', async () => {
    const res = await request(app).post('/user/login').send(invalidUserLogin)
    expect(res.statusCode).toEqual(404)
  })

  test("It successfully logs out a loggedin user", async () => {
    const logRes = await request(app).post('/user/login').send(userLogin)
    const res = await request(app)
      .get('/user/logout')
      .set('Cookie', `myCookie=${logRes.body.token}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('logged out')
  })

})

