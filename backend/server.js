const express=require('express');
require('dotenv').config();
const cors=require('cors');
const {userRouter}=require('./routes/userRoutes');
const {notFound,errorHandler} =require("./middlewares/errorMiddlewares")
const {chats} =require('./data/data')
const {connectDB}=require('./config/DB');
const { ChatRouter } = require('./routes/chatRoutes');
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
connectDB();
// app.get('/',(req,res)=>{
//     console.log('Home page backend');
// });

app.use('/api/chats',ChatRouter)

app.use("/api/users",userRouter);

app.all('*',notFound);
app.use(errorHandler);
app.listen(5000,()=>{
    console.log("listening on port 5000 click on the url",process.env.BACKEND_URL)
})