const mongoose = require("mongoose");

const TaskInfo = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    taskName: { type: String, required: [true, "Project Name is Required"] },
    taskDesc: { type: String, required: [true, "Project Description is Necessary"] },
    priority: { type: String },
    deadline: { type: String, required: [true, "Select a Deadline for this Task"] },  
    status: { type: String },
    techStacks: { type: [String] },
    teamLead: { type: String, required: [true, "Enter Your Team Leader"] },
})

module.exports = mongoose.model("taskInfo", TaskInfo);  