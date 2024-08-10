import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config/DB";
import { ChatRouter } from "./routes/chatRoutes";
import { userRouter } from "./routes/userRoutes";
import { MessageRouter } from "./routes/messageRoutes";
import { errorHandler, notFound } from "./middleware/errormiddleware";
import { ChatType, ClientToServerEvents, CurrentUserType, MessageType, ServerToClientEvents, UserType } from "CommonTypes";

const app: Express=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
dotenv.config();
connectDB();


app.use('/api/chats',ChatRouter)

app.use("/api/users",userRouter);
app.use("/api/messages",MessageRouter);






app.all('*',notFound);
app.use(errorHandler);
let server=app.listen(5000,()=>{
    console.log("listening on port 5000 click on the url",process.env.BACKEND_URL)
})

const io=new Server<ClientToServerEvents,ServerToClientEvents>(server,{
    pingTimeout: 60000,
    cors: {
        origin: "*",
      }
})

io.on('connection',(socket)=>{
    socket.emit('ConnectionEstablishmentFromTheServer');
    console.log('one more user joined the chat with socketid:',socket.id);
    console.log("Connected to the socket.io");
    socket.on('userSetup',(userid)=>{
        console.log('user joined',userid)
        socket.join(userid);
        socket.emit('ChatConnectionAcknowledgement');
    });
    // socket.on('Connect to the chat',(chatid)=>{
    //     socket.join(chatid);
    //     console.log('User with the '+userid+' has joined the socket.io')
    // })
    socket.on('isTyping',(currentchatwithuser: string)=>{
        const {currentchat,currentuser}:{currentchat:ChatType,currentuser: CurrentUserType} = JSON.parse(currentchatwithuser);
        currentchat.users.forEach((user:UserType) => {
            if(user._id!==currentuser._id)
            socket.to(user._id).emit('OthersTyping',currentuser,currentchat);

        });
    })
    socket.on('stopTyping',(currentchatwithuser: string)=>{
        const {currentchat,currentuser}:{currentchat:ChatType,currentuser: CurrentUserType} = JSON.parse(currentchatwithuser);
        currentchat.users.forEach((user:UserType) => {
            if(user._id!==currentuser._id)
            socket.to(user._id).emit('OthersStopTyping',currentuser);

        });
    })
    socket.on('newMessageSent',(wholemessagewithchat: string)=>{
        const {currentchat,messagedetails}:{currentchat:ChatType,messagedetails: MessageType} = JSON.parse(wholemessagewithchat);
        currentchat.users.forEach((user:UserType)=> {
            if(user._id!==messagedetails.sender._id)
            socket.to(user._id).emit('MessageReceived',messagedetails,currentchat);

        });
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})