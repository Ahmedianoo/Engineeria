const express = require("express")
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth")
const { leaveProjectTeam, getStudentEnrollments , CreateTeam , GetAllTeamsInSection ,EnrollInASection , participateInProjectTeam, updateStudentAssignedToTask , getSubjectDoctor , CheckIfInTeam , getSubjectTA , GiveRateTa , getTeamIdAndLeaderId , getAllStudentsInATeam , kickStudentFromTeam , getAllTasksForATeam} = require("../controllers/StudentProjectController")

router.use(requireAuth)

router.get("/getstudentenrollent", getStudentEnrollments)

router.post("/projectteams", CreateTeam)

router.post("/getprojectteams", GetAllTeamsInSection)

router.post("/enrollinsection", EnrollInASection)

router.post("/participate", participateInProjectTeam)

router.put("/updatetaskassigned" , updateStudentAssignedToTask)

router.post("/getdoctor", getSubjectDoctor)

router.post("/checkifinteam", CheckIfInTeam)

router.post("/getta", getSubjectTA)

router.post("/rateta", GiveRateTa)

router.post("/getteamidAndleaderid" , getTeamIdAndLeaderId)

router.post("/getstudentsinteam" , getAllStudentsInATeam)

router.post("/kickstudentfromteam" , kickStudentFromTeam)

router.post("/getalltasks" , getAllTasksForATeam)

router.delete("/leaveteam" , leaveProjectTeam)

module.exports = router