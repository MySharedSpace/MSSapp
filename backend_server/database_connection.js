const mongoose=require('mongoose')
uri="mongodb+srv://root:123@cluster0.u5atqck.mongodb.net/sharespace?retryWrites=true&w=majority"
async function  connect(){
    try{
        await mongoose.connect(uri);
        console.log('Connected to Mongo DB at password reset');
    }catch(error){
        console.error(error)
    }}
connect()
export default mongoose