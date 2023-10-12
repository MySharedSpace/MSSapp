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
const Application= require('../models/applications')


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
        console.log('Connected to Mongo DB at Client functions_functions');
    }catch(error){
        console.error(error)
    }
}
db_connect()







//*************************************************************************/
router.post('/dashboard_data',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var hits_data=await Hits.find()
        
        res.json({status:'success',data:{users_count:50,listing_count:500,hit_data:hits_data}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }   
})


router.post('/check_draft',jsonParser, async (req,res)=>{
    if(req.session.auth){
        var result= await Listings.findOne({'status':'draft','owners_email':req.session.email})
        if(!result){
            res.json({status:'success',data:result,message:'No data found'})
        }else{
            res.json({status:'success',data:result,'message':'some data found'})
        }
    }else{
        res.json({status:'failed',status_code:12,message:'please login first'})
    }
})

router.post('/update_draft',jsonParser, async (req,res)=>{
    //console.log(req.body)
    if(req.session.auth){
        var result= await Listings.findOne({'status':'draft','owners_email':req.session.email})
        if(!result){
            //Create a new data with draft and owner as the ony fields and also the data
            //var new_listing= new Listings({})
            res.json({status:'success',data:result,message:'No data found going to update it'})
        }else{
            res.json({status:'success',data:result,'message':'some data found going to update it still'})
        }
    }else{
        res.json({status:'failed',status_code:12,message:'please login first'})
    }
})

router.post('/upload_listing',jsonParser, async (req,res)=>{
    const{
        place,
        sublet,
        description,
        features,
        perks,
        gender,
        isSmokingAllowed,
        isPetsAllowed,
        price,
        title,
        desc,
        images
    } = req.body;

    var email=req.session.email;
    
    console.log(images,email)

    const newSublet = new Listings({
        owners_email:email,
        status:'complete',
        place,
        sublet,
        description,
        features,
        perks,
        gender,
        isSmokingAllowed,
        isPetsAllowed,
        price,
        title,
        desc,
        images
    })
    try {
        await newSublet.save();
        //res.status(200).json(newSublet);
        res.json({status:'success',message:'listing posted successfully'})
    } catch(err) {
        console.log(err)
        res.json({status:'failed',message:'Error try again later'})
    }
})



router.post('/profile_data',jsonParser, async (req,res)=>{
    if(req.session.auth){
        var result= await User.findOne({'email':req.session.email})
        if(!result){
            res.json({status:'failed',data:result,message:'No data found'})
        }else{
            res.json({status:'success',data:result,'message':'User has been found'})
        }
    }else{
        res.json({status:'failed',status_code:12,message:'please login first'})
    }
})


router.post('/update_profile_picture',jsonParser, async (req,res)=>{
    if(req.session.auth){
        var data=req.body
        console.log(data)
        let user_doc= await User.findOne({'email':req.session.email})
        await user_doc.updateOne({profile_photo:data['url']})
        await user_doc.save()
        //await User.findOneAndUpdate({'email':req.session.email},{profile_photo:data['url']})
        res.json({status:'success',data:{'data':101},'message':'Profile uploaded successfully'})
    }else{
        res.json({status:'failed',status_code:12,message:'please login first'})
    }
})


router.post('/update_profile_details',jsonParser, async (req,res)=>{
    if(req.session.auth){
        var data=req.body
        console.log(data)
        let user_doc= await User.findOne({'email':req.session.email})
        await user_doc.updateOne({
            'username':data['username'],
            'first_name':data['first_name'],
            'last_name':data['last_name'],
            'DOB':data['DOB'],
            'phone_number':data['phone_number']
        })
        await user_doc.save()
        await User.findOneAndUpdate({'email':req.session.email},{profile_photo:data['url']})
        res.json({status:'success',data:{'data':101},'message':'Profile updated successfully'})
    }else{
        res.json({status:'failed',status_code:12,message:'please login first'})
    }
})


router.post('/listing_search',jsonParser, async (req,res)=>{
    if(req.session.auth){
        var data=req.body
        console.log('Searching:',data['search_key'])
        var search=data['search_key']
        var result= await Listings.find({$or:[{desc:{ "$regex": String(search)}},{title:String(search)},{place:String(search)}]})
        res.json({status:'success',data:result,'message':'Profile updated successfully'})
    }else{
        res.json({status:'failed',status_code:121,message:'please login first'})
    }
})


router.post('/my_listings_data',jsonParser,async (req,res)=>{
    if(req.session.auth){
        var application_stats= {}
        var listing_data=await Listings.find({owners_email:String(req.session.email)})
        //console.log(listing_data)
        listing_data.map(async (listing)=>{
            console.log(listing['_id'])
            var c = await Application.find({'listing_id':listing['_id']}).count()
            console.log( c)
            application_stats[String(listing['_id'])]=c
            //console.log(application_stats)
        })
        res.json({status:'success',data:{listings_data:listing_data,'application_stats':application_stats}})
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})



router.post('/my_application_request',jsonParser,async (req,res)=>{
    var data=req.body
    if(req.session.auth){
        var email= req.session.email
        console.log('Making new Application')
        var result=await Application.findOne({applicant_email:email,listing_id:data['id']})
        console.log(result)
        if(!result){
            console.log('Application not found, making a new one')
            var new_application = new Application({
                applicant_email:email,
                listing_id:data['id']
            })
            await new_application.save()
            res.json({status:'success',data:{data:101, message:'Application made successfully' } })
        }else{
            console.log('Applicaion found ,sending over')
            res.json({status:'success',data:{data:101, message:'Application Already exists' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})


router.post('/my_application_data',jsonParser,async (req,res)=>{
    var data=req.body
    if(req.session.auth){
        var email= req.session.email
        var result = await Application.find({ applicant_email : email})
        if(!result){
            console.log('Application not found, making a new one')
            res.json({status:'success',data:{data:101, message:'No Application found' } })
        }else{
            console.log('Applicaion found ,sending over the data')
            res.json({ status:'success', data:{my_applications:result, message:'Application' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})




router.post('/get_my_listing_applicants_data',jsonParser,async (req,res)=>{
    var data=req.body
    console.log(data)
    if(req.session.auth){
        var email= req.session.email
        var result = await Application.find({ listing_id : data['id']})
        if(!result){
            console.log('No applicants found for this listing')
            res.json({status:'success',data:{data:101, message:'No applicants found for your listing' } })
        }else{
            console.log('Applicants found sending over the data')
            res.json({ status:'success', data:{my_applicants:result, message:'Applicants found' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})


router.post('/approve_my_applicants_application',jsonParser,async (req,res)=>{
    var data=req.body
    console.log('Approving an application..:',data)
    if(req.session.auth){
        var email= req.session.email
        var result = await Application.findById(data['application_id'])
        //console.log(result)
        if(!result){
            console.log('No Application found')
            res.json({status:'failed',data:{data:101, message:'application not found for your listing' } })
        }else{
            console.log('Found one and now updating')
            // result.updateOne({application_status:'approved'})
            await result.updateOne({application_status:'approved'})
            await result.save()
            res.json({ status:'success', data:{my_applicants:result, message:'Application approved successfully' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})



router.post('/applicant_get_listing_owner_details',jsonParser,async (req,res)=>{
    var data=req.body
    console.log('Getting listing owners details:',data)
    if(req.session.auth){
        var email= req.session.email
        var result = await Listings.findById(data['listing_id'])
        console.log(result)
        if(!result){
            console.log('No Listing found')
            res.json({status:'failed',data:{data:101, message:'We did not find the owner of the specified listing' } })
        }else{
            console.log('Found a listing getting the owners email')
            var listing_owners_email=result['owners_email']
            var owners_details= await User.findOne({'email':listing_owners_email})
            console.log('Found the owner, sending over the data')
            // result.updateOne({application_status:'approved'})
            // await result.updateOne({application_status:'approved'})
            // await result.save()
            res.json({ status:'success', data:{owner:owners_details, message:'In progress' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})



router.post('/delete_my_application',jsonParser,async (req,res)=>{
    var data=req.body
    console.log('Deleting application:',data)
    if(req.session.auth){
        var email= req.session.email
        var result =await Application.findById(data['application_id'])
        console.log(result)
        if(!result){
            console.log('No Listing found')
            res.json({status:'failed',data:{data:101, message:'We did not find an application with this id' } })
        }else{
            console.log('Found the application, deleting ...')
            await result.deleteOne()
            res.json({ status:'success', data:{code:101, message:'Deletion has been done' } })
        }
    }else{
        res.json({status:'failed',message:'please login first'})
    }
})



//***************************************************************************************************** */
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