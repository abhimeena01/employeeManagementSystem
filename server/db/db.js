import mongoose from "mongoose";
const connectToDatabase =async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB conncect successfully");

    }catch(error){
        console.log("mongodb connection failed",error.message);
        process.exit(1)
    }
    

}
export default connectToDatabase