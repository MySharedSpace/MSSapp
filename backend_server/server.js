const express=require('express')
const session=require('express-session')
const bodyParser = require('body-parser')
const auth = require('./API/auth')
const cors=require('cors')
const admin=require('./API/admin_function')
const client = require('./API/client_function')
const Listings =require( './models/Listings.js');
const Order = require('./models/order.js');
const multiparty =require('multiparty');
const mime =require('mime-types')
const fs =require('fs')
const { PutObjectCommand, S3Client } =require("@aws-sdk/client-s3");
const mongoose = require('mongoose')



const Consumer_Key = "6AQcgb9GcqP3PgZWIt35pO6G1zkNTdG7"
const Consumer_Secret = 'JTdHl1O46liwViKb'
const Business_Short_Code = 174379
const Passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
const Transaction_Description = "STKPush";
const Account_Reference = "Sharespace";
const PartyA = 600981
const B2C_Security_Credential = 'I/10oZmvgEcX+TsrtMZ1isiajShsXzG4w75a3/xxF0oqg4KvIhtUM64gogR60CgNhoPARQu7OJESyyhRII5iCO9rLuLv115DEhcAqdRbbiStzctspOM2TaTYXYdBZ3+i8nTB+hFKKRLkZg2ZGDH4hETiDVgS+EkFOY5qgT7WJrZA+Nrx1kmUNNAGYMPAeHark/vfS+ZPQtYJwx3bth3HSi0mAUiBPdIqVhmDbhyt5IXrmvj1qZYn4scl1fOq4S2lnYYsn4OxZgVgO8dkHv8SJ2zCGSkybG5oKi4kvIcRw/GSEVnUndTZFpnXuecUvEt1EA9wVYo9X+e8dljG6M1Ssg=='
const Initiator_Name = "testapi"
const Environment = "sandbox | live";
const callbackUrl = "https://fresh-connect.vercel.app/callback";
const S3_ACCESS_KEY='AKIA5TB4QW25TXJ47LVP'
const S3_SECRET_ACCESS_KEY='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'
const S3_BUCKET='next-ecommerce-learn'




// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const app= express()
app.set("view engine",'ejs')
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(express.static('./assets'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))


//****************************Server 1 content************************************* */

mongoose.connect("mongodb+srv://root:123@cluster0.u5atqck.mongodb.net/sharespace?retryWrites=true&w=majority", { useNewUrlParser: true ,useUnifiedTopology: true });

app.get('/listingDetails', async(req, res) => {
    
        try {
            const listings = await Listings.find();
            res.status(200).json(listings);
        }
        catch(err) {
            res.status(404).json({message: err.message});
        }
   
});
app.get('/listingDetails/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const listing = await Listings.findById(id);
        res.status(200).json(listing);
    }
    catch(err) {
        res.status(404).json({message: err.message});
    }
});



//Upload function 
app.post('/upload', async(req, res) => {
    const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log(files);
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    console.log({ ext, file });
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${S3_BUCKET}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
    res.json({ links });
})

const config = {
    api: {
        bodyParser: false,
    },
};



app.post('/insert', async(req, res) => {
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

    const newSublet = new Listings({
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
        res.status(200).json(newSublet);
    } catch(err) {
        console.log(err)
    }
});

app.post('/order', async(req, res) => {
    const{
        name,
        phoneNumber,
        startDateTime,
        endDateTime,
        rentAmount,
        securityDepositAmount
        } = req.body;

    const newOrder = new Order({
        name,
        phoneNumber,
        startDateTime,
        endDateTime,
        rentAmount,
        securityDepositAmount
    })
    try {
        await newOrder.save();
        res.status(200).json(newOrder);
    } catch(err) {
        
        res.status(500).json({message: err.message});
    }   
    });

//************************************Route Handlers and APIs*********************************************** */


//************************************************APIs******************************************** */
app.use('/auth',auth);
app.use('/admin',admin);
app.use('/client',client);

app.listen(5000,()=>{console.log("Server has started on port 5000")})

