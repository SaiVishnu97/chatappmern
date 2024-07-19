const express=require('express');
require('dotenv').config();
const cors=require('cors');
const {userRouter}=require('./routes/userRoutes');
const {notFound,errorHandler} =require("./middlewares/errorMiddlewares")
const {chats} =require('./data/data')
const {connectDB}=require('./config/DB');
const { ChatRouter } = require('./routes/chatRoutes');
const MessageRouter = require('./routes/messageRoutes');
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
app.use("/api/messages",MessageRouter);






app.all('*',notFound);
app.use(errorHandler);
let server=app.listen(5000,()=>{
    console.log("listening on port 5000 click on the url",process.env.BACKEND_URL)
})
const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: "*",
      }
});
io.on('connection',(socket)=>{
    socket.emit('connection establishment from the server');
    console.log("Connected to the socket.io");
    socket.on('User setup',(chatid)=>{
        socket.join(chatid);
        socket.emit('Chat connection acknowlegement');
    });
    socket.on('new message sent',(wholemessagewithchatid)=>{
        const {chatid,messagedetails} = JSON.parse(wholemessagewithchatid);
        console.log('new message sent');
        socket.to(chatid).emit('Message received');
    })
})