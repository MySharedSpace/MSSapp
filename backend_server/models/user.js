const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
    username:String,
    first_name:{type:String, default:''},
    last_name:{type:String, default:''},
    email:String,
    password:String,
    DOB:{type:String, default:''},
    phone_number:{type:String, default:''},
    profile_photo:{type:String, default:''},
    verified:{type:Boolean, default:false},
    reset_code:{type: String , default: null},
    reset_code_timestamp:{type:Date,default:null}

},{timestamps: true})

module.exports=mongoose.model("user", userSchema)