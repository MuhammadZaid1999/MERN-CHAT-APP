const express = require("express")
const dotenv = require("dotenv")
const cors = require('cors');
const colors = require("colors")

const connectBD = require("./config/db")
const  { chats }  = require("./data/data")

const corsOption = {
    credentials: true,
    origin: ["http://localhost:3000"]
}


const app = express()
dotenv.config()

connectBD()

app.use(cors(corsOption));


app.get("/", (req, res) => {
    res.send("API is Running")
})

app.get("/api/chat", (req, res) => {
    res.send(chats)
})

app.get("/api/chat/:id", (req, res) => {
    const singleChat = chats.find(c => c._id === req.params.id)
    res.send(singleChat)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold))