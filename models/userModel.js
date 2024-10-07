const mongoose = require('mongoose')

const UserSChema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['manager', 'employee'], required: true },
    email:{type:String,required:true,unique:true}
})


const User = mongoose.model('User',UserSChema)

module.exports = User;