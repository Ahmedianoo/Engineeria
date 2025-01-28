const { 
    GetAllProjects, 
    UpdateProject,     
    GetAllProjectsForCertainTA,
    GetAllTasksForACertainProject,
    CreateNewTask,
    EditTask,
    DeleteTask
} = require('../models/ProjectModel')

const test = async (req , res) => {
    console.log("hello")
    res.json({msg : "test succesful"});
}

const AdminGetAllProjects = async (req, res) => {
    try {
        const user = req.user

        console.log(req);

        if (user.UserType !== 'admin') {
            throw new Error("Tried to accesss admin-privliaged action");
        }

        const result =  await GetAllProjects();

        res.status(200).json({success : "Retrived sucessfully", result: result});
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TAGetAllProjectsForTA = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(req);

        const result =  await GetAllProjectsForCertainTA(user.UserId);

        res.status(200).json({success : "Retrived sucessfully", result: result});
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TAGetAllTasksInProject = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);

        const result =  await GetAllTasksForACertainProject(user.UserId);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TACreateNewTask = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);
        const Task = req.body.Task;
        console.log(Task);

        const result =  await CreateNewTask(Task);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TAEditTask  = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);
        const Task = req.body.Task;
        console.log(Task);

        const result =  await EditTask(Task);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TADeleteTask  = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);
        const Task = req.body.Task;
        console.log(Task);

        const result =  await DeleteTask(Task);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

module.exports = { 
    test, 
    AdminGetAllProjects, 
    TAGetAllProjectsForTA, 
    TAGetAllTasksInProject,
    TACreateNewTask,
    TAEditTask,
    TADeleteTask
}