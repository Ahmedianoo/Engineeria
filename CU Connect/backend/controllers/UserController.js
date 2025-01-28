const { 
    UpdatePassword,
    RemoveCertainUser, 
    ChangeUser,
    GetAllUsers,
    CreateSubject,
    CreateTeam, 
    GetSubjects, 
    GetSections, 
    GetTAsForSection, 
    GetStudsInSection, 
    RemoveStudentFromSection, 
    GetProjectName, 
    GetProjectTasks, 
    GetProjectTeams, 
    SubcontainProj, 
    CreateProject, 
    AddConnection, 
    SaveConnectionCode, 
    getConnections, 
    getTas, 
    assignTa, 
    assignTaToTeam, 
    AddSection
 } = require("../models/UserModel")
 
function validateUserType(type) {
    //  Constraint: ([UserType]='teacherDoctor' OR [UserType]='teacherTA' OR [UserType]='student' OR [UserType]='admin')

    switch (type) {
        case 'teacherDoctor':
            return;
        case 'teacherTA':
            return;
        case 'student':
            return;
        case 'admin':
            return;
        default:
            throw new Error("Invalid UserType");
    }
}

const UpdateUserPassword = async (req, res) => {
    try {
        const user = req.user
        const newPassword = req.body.password
        // console.log("User: " ,  user)
        await UpdatePassword(newPassword, user.UserId)
        res.status(200).json({ success: "Password updated succesfuly" })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const DocCreateSubject = async (req, res) => {
    try {
        console.log(req.body)
        const subject = req.body.Subject.formdata
        //console.log(subject)
        const user = req.user

        //console.log("User: ", user)
        const RowsAffected = await CreateSubject(user, subject)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "created subject" })
        } else {
            throw new Error("no rows affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const DocGetSubjects = async (req, res) => {
    try {
        const User = req.user
        console.log("User: ", User)
        const Rows = await GetSubjects(User)
        const { recordset } = Rows
        // console.log(recordsets)
        if (Rows != 0) {
            res.status(200).json({ recordset })
        } else {
            throw new Error("no Subjects :(")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const AdminGetALlUsers = async (req, res) => {
    try {
        console.log("Heard call AdminGetAllUsers");
        const user = req.user
        validateUserType(user.UserType);

        if (user.UserType !== 'admin') {
            throw new Error("Tried to accesss admin-privliaged action");
        }
        const result =  await GetAllUsers();
        res.status(200).json({success : "Retrived sucessfully", result: result});
        
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const DocGetSubjectDetails = async (req, res) => {
    try {
        //const User = req.user
        //console.log(req)
        // const subject = req.body.subject
        const subjectquery = req.query
        //console.log(subjectquery)
        const QuerySections = await GetSections(subjectquery)

        const { recordset: sections } = QuerySections
        console.log(sections)
        for (section of sections) {
            //console.log(section.SectionId)

            const QueryTAInSection = await GetTAsForSection(section)
            const { recordset: TAInSection } = QueryTAInSection
            section.SectionTA = TAInSection

            const QueryStudsInSection = await GetStudsInSection(section)
            const { recordset: StudsInSection } = QueryStudsInSection
            section.SectionStudents = StudsInSection
            //console.log(section.sectionTA)


        }


        console.log(sections)

        if (sections) {
            res.status(200).json({ sections })
        } else {
            throw new Error("no Details :(")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const RemoveStudFromSection = async (req, res) => {
    try {
        const { studentID, sectionId } = req.body
        console.log(studentID, sectionId)
        const Rows = await RemoveStudentFromSection(studentID, sectionId)
        const { recordset } = Rows
        // console.log(recordsets)
        if (Rows != 0) {
            res.status(200).json("student deleted")
        } else {
            throw new Error("Student not deleted")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const subjectConatinProject = async (req, res) => {
    try {
        const { subjectcode } = req.query
        console.log(subjectcode)
        const Rows = await SubcontainProj(subjectcode)
        const { recordset } = Rows
        // console.log(recordsets)
        if (Rows != 0) {
            res.status(200).json("student deleted")
        } else {
            throw new Error("Student not deleted")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const AdminChangeUser = async (req, res) => {
    try {
        console.log("Heard call AdminChangeUser");
        const user = req.user;

        console.log(user);
        
        validateUserType(user.UserType);
        if (user.UserType !== 'admin') {
            throw new Error("Tried to accesss admin-privliaged action");
        }

        const id = req.body.updates.UserId;
        const finalName = req.body.updates.Name;
        const finalUserType = req.body.updates.UserType;
        const finalEmail = req.body.updates.Email;

        const result =  await ChangeUser(id, finalName, finalUserType, finalEmail);
        res.status(200).json({success : "changed sucessfully", result: result});
        
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const AdminRemoveCertainUser = async (req, res) => {
    try {
        const user = req.user
        validateUserType(user.UserType);

        console.log(user);
        console.log(req.body);
        if (user.UserType !== 'admin') {
            throw new Error("Tried to accesss admin-privliaged action");
        }

        const id = req.body.UserID;
        console.log("id to be removed: ", id);
        const result =  await RemoveCertainUser(id);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}


const GetProjectDetails = async (req, res) => {
    try {
        const { subjectcode } = req.query
        console.log(subjectcode)
        Project = {}
        const QueryProjectName = await GetProjectName(subjectcode)
        const QueryProjectTasks = await GetProjectTasks(subjectcode)

        const { recordset: ProjectNameQuery } = QueryProjectName
        Project.name = ProjectNameQuery
        console.log("name:", Project.name)
        const { recordset: ProjectTasksQuery } = QueryProjectTasks
        Project.tasks = ProjectTasksQuery
        console.log(Project)



        if (ProjectNameQuery) {
            res.status(200).json(Project)
        } else {
            throw new Error("no project Details :(")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const DocGetProjectTeams = async (req, res) => {
    try {
        const { subjectCode } = req.body
        console.log(subjectCode)

        const QueryTeams = await GetProjectTeams(subjectCode)
        const { recordset: teams } = QueryTeams

        if (QueryTeams) {
            res.status(200).json(teams)
        } else {
            throw new Error("no project Teams :(")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocCreateProject = async (req, res) => {
    try {
        //console.log(req.body)
        const { projectName, subjectcode } = req.body
        const User = req.user

        //console.log("User: ", user)

        const RowsAffected = await CreateProject(projectName, subjectcode, User)


        if (RowsAffected != 0) {
            res.status(200).json({ success: "created project" })
        } else {
            throw new Error("no rows affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const Connect = async (req, res) => {
    try {
        //console.log(req.body)
        const { connectioncode } = req.body
        const { UserId } = req.user
        //console.log("User: ", user)

        const RowsAffected = await AddConnection(connectioncode, UserId)


        if (RowsAffected != 0) {
            res.status(200).json({ success: "user connected to another user" })
        } else {
            throw new Error("cant create project")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const GenConnectionCode = async (req, res) => {
    try {
        const { UserId } = req.user
        const code = await SaveConnectionCode(UserId)
        const ConnectionCode = code

        console.log(ConnectionCode)

        if (ConnectionCode) {
            res.status(200).json({ ConnectionCode })
        } else {
            throw new Error("cant get connection code")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const GetConnections = async (req, res) => {
    try {
        const { UserId } = req.user
        console.log(UserId)
        const RowsAffected = await getConnections(UserId)
        const { recordset: connections } = RowsAffected
        if (RowsAffected != 0) {
            res.status(200).json({ connections })
        } else {
            throw new Error("Cant get connections")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}




const GetAllTas = async (req, res) => {
    try {
        const RowsAffected = await getTas()

        const { recordset: TAs } = RowsAffected
        console.log(TAs)
        if (RowsAffected != 0) {
            res.status(200).json({ TAs })
        } else {
            throw new Error("Cant get TAs")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}




const AssignTaToSection = async (req, res) => {
    try {
        const { taId, sectionId } = req.body
        const RowsAffected = await assignTa(taId, sectionId)

        //const { recordset: TAs } = RowsAffected
        console.log(RowsAffected)
        if (RowsAffected != 0) {
            res.status(200).json("Ta assigned")
        } else {
            throw new Error("Cant assign TAs")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const AssignSupervisorToTeam = async (req, res) => {
    try {
        const { taId, teamId } = req.body
        const RowsAffected = await assignTaToTeam(taId, teamId)

        //const { recordset: TAs } = RowsAffected
        console.log(RowsAffected)
        if (RowsAffected != 0) {
            res.status(200).json("Ta assigned")
        } else {
            throw new Error("Cant assign TAs")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocAddSection = async (req, res) => {
    try {
        const { subjectCode, newTiming } = req.body
        const RowsAffected = await AddSection(subjectCode, newTiming)


        console.log(RowsAffected)
        if (RowsAffected != 0) {
            res.status(200).json("Section Created")
        } else {
            throw new Error("Cant assign TAs")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { 
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
