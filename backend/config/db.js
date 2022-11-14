const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            //useFindAndModify:true,
        });

        console.log(`MONGO DB CONNECTED :${conn.connection.host}`.cyan.underline);
    } catch (error){
        console.log(`Error: ${error.message}`.bgRed.bold);
        process.exit();
    }
};

module.exports=connectDB;
