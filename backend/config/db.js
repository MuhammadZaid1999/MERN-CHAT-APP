const mongoose = require("mongoose")

const connectBD = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`database connected to host: ${conn.connection.host}`.cyan.underline)

    }catch(error){
        console.log(`Error: , ${error.message}`)
        process.exit()
    }
}

module.exports = connectBD