const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const ConnectDB = require("./ConnectDB");
const router = require("./routes/root");
dotenv.config();

const Port = process.env.PORT
const app_url = process.env.APPLICATION_URL

const whitelist = [`${app_url}`];  // Whitelisting  
const corsOptions = { 
    origin: function (origin, callback) {   
        if (whitelist.indexOf(origin) !== -1 || !origin) {  
            callback(null, true)    
        } else {    
            callback(new Error('Not allowed by CORS'))  
        }   
    }   
}  

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions))

app.use(router); 

app.use(ConnectDB);

app.listen(Port,() => {
    console.log(`Server Running on Port ${Port}`);
})
