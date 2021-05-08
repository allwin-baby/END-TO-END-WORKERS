const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: Number,
        required: true
    },
 
    phone: {
        type: Number,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    category:{
        type: String,
    },
    dist:{
        type: String,
        required: true,
    },
    approved:{
        type:String
    },
    isavailable:{
        type:String
    }
});
loginSchema.index({email: 1, roleId: 1}, {unique: true}); 
const LoginSchema = mongoose.model('Login', loginSchema);
module.exports = { Login: LoginSchema};