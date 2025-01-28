const express = require("express")
const router = express.Router();
const {requireAuth} = require("../middleware/requireAuth")
const { 
    AdminGetAllProjects, 
    TAGetAllProjectsForTA, 
    TAGetAllTasksInProject,
    TACreateNewTask,
    TAEditTask,
    TADeleteTask
} = require('../controllers/ProjectController');

router.use(requireAuth)

// router.post("/test" , test)

router.get("/AdminGetAllProjects", AdminGetAllProjects);

router.get("/TAGetAllProjectsForTA", TAGetAllProjectsForTA);

router.get("/TAGetAllTasksInProject", TAGetAllTasksInProject)

router.post("/TACreateNewTask", TACreateNewTask)

router.put("/TAEditTask", TAEditTask)

router.delete("/TADeleteTask", TADeleteTask)



module.exports = router