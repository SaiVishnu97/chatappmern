import mongoose from 'mongoose'

export async function connectDB()
{
    const connectionobj=await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB ${connectionobj.connection.host} is connected to the Backend`);
}

