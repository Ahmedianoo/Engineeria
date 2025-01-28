const { LeaveProjectTeam ,GetStudentEnrollments , CreateProjectTeam , GetAllProjectTeamsInASection , EnrollInSection, UpdateStudentAssignedToTask , ParticipateInProjectTeam , GetSubjectDoctor , CheckIfUserIsAlreadyInTeamOrCreatedATeam , GetSubjectTA , GetTeamIdAndLeaderId , GetAllStudentsInATeam , KickStudentFromTeam , GetAllTasksForATeam} = require("../models/StudentProjectModel")

const getStudentEnrollments = async ( req , res ) => {
    try {
        const user = req.user
        const result = await GetStudentEnrollments(user.UserId)
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getSubjectDoctor = async ( req , res ) => {
    try {
        // const user = req.user
        console.log(req.body.SubjectCode)
        const result = await GetSubjectDoctor(req.body.SubjectCode)
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateStudentAssignedToTask = async (req, res) => {
    try {
        // console.log(req.body)
        const user = req.user
        const StudentId = req.body.StudentId
        const TaskNum = req.body.TaskNum
        const ProjectTeamId = req.body.ProjectTeamId

        const result = await UpdateStudentAssignedToTask(StudentId , TaskNum , ProjectTeamId)
        res.status(200).json(result) 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getSubjectTA = async ( req , res ) => {
    try {
        // const user = req.user
        console.log(req.body.SectionId)
        console.log(req.body.SubjectCode)
        const result = await GetSubjectTA(req.body.SectionId , req.body.SubjectCode)
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const CheckIfInTeam = async ( req , res ) => {
    try {
        // const user = req.user
        const user = req.user
        // console.log()
        console.log(req.body)
        console.log(req.user.UserId)
        const result = await CheckIfUserIsAlreadyInTeamOrCreatedATeam(user.UserId , req.body.SectionId)
        console.log(`\n\n\n\n\n\n\n${result}\n\n\n\n\n\n\n`)
        res.status(200).json({isParticipating : result})

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const participateInProjectTeam = async ( req , res ) => {
    try {
        const user = req.user
        console.log(req.body)
        // { SectionId: 2, ProjectTeamId: 2 }
        const SectionId = req.body.SectionId
        const ProjectTeamId = req.body.ProjectTeamId

        const result = await ParticipateInProjectTeam(user.UserId, SectionId , ProjectTeamId)
        res.status(200).json({success: "Participated successfuly"})

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const EnrollInASection = async (req, res) => {
    try {
        const user = req.user
        // console.log(req.body.ClassCode)
        const ClassCode = req.body.ClassCode
        console.log(ClassCode)
        const result = await EnrollInSection(user.UserId, ClassCode)
        res.status(200).json({success: "Enrolled successfuly"})

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const kickStudentFromTeam = async (req, res) => {
    try {
        const user = req.user
        const result = await KickStudentFromTeam(req.body.StudentId , req.body.TeamId )
        res.status(200).json({success: "Kicked successfuly"})

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const CreateTeam = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        console.log(data)
        console.log(user.UserId)
        const result = await CreateProjectTeam(data.TeamName , user.UserId , data.SubjectCode)
        res.status(201).json({success : "Team created"}) 

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const GetAllTeamsInSection = async (req, res) => {
    try {
        // console.log(req.body)
        const SectionId = req.body.SectionId
        const SubjectCode = req.body.SubjectCode
        const result = await GetAllProjectTeamsInASection(SectionId , SubjectCode)
        res.status(200).json(result) 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getTeamIdAndLeaderId = async (req, res) => {
    try {
        // console.log(req.body)
        const user = req.user
        const SectionId = req.body.SectionId
        const SubjectCode = req.body.SubjectCode
        console.log(SectionId)
        console.log(SubjectCode)
        const result = await GetTeamIdAndLeaderId(user.UserId , SectionId , SubjectCode)
        res.status(200).json(result) 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllStudentsInATeam = async (req, res) => {
    try {
        // console.log(req.body)
        const user = req.user
        const SectionId = req.body.SectionId
        const SubjectCode = req.body.SubjectCode
        console.log(SectionId)
        console.log(SubjectCode)
        const result = await GetAllStudentsInATeam(user.UserId , SectionId , SubjectCode)
        res.status(200).json(result) 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllTasksForATeam = async (req, res) => {
    try {
        // console.log(req.body)
        const user = req.user
        const SectionId = req.body.SectionId
        const SubjectCode = req.body.SubjectCode
        console.log(SectionId)
        console.log(SubjectCode)
        const result = await GetAllTasksForATeam(user.UserId , SectionId , SubjectCode)
        res.status(200).json(result) 
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const GiveRateTa = async (req, res) => {
    try {
        const { Rate, ToId } = req.body
        const { UserId } = req.user
        const RowsAffected = await AddRating(Rate, UserId, ToId)

        console.log(RowsAffected)
        if (RowsAffected != 0) {
            res.status(200).json("Rate Recieved")
        } else {
            throw new Error("Can't Rate")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const leaveProjectTeam = async ( req , res ) => {
    try {
        const user = req.user
        const TeamId = req.body.TeamId
        const result = await LeaveProjectTeam(user.UserId , TeamId)
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



        module.exports = { 
            leaveProjectTeam , 
            getStudentEnrollments , 
            CreateTeam , 
            GetAllTeamsInSection , 
            EnrollInASection , 
            participateInProjectTeam , 
            getSubjectDoctor , 
            CheckIfInTeam , 
            getSubjectTA , 
            GiveRateTa , 
            getTeamIdAndLeaderId , 
            getAllStudentsInATeam , 
            kickStudentFromTeam , 
            getAllTasksForATeam ,
            updateStudentAssignedToTask
        }
