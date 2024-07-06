const express = require("express")
const { Server } = require("socket.io");
const dotenv = require("dotenv")
const cors = require('cors');
const colors = require("colors")

const connectBD = require("./config/db")
const  { chats }  = require("./data/data")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const {notFound, errorHandler} = require("./middleware/errorMiddeware")

const corsOption = {
    credentials: true,
    origin: ["http://localhost:3000"]
}

const app = express()
dotenv.config()

connectBD()


app.use(express.json()) // to accept json data

app.use(cors(corsOption));


app.get("/", (req, res) => {
    res.send("API is Running")
})

// app.get("/api/chat", (req, res) => {
//     res.send(chats)
// })

// app.get("/api/chat/:id", (req, res) => {
//     const singleChat = chats.find(c => c._id === req.params.id)
//     res.send(singleChat)
// })

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT, 
    console.log(`Server started on port ${PORT}`.yellow.bold)
)


const io= new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected")
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: ", room)
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))


    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
        
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });


    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});