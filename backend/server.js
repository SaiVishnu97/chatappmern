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
    console.log('one more user joined the chat with socketid:',socket.id);
    console.log("Connected to the socket.io");
    socket.on('User setup',(userid)=>{
        console.log('user joined',userid)
        socket.join(userid);
        socket.emit('Chat connection acknowlegement');
    });
    // socket.on('Connect to the chat',(chatid)=>{
    //     socket.join(chatid);
    //     console.log('User with the '+userid+' has joined the socket.io')
    // })
    socket.on('Is typing',(currentchatwithuser)=>{
        const {currentchat,currentuser} = JSON.parse(currentchatwithuser);
        currentchat.users.forEach(user => {
            if(user._id!==currentuser._id)
            socket.to(user._id).emit('Others typing',currentuser,currentchat);

        });
    })
    socket.on('stop typing',(currentchatwithuser)=>{
        const {currentchat,currentuser} = JSON.parse(currentchatwithuser);
        currentchat.users.forEach(user => {
            if(user._id!==currentuser._id)
            socket.to(user._id).emit('Others stop typing',currentuser);

        });
    })
    socket.on('new message sent',(wholemessagewithchat)=>{
        const {currentchat,messagedetails} = JSON.parse(wholemessagewithchat);
        currentchat.users.forEach(user => {
            if(user._id!==messagedetails.sender._id)
            socket.to(user._id).emit('Message received',messagedetails,currentchat);

        });
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})