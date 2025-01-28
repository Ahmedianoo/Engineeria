const sql = require('mssql');
const bcrypt = require("bcrypt")
const validator = require("validator")
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

    console.log('Connected to SQL Server! UserMdoel.js');
}

async function UpdatePassword(password, id) {
    try {
        if (!password || !id) {
            throw new Error("All parameters must be passed");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password too weak");
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await sql.connect(config);
        const result = await sql.query(`UPDATE users SET Password = '${hash}', UpdatedAt = GETDATE() WHERE UserId = ${id};`);
        console.log(result.rowsAffected[0])
        // console.log(result.recordset)
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function CreateSubject(user, subject) {
    try {
        //console.log(subject)
        console.log(user.UserId)
        const result = await sql.query(`insert into subject (SubjectCode,Name,Term) values 
            ('${subject.subjectCode}','${subject.subjectName}','${subject.term}')`)

        const teaches = await sql.query(`insert into teaches (TeacherId,SubjectId) values 
                ('${user.UserId}','${subject.subjectCode}')`)

        console.log(teaches.rowsAffected)
        return result.rowsAffected[0]
    }catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function CreateTeam(Team, user) {
    try {
        await sql.connect(config);

        const supervisorID = await sql.query(`select teacherID from Teaches where subjectID='${Team.Subject_Code}';`);

        const result = await sql.query(`INSERT INTO Project_Team (Team_Id,Team_Name,Team_leader_Id,Supervisor_ID,Subject_Code,Team_Size) VALUES (${Team.ID},'${Team.Name}', ${user.ID} ,${supervisorID.recordset[0].teacherID},'${Team.Subject_Code}',1);`);

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetSubjects(User) {
    try {
        console.log(User.UserId)
        const result = await sql.query(`select S.SubjectCode,S.Name,S.Term  from 
            Subject S join Teaches on SubjectCode = SubjectId
            where TeacherId = ${User.UserId};`)
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function ChangeUser(id, name, type, email) {
    try {
        if (!id || !name || !type || !email) {
            throw new Error("All parameters must be passed");
        }

        await sql.connect(config);
        const generalQuery = `UPDATE USERS SET Name='${name}', Email= '${email}', UserType= '${type}' WHERE UserId = ${id};`;

        const changes = await sql.query(generalQuery);

        await sql.connect(config);

        const returnQuery = `SELECT UserId, Name, Email, UserType, CreatedAt, UpdatedAt FROM USERS WHERE UserId = ${id};`;

        const result = await sql.query(returnQuery);

        return result;
        
    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

async function GetSections(subjectquery) {
    try {

        const result = await sql.query(`select SectionId,Timing,ClassCode from Section where SubjectCode = '${subjectquery.subjectcode}'`)
        // console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetTAsForSection(section) {
    try {

        const result = await sql.query(`select Name,Email from Users U 
                join TeacherAssignedToSection T on U.UserId = T.UserId
                where SectionId = ${section.SectionId}
                and UserType='teacherTA'`)
        // console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function GetStudsInSection(section) {
    try {

        const result = await sql.query(`select U.UserId ,U.Name,U.Email from Users U 
                join StudiesIn on StudentId=UserId
                where SectionId = ${section.SectionId}`)
        // console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function RemoveStudentFromSection(studentID, sectionId) {
    try {
        //console.log(studentID, sectionId)
        const result = await sql.query(`delete from StudiesIn where StudentId = ${studentID} and SectionId = ${sectionId}`)
        // console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



async function GetProjectName(subjectcode) {
    try {

        const result = await sql.query(`select ProjectName from Projects 
            where subjectId='${subjectcode}'`)
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function GetProjectTasks(subjectcode) {
    try {

        const result = await sql.query(`select TaskNum,DescriptionOfTask from Projects join Tasks on Projects.ProjectId = Tasks.projectId
            where Projects.subjectId='${subjectcode}'`)
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function GetProjectTeams(subjectcode) {
    try {

        const result = await sql.query(`select TeamId,TeamName,Stud.UserId as TeamLeaderId,Stud.Name As TeamLeaderName,Stud.Email As TeamLeaderMail,TeamSize,TA.name as TAName ,GradeValue
            from ProjectTeam , Users TA , GradeReport G,Users Stud
            where TA.UserType='teacherTA' and SupervisorId=TA.UserId
            and G.ProjectTeamId=TeamId and SubjectCode='${subjectcode}' and Stud.UserId=TeamleaderId`)
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function SubcontainProj(subjectquery) {
    try {

        const result = await sql.query(`select count(*) from Projects where SubjectId='${subjectquery.subjectcode}'`)
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function CreateProject(projectName, subjectcode, User) {
    try {
        //console.log(subject)
        console.log(User.UserId)
        const result = await sql.query(`insert into Projects (ProjectName,TeacherWhoCreatedProject_ID,SubjectId) values 
            ('${projectName}',${User.UserId},'${subjectcode}')`)

        return result.rowsAffected[0]

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



async function AddConnection(ConnectionCode, UserId) {
    try {
        //console.log(subject)
        const userconnect = await sql.query(`select UserId from ConnectionCodes where ConnectionCode = ${ConnectionCode} `)
        const { recordset } = userconnect
        console.log(recordset[0].UserId)
        const connected = await sql.query(`insert into Connections values (${UserId},${recordset[0].UserId}) `)

        const removeConnectionCode = await sql.query(`delete from ConnectionCodes where ConnectionCode = ${ConnectionCode}  `)
        //console.log(connected)
        return connected

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function SaveConnectionCode(UserId) {
    try {
        //console.log(subject)
        var code = Math.floor(100000 + Math.random() * 900000);

        var ConnectionCode = await sql.query(`select ConnectionCode from ConnectionCodes where UserId = ${UserId} `)
        //console.log(ConnectionCode.recordset.length)
        if (ConnectionCode.recordset.length != 0) {
            var { recordset: connectioncode } = ConnectionCode
            console.log(connectioncode[0].ConnectionCode)
            code = connectioncode[0].ConnectionCode
        }

        if (ConnectionCode.recordset.length == 0) {
            console.log('heloo')

            const connected = await sql.query(`insert into ConnectionCodes values (${UserId},${code}) `)


        }
        return code


    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function getConnections(UserId) {
    try {
        //console.log(subject)
        console.log(UserId)
        const connections = await sql.query(`select name,Email from Connections join Users on UserId=ConnectedUser2Id
                where ConnectedUser1Id = ${UserId}
                union
                select name,Email from Connections join Users on UserId=ConnectedUser1Id
                where ConnectedUser2Id = ${UserId}`)

        return connections

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function getTas() {
    try {

        const TAs = await sql.query(`select UserId, Name from Users where UserType = 'teacherTA' and UserId!=30  `)

        return TAs

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function assignTa(TaId, subjectcode) {
    try {

        const TAs = await sql.query(`insert into TeacherAssignedToSection values(${TaId},${subjectcode})`)
        return TAs.rowsAffected[0]

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function assignTaToTeam(TaId, subjectcode) {
    try {

        const TAs = await sql.query(`update ProjectTeam set SupervisorId=${TaId} where TeamId=${subjectcode}`)
        return TAs.rowsAffected[0]

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}


async function AddSection(subjectCode, newTiming) {
    try {
        const generateRandomLetters = () => Array.from({ length: 6 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
        const randomLetters = generateRandomLetters()
        const TAs = await sql.query(`insert into Section (Timing, SubjectCode,ClassCode) values('${newTiming}','${subjectCode}','${randomLetters}')`)
        return TAs.rowsAffected[0]

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



async function GetAllUsers() {
    try {
        await sql.connect(config);

        const generalQuery = `SELECT UserId, Name, Email, UserType, CreatedAt, UpdatedAt FROM USERS;`;

        const result = await sql.query(generalQuery);

        console.log(result.recordset[0]);

        return result;
    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

async function RemoveCertainUser(id) {
    try {
        await sql.connect(config);

        const generalQuery = `DELETE FROM USERS WHERE UserId = ${id};`;

        const result = await sql.query(generalQuery);

        if (result.rowsAffected[0] > 0) {
            return {
                success: true,
                message: `User with ID ${id} deleted successfully.`,
                userId: id,
            };
        } else {
            return {
                success: false,
                message: `No user found with ID ${id}.`,
            };
        }
    } catch (error) {
        console.error('Error: ', error.message);
        throw new Error(`Failed to delete user with ID ${id}: ${error.message}`);
    }
}

Connection();
// UpdatePassword("Hefsea-d9" , 1)
module.exports = { 
    UpdatePassword, 
    CreateSubject,
    GetSubjects, 
    GetSections,
    CreateTeam, 
    ChangeUser, 
    GetAllUsers, 
    RemoveCertainUser,  
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
}
