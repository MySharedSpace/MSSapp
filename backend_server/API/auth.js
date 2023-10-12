const express=require('express')
const session=require('express-session')
const router=express.Router()
router.use(express.json())
const bodyParser = require('body-parser')
const mongoose=require('mongoose')
const User=require('../models/user')
const sg_mail= require('@sendgrid/mail')
const Hits=require('../models/hits')



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
        console.log('Connected to Mongo DB at password reset');
    }catch(error){
        console.error(error)
    }
}
db_connect()





//*********************************************************************************************************** */
router.post('/',jsonParser,(req,res)=>{
    console.log(req.params,req.body)
    res.json({"hello":'World'})
})


router.post('/login',jsonParser,async (req,res)=>{
    var req_data=req.body
    result = await User.find({email:req_data['email']})
    //console.log(req_data,result)
    if(result.length){
        if(req_data['password'] === result[0]['password']){
            if(result[0]['verified']){
                req.session.auth=true
                req.session.email=req_data['email']
                res.json({status:'success',message:'Login was successfull'})
            }else{
                res.json({status:'success',message:'Please verify your account'})
            }
        }else{
            res.json({status:"failed",message:'Wrong password',results:result})
        }
    }else{
        res.json({status:'failed', status_code:12,message:'User doesnt exist'})
    }
})


router.post('/logout',(req,res)=>{
    req.session.destroy()
    res.json({'status':'success','message':'Logging out was successfull'})
})


router.post('/new_registration', urlencodedParser,async (req, res) => {
    //const { username, email, password } = req.body;
    // Log the form data to the console
    var username = req.body['username']
    var email = req.body['email']
    var password = req.body['password']

    console.log({"Username": username,"Email": email,"Password": password});
    //Check if the user is in the database and has already used this email
    result = await User.find({email:email})
    if(result.length){
        res.json({status:'failed',message:'You already used this email'})
    }else{
        // Insert data to the database
        const new_user= new User({
            username:username,
            email:email,
            password:password,
            verified:true //Edit this when your email is unsuspended
        })
        new_user.save()
        // Generate email to send and verify 
        send_activation_email(email)
        // Send a response to the client if all is successful
        res.json({status:'success',message:'You have successfully registered with us'})
    }
  });



  async function  log_hit(){
    var now=new Date()
    day=now.getDate()
    month=now.getMonth()
    year=now.getFullYear()
    var date=String(day)+'/'+String(month+1)+'/'+String(year)
    var hits_count=await Hits.findOne({'date':date})
    if(hits_count===null){
        var new_hit=new Hits({'date':date,hits:1})
        new_hit.save()
    }else{
        await Hits.findOneAndUpdate({'date':date},{hits:hits_count['hits']+1})
    }
    
}


router.post('/status',jsonParser,async (req,res)=>{
    var req_data=req.body
    result = await User.find({email:req_data['email']})
    if(req.session.auth){
        log_hit()
        res.json({status:'success', status_code:12,message:'You are logged in', data:{email:req.session.email}})
    }else{
        res.json({status:'failed', status_code:12,message:'User doesnt exist'})
    }


})



function send_activation_email(recipient){
    //You will need to hash the email before you send the link
    var API_key="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";
    sg_mail.setApiKey(API_key)
    console.log("Sending message to "+recipient+"...")
    var body="Hi, Welcome to sharespace, we are very excited to have you and are eager to help you find the place that suites you"
    var html=`
        <center>
        <div style='color:white; background-color:#003B95'>
            <h1>Sharespace</h1>
            <h2>Thank you for signing up with us</h2>
            <p>You now just need to activate your account</p>
            <h3>Click <a href='http://localhost:5000/new_registration/activate_account/`+recipient+`'>here</a> to activate your account</h3>
        </div>
        </center>
        `
    
    msg={
        to: recipient,
        from: 'audire.usher@gmail.com',
        subject: "Welcome to Sharespace",
        text:body,
        html: html
    }

    sg_mail.send(msg)
    .then(response=> {
        console.log('Email sent...')
        return true;
    })
    .catch(error => {
        console.log(error.message)
        return false;
    })
}



module.exports=router