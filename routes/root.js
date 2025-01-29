const express = require("express");
const userSchema = require("../models/userSchema");
const TaskInfo = require("../models/taskSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const router = express.Router();

const secret_key = process.env.SECRET_KEY

router.post("/post/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await userSchema.create({ name: name, email: email, password: hashPassword });
        res.status(200).send("Data Posted Successfully");
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post("/post/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const findEmail = await userSchema.findOne({ email: email });
        const matchPassword = await new bcrypt.compare(password, findEmail?.password);
        if (matchPassword) {
            const token = JWT.sign({ name: findEmail?.name, email: findEmail?.email }, secret_key, { expiresIn: "1hr" });
            res.status(200).send({ token: token });
        } else {
            throw new Error
        }
    } catch (err) {
        res.status(400).send("Credentials Dont Match");
    }
})

const VerifyToken = async (req, res) => {
    try {
        const headerToken = req.headers['token'];
        const verifiedToken = JWT.verify(headerToken, secret_key);
        res.send(verifiedToken);
    } catch (err) {
        res.status(401).json("UnAuthorized Token");
    }
}

router.get("/get/userInfo", VerifyToken, async (req, res) => {
    try {
        const data = req.body;
        res.status(200).send(data);
    } catch (err) {
        res.status(401).send("UnAuthorized Token");
    }
})

router.post("/post/taskDetails", async (req, res) => {
    try {
        const { userName, userEmail, taskName, taskDesc, priority, deadline, status, techStacks, teamLead } = req.body;
        await TaskInfo.create(
            {
                userName: userName,
                userEmail: userEmail,
                taskName: taskName,
                taskDesc: taskDesc,
                priority: priority,
                deadline: deadline,
                status: status,
                techStacks: techStacks,
                teamLead: teamLead
            });
        res.status(200).send("Task Detail Posted Successfully !");
    } catch (err) {
        res.status(400).send("Error Posting Data", err);
    }
})

router.get("/get/matchUser", async (req, res) => {
    try {
        const { findemail } = req.headers;
        const alluser = await TaskInfo.find({ userEmail: findemail });
        res.status(200).send(alluser);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/update/task", async (req, res) => {   
    try {   
        const { userId, userName, userEmail, taskName, taskDesc, priority, deadline, status, techStacks, teamLead } = req.body; 
        await TaskInfo.findOne({ _id: userId }).replaceOne({ userName, userEmail, taskName, taskDesc, priority, deadline, status, techStacks, teamLead });  
        res.status(200).send("Task Updated Successfully");  
    } catch (err) { 
        res.status(400).send("Error Updating Task", err);   
    }   
})     

router.post("/delete/task", async (req,res) => {
    try {
        const {userId} = req.body; 
        await TaskInfo.findByIdAndDelete({_id: userId}); 
        res.status(200).send("Task Deleted Successfully"); 
    } catch(err) {  
        console.log("Error While Deleting Task",err);
    }   
})

router.get("/", async (req, res) => {
    res.status(200).send("Hello Stephen ! Welcome to Project Management Tool");  
})

module.exports = router