const express = require("express")
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth")
const { test } = require("../controllers/ProjectController")
const { 
    TAGetAllProjectTeamsForCertainTA, 
    TAGetStudentsInCertainProjectTeam,
    TAAssignGradeForTask,
    TAGetGradeForCertainTeam
} = require('../controllers/ProjectTeamsController');

router.use(requireAuth)

router.post("/test" , test)

router.get("/TAGetAllProjectTeamsForCertainTA", TAGetAllProjectTeamsForCertainTA);

router.put("/TAGetStudentsInCertainProjectTeam", TAGetStudentsInCertainProjectTeam);

router.put("/TAAssignGradeForTask", TAAssignGradeForTask);

router.put("/TAGetGradeForCertainTeam", TAGetGradeForCertainTeam);

module.exports = router