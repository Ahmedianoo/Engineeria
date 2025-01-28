const { GetProjectTeamsForCertainTA, GetStudentsInCertainProjectTeam, AssignGradeForCertainTeam , GetGradeForCertainTeam} = require("../models/ProjectTeamModel");

const TAGetAllProjectTeamsForCertainTA = async (req, res) => {
    try {
        const user = req.user

        console.log(user);
        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        

        const result =  await GetProjectTeamsForCertainTA(user);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TAGetStudentsInCertainProjectTeam = async (req, res) => {
    try {
        const user = req.user;

        console.log(user);
        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }

        const TeamId = req.body.TeamId;
        console.log("TeamId : ", TeamId);
        console.log("body of request: ",req.body);

        const result =  await GetStudentsInCertainProjectTeam(TeamId, user.UserId);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const TAGetGradeForCertainTeam = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);
        const TeamId = req.body.TeamId;

        const result =  await GetGradeForCertainTeam(TeamId);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}


const TAAssignGradeForTask = async (req, res) => {
    try {
        const user = req.user

        if (user.UserType === 'student') {
            throw new Error("Not enough privilage");
        }
        console.log(user);

        const GradeValue = req.body.GradeValue;
        const TeamId = req.body.TeamId;
        const result =  await AssignGradeForCertainTeam(user.UserId, TeamId, GradeValue);

        res.status(200).json({success : "Retrived sucessfully", result: result});

    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

module.exports = { 
    TAGetAllProjectTeamsForCertainTA, 
    TAGetStudentsInCertainProjectTeam,
    TAAssignGradeForTask,
    TAGetGradeForCertainTeam
}