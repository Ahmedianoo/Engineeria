const sql = require('mssql');
require('dotenv').config();

// Database configuration
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
    console.log('Connected to SQL Server!');
}

async function GetStudentEnrollments(UserId) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select Timing , Section.SectionId , Name , Subject.SubjectCode , StudentId from StudiesIn , Section , Subject where StudentId = ${UserId} AND Section.SectionId = StudiesIn.SectionId and Section.SubjectCode = Subject.SubjectCode`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function UpdateStudentAssignedToTask(StudentId , TaskNum , ProjectTeamId) {
    try {
        await sql.connect(config);
        // const res1 = await GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode)
        // console.log(res1[0].TeamId)
        const result = await sql.query(`UPDATE StudentTaskInProjectTeam
        SET StudentId = ${StudentId}
        WHERE TaskNum = ${TaskNum} and ProjectTeamId = ${ProjectTeamId}`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetSubjectDoctor(SubjectCode) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select distinct U.UserId , U.Name , U.Email
        from Teaches T , Subject S, Users U
        where T.SubjectId = '${SubjectCode}' and T.TeacherId = U.UserId `);
        console.log(result.recordset[0])
        return result.recordset[0]
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetSubjectTA(SectionId , SubjectCode) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select distinct U.UserId , U.Name , U.Email
        from TeacherAssignedToSection T , Section S, Users U
        where T.SectionId = ${SectionId} and T.UserId = U.UserId  and S.SubjectCode = '${SubjectCode}'`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function CheckIfUserIsAlreadyInTeamOrCreatedATeam( UserId , SectionId  ) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select count(*) AS CheckIfStudentInTeam
        from ParticipateInProjectTeam
        where ParticipateInProjectTeam.StudentId = ${UserId} and ParticipateInProjectTeam.SectionId = ${SectionId}`);
        console.log(result.recordset[0].CheckIfStudentInTeam)
        if(result.recordset[0].CheckIfStudentInTeam === 0){
            return false;
        }
        return true;
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetSectionIdFromUserId(UserId) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select StudiesIn.SectionId 
                                        from StudiesIn 
                                        where StudiesIn.StudentId = ${UserId}`);
        // console.log(result.recordset[0].SectionId)
        return result.recordset[0].SectionId
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetAllProjectTeamsInASection(SectionId , SubjectCode) {
    try {
        await sql.connect(config);
        console.log(SectionId)
        console.log(SubjectCode)
        // const SectionId = await GetSectionIdFromUserId(UserId)
        const result = await sql.query(`select TeamId , Users.UserId , ProjectTeam.TeamName , Users.Name, Users.Email
        from ProjectTeam , StudiesIn , Users
        where ProjectTeam.TeamleaderId = StudiesIn.StudentId and StudiesIn.SectionId = ${SectionId} and ProjectTeam.TeamleaderId = Users.UserId and ProjectTeam.SubjectCode = '${SubjectCode}'`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetProjectID(SubjectCode) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select ProjectId 
        from Projects , Subject
        where Projects.SubjectId = Subject.SubjectCode and Subject.SubjectCode = '${SubjectCode}'`);
        console.log("here: " + result.recordset[0].ProjectId)
        return result.recordset[0].ProjectId
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetSectionIdUsingClassCode(ClassCode) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select SectionId
        from Section 
        where Section.ClassCode = '${ClassCode}'`);
        console.log(result.recordset[0].SectionId)
        return result.recordset[0].SectionId
    } catch (error) {
        console.log('Error11: ', error);
        throw error;
    }
}
// GetSectionIdUsingClassCode("DEJDHC")


async function EnrollInSection(UserId, ClassCode) {
    try {
        await sql.connect(config);
        const SectionId = await GetSectionIdUsingClassCode(ClassCode)
        // console.log(SectionId)
        const result = await sql.query(`insert into StudiesIn(StudentId , SectionId) VALUES (${UserId} , ${SectionId})`);
        console.log("here: " + result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error12: ', error);
        throw error;
    }
}


async function CreateProjectTeam(TeamName, TeamleaderId, SubjectCode) {
    try {
        await sql.connect(config);
        const ProjectId = await GetProjectID(SubjectCode)
        const result = await sql.query(`INSERT INTO ProjectTeam (TeamName, TeamleaderId, ProjectId, SubjectCode)
                                        VALUES 
                                        ('${TeamName}', ${TeamleaderId}, ${ProjectId}, '${SubjectCode}');`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function  ParticipateInProjectTeam(StudentId , SectionId , ProjectTeamId) {
    try {
        await sql.connect(config);
        const result = await sql.query(`insert into ParticipateInProjectTeam(StudentId , SectionId , ProjectTeamId) values (${StudentId} , ${SectionId} , ${ProjectTeamId});`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode) {
    try {
        await sql.connect(config);
        const result = await sql.query(`select TeamId , TeamleaderId  
        from ProjectTeam , ParticipateInProjectTeam
        where ProjectTeam.SubjectCode = '${SubjectCode}' and ParticipateInProjectTeam.SectionId = ${SectionId} and ParticipateInProjectTeam.StudentId = ${StudentId}
        and TeamId = ProjectTeamId`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetAllTasksForATeam(StudentId , SectionId , SubjectCode) {
    try {
        await sql.connect(config);
        const res1 = await GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode)

        const result = await sql.query(`SELECT Tasks.TaskNum, DescriptionOfTask, Tasks.ProjectID, StudentTaskInProjectTeam.StudentId , Users.Name
            FROM Tasks
            JOIN ProjectTeam ON ProjectTeam.ProjectId = Tasks.ProjectID
            LEFT OUTER JOIN StudentTaskInProjectTeam ON Tasks.TaskNum = StudentTaskInProjectTeam.TaskNum
            LEFT OUTER  JOIN Users on Users.UserId = StudentTaskInProjectTeam.StudentId
            WHERE ProjectTeam.TeamId = ${res1[0].TeamId};`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetAllStudentsInATeam(StudentId , SectionId , SubjectCode) {
    try {
        await sql.connect(config);
        const res1 = await GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode)
        // console.log(res1[0].TeamId)
        const result = await sql.query(`select UserId , Name , Email  from ParticipateInProjectTeam , Users where ProjectTeamId = ${res1[0].TeamId} and Users.UserId = ParticipateInProjectTeam.StudentId`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function KickStudentFromTeam(StudentId , TeamId) {
    try {
        await sql.connect(config);
        // const res1 = await GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode)
        // console.log(res1[0].TeamId)
        const result = await sql.query(`delete from ParticipateInProjectTeam where StudentId = ${StudentId} and ProjectTeamId = ${TeamId}`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function AddRating(Rate, UserId, ToId) {
    try {

        const TAs = await sql.query(`insert into Feedback values(${Rate},${UserId},${ToId})`)
        return TAs.rowsAffected[0]

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
} 

async function LeaveProjectTeam(StudentId , TeamId) {
    try {
        await sql.connect(config);
        // const res1 = await GetTeamIdAndLeaderId(StudentId , SectionId , SubjectCode)
        // console.log(res1[0].TeamId)
        const result = await sql.query(`delete from ParticipateInProjectTeam where StudentId = ${StudentId} and ProjectTeamId = ${TeamId}`);
        console.log(result.recordset)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



// GetAllStudentsInATeam(36 , 11 , 'cmps201')

Connection();
module.exports = { 
    LeaveProjectTeam ,
    GetStudentEnrollments , 
    CreateProjectTeam , 
    GetAllProjectTeamsInASection ,
     EnrollInSection , 
     ParticipateInProjectTeam , 
     GetSubjectDoctor , 
     CheckIfUserIsAlreadyInTeamOrCreatedATeam , 
     GetSubjectTA , 
     AddRating , 
     GetTeamIdAndLeaderId , 
     GetAllStudentsInATeam , 
     KickStudentFromTeam , 
     GetAllTasksForATeam ,
     UpdateStudentAssignedToTask
}; 
