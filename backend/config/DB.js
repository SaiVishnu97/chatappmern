const mongoose=require('mongoose');

async function connectDB()
{
    const connectionobj=await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB ${connectionobj.connection.host} is connected to the Backend`);
}

module.exports={connectDB}