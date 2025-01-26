const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const CONNECTION_STRING = process.env.MONGO_URI

const ConnectDB = async () => { 
    try {
        await mongoose.connect(`${CONNECTION_STRING}`).then(() => {
            console.log("Successfully Connected to Mongo Db");
        })
    } catch(err) {
        console.log("Error Connecting to mongo DB");
    }
}

ConnectDB();    

module.exports = ConnectDB