const sql = require('mssql');
require('dotenv').config()

const config = {
    user: process.env.DATABASE_CONFIG_USERNAME,
    password: process.env.DATABASE_CONFIG_PASSWORD,
    server: process.env.DATABASE_CONFIG_SERVER,
    database: process.env.DATABASE_CONFIG_DATABASE,
    options: {
        trustServerCertificate: true,
    },
};

async function Connection() {

    await sql.connect(config);

    console.log('Connected to SQL Server! ProjectTeamModel.js');
}

async function GetProjectTeamsForCertainTA(User) {
    try {

        if (!User) {
            throw new Error("All parameters must be passed");
        }
        
        console.log(User.UserId)

        const query = `
            SELECT 
                PT.SubjectCode,
                PT.TeamleaderId, 
                U.Name, 
                U.Email,
                PT.TeamName,
                PT.TeamSize,
                PT.TeamId
                FROM ProjectTeam AS PT, Users AS U 
                WHERE PT.SupervisorId = ${User.UserId} 
                AND PT.TeamleaderId = U.UserId;
        `;

        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetStudentsInCertainProjectTeam(TeamId, SuperviserId) {
    try {
        if (!TeamId || !SuperviserId) {
            throw new Error("All parameters must be passed");
        }

        console.log("TeamId: %d, SuperviserId: %d ",TeamId, SuperviserId);

        const query = `
            SELECT 
                U.Name, 
                U.UserId,
                T.DescriptionOfTask,
                ST.TaskNum,
                PT.TeamId
            FROM 
                Users AS U
            INNER JOIN ParticipateInProjectTeam AS PPT
                ON U.UserId = PPT.StudentId
            INNER JOIN ProjectTeam AS PT
                ON PPT.ProjectTeamId = PT.TeamId
            INNER JOIN StudentTaskInProjectTeam AS ST
                ON U.UserId = ST.StudentId 
            AND PT.TeamId = ST.ProjectTeamId
            INNER JOIN Tasks AS T
                ON ST.ProjectId = T.ProjectID
            AND ST.TaskNum = T.TaskNum
            WHERE 
                PPT.ProjectTeamId = ${TeamId}
            AND 
                PT.SupervisorId = ${SuperviserId};
        `;

        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function AssignGradeForCertainTeam(TeacherId, TeamId, GradeValue) {
    try {
        console.log(TeamId)

        if (!TeacherId || !TeamId || !GradeValue) {
            throw new Error("All parameters must be passed");
        }

        const query = `
            INSERT INTO GradeReport
            (ProjectTeamId, GradeValue, TeacherId)
            VALUES
            (${TeamId}, ${GradeValue}, ${TeacherId})
        `;

        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetGradeForCertainTeam(TeamId) {
    try {
        console.log(TeamId)

        if (!TeamId) {
            throw new Error("All parameters must be passed");
        }

        const query = `
            SELECT ProjectTeamId, GradeValue, TeacherId FROM GradeReport WHERE ProjectTeamId = ${TeamId};
        `;

        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



Connection();

module.exports = { 
    GetProjectTeamsForCertainTA,
    GetStudentsInCertainProjectTeam,
    AssignGradeForCertainTeam,
    GetGradeForCertainTeam
}
