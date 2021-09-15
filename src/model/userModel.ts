import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : String,
  admin : {
      type : Boolean,
      default : false
  },
  tokens : [{
      token : {
          type : String,
          required : true
      }
  }]
})

module.exports = mongoose.model('User', userSchema);
