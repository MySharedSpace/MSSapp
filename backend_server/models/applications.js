const mongoose = require('mongoose')

const applicationsSchema= new mongoose.Schema({
    applicant_email:String,
    listing_id:{type:String, default:''},
    application_status:{type:String, default:'pending'},

},{timestamps: true})

module.exports=mongoose.model("applications", applicationsSchema)