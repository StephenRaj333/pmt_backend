const express = require("express");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const productData = require("../utils/product.json");
const router = express.Router();

const secret_key = process.env.SECRET_KEY

router.post("/post/signup", async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const hashPassword = await bcrypt.hash(password,10);
        await userSchema.create({name,email,password: hashPassword}); 
        res.status(200).json("Data Posted Successfully");
    } catch(err) {
        res.status(400).json("Error Posting Data");
    }
})

router.post("/post/login", async (req,res) => {
    try {
        const {email,password} = req.body;
        const findEmail = await userSchema.findOne({email: email});
        const matchPassword = await new bcrypt.compare(password, findEmail?.password);
        if(matchPassword) {
            const token =  JWT.sign({name:findEmail?.name ,email:findEmail?.email},secret_key,{expiresIn: "10min"}); 
            res.status(200).json({token: token});
        }else {
            throw new Error 
        }
    } catch(err) {  
        res.status(400).json("Credentials Dont Match"); 
    }
})

const VerifyToken = async (req,res) => {
    try{
        const headerToken = req.headers['token'];
        const verifiedToken = JWT.verify(headerToken,secret_key);
        res.send(verifiedToken);
    } catch(err) {
        res.status(401).json("UnAuthorized Token");
    }
}

router.get("/get/userInfo", VerifyToken, async (req,res) => {   
    try {           
       const data = req.body; 
       res.status(200).send(data);
    } catch(err) {
        err.status(400).json("Error Fetching Product Infos"); 
    }
})

router.get("/get/products", async (req,res) => {
    try {
        await res.status(200).json(productData);
    } catch(err) {
        console.log(err);
    }
})




router.get("/",async (req,res) => {
    res.status(200).json("Hello"); 
})

module.exports = router