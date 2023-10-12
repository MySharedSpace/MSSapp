const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
    date:String,
    hits:Number,
},{timestamps: true})

module.exports=mongoose.model("hits", userSchema)