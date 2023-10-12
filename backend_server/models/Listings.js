
//import { Schema, model,  } from "mongoose";
const mongoose = require('mongoose')


const listingSchema= new mongoose.Schema({
    status:{type:String, default:'draft'},
    owners_email:{type:String, default:'' },
    place: {type: String,default:''},
    price: {type: Number,default:''},
    desc: {type: String,default:''},
    description: {type: String,default:''},
    images: [{type: String,default:''}],
    gender: {type: String,default:''},
    sublet: {type: String,default:''},
    isPetsAllowed: {type: String,default:''},
    isSmokingAllowed: {type: String,default:''},
    title:{type: String,default:''},
    perks: [{type: String,default:[]}],
    features: [{type: String,default:[]}]
})

module.exports=mongoose.model("listing", listingSchema)


