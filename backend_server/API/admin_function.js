const express=require('express')
const session=require('express-session')
const router=express.Router()
router.use(express.json())
const bodyParser = require('body-parser')
const mongoose=require('mongoose')
const User=require('../models/user')
const sg_mail= require('@sendgrid/mail')
const Hits=require('../models/hits')
const Listings=require('../models/Listings')


const API_key="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";
sg_mail.setApiKey(API_key)


router.use(express.static('../assets'))

// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })



async function db_connect(){
    uri="mongodb+srv://root:123@cluster0.u5atqck.mongodb.net/sharespace?retryWrites=true&w=majority"
    try{
        await mongoose.connect(uri);
        console.log('Connected to Mongo DB at admin_functions');
    }catch(error){
        console.error(error)
    }
}
db_connect()







//*************************************************************************/
router.post('/dashboard_data',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var hits_data=await Hits.find().sort({'createdAt': 'desc'})
        var user_count= await User.count()
        var listing_count= await Listings.count()
        res.json({status:'success',data:{'users_count':user_count,'listing_count':listing_count,hit_data:hits_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})


router.post('/users_data',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var users_data=await User.find()
        res.json({status:'success',data:{users_data:users_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})



router.post('/listings_data',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var listing_data=await Listings.find()
        console.log(listing_data)
        res.json({status:'success',data:{listings_data:listing_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})


router.post('/delete_request',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var listing_data=await Listings.find()
        console.log(listing_data)
        res.json({status:'success',data:{listings_data:listing_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})


router.post("/delete_listing_request",jsonParser,async (req,res)=>{
    if(req.session.auth){
        var req_data=req.body
        await Listings.findOneAndDelete({'_id':req_data['id']})
        var listing_data=await Listings.find()
        console.log("Deleteing success")
        res.json({status:'success',data:{listings_data:listing_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})




module.exports=router