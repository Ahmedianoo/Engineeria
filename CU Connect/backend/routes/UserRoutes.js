const express = require("express")
const router = express.Router();
const { 
    UpdateUserPassword, 
    AdminGetALlUsers, 
    AdminChangeUser, 
    AdminRemoveCertainUser,
    DocCreateSubject, 
    DocGetSubjects, 
    DocGetSubjectDetails, 
    RemoveStudFromSection, 
    GetProjectDetails,
    DocGetProjectTeams, 
    subjectConatinProject, 
    DocCreateProject, 
    Connect, 
    GenConnectionCode, 
    GetConnections, 
    GetAllTas, 
    AssignTaToSection, 
    AssignSupervisorToTeam, 
    DocAddSection
}
 = require("../controllers/UserController")
const { requireAuth } = require("../middleware/requireAuth")

router.use(requireAuth)

router.put("/updateuserpass", UpdateUserPassword)

router.post("/createsubject", DocCreateSubject)

router.post("/getsubjects", DocGetSubjects)

router.post("/getsubjectdetails", DocGetSubjectDetails)

router.post("/addnewsection", DocAddSection)

router.post("/removestudent", RemoveStudFromSection)

router.post("/subjectproject", GetProjectDetails)

router.post("/getprojectteams", DocGetProjectTeams)

router.post("/assignsupervisortoteam", AssignSupervisorToTeam)

router.post("/createproject", DocCreateProject)

router.post("/connect", Connect)

router.post("/genconnectcode", GenConnectionCode)

router.post("/getconnections", GetConnections)

router.post("/getalltas", GetAllTas)

router.post("/assigntatosection", AssignTaToSection)

router.post("/test", (req, res) => {
    console.log("hazem basha")
    res.send("hello")
})

router.get("/AdminGetAllUsers", AdminGetALlUsers);

router.put("/AdminChangeUser", AdminChangeUser);

router.delete('/RemoveCertainUser', AdminRemoveCertainUser);

module.exports = router