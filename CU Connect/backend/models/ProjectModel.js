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

    console.log('Connected to SQL Server! ProjectModel.js');
}

async function UpdateProject(Project, id) {
    try {
        if (!Project || !id) {
            throw new Error("All parameters must be passed");
        }
        await sql.connect(config);
        const result = await sql.query(`UPDATE users SET Password = '${hash}', UpdatedAt = GETDATE() WHERE UserId = ${id};`);
        console.log(result.rowsAffected[0])
        // console.log(result.recordset)
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function CreateProject(Team, user) {

    try {

        const supervisorID = await sql.query(`select teacherID from Teaches where subjectID='${Team.Subject_Code}'`);

        const result = await sql.query(`INSERT INTO Project_Team (Team_Id,Team_Name,Team_leader_Id,Supervisor_ID,Subject_Code,Team_Size) VALUES (${Team.ID},'${Team.Name}', ${user.ID} ,${supervisorID.recordset[0].teacherID},'${Team.Subject_Code}',1)`);

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

async function GetAllProjects() {
    try {
        const getAllProjectsQuery = "SELECT ProjectName, Name, " + 
        "SubjectId, P.CreatedAt, P.UpdatedAt " +
        "FROM Projects AS P, Users AS U " +
        "WHERE P.TeacherWhoCreatedProject_ID = U.UserId;";

        const result = await sql.query(getAllProjectsQuery);
        return result;

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

async function GetAllProjectsForCertainTA(id) {
    try {
        if (!id) {
            throw new Error("All parameters must be passed");
        }
        const getAllProjectsQuery =
        `
            SELECT ProjectName, SubjectId, ProjectId
            FROM PROJECTS
            WHERE PROJECTS.SubjectId IN (
                SELECT SubjectCode
                FROM Section, TeacherAssignedToSection
                WHERE TeacherAssignedToSection.UserId = ${id}
            );
        `

        const result = await sql.query(getAllProjectsQuery);

        return result;

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

async function GetAllTasksForACertainProject(UserId) {
    try {
        if (!UserId) {
            throw new Error("All parameters must be passed");
        }
        console.log(UserId)

        const query = `
            SELECT TaskNum, Tasks.ProjectId, DescriptionOfTask, ProjectName, SubjectId, Deadline
            FROM Tasks, Projects 
            WHERE SubjectId IN (
                SELECT Subject.SubjectCode 
                FROM TeacherAssignedToSection, Section, Subject 
                WHERE TeacherAssignedToSection.SectionId = Section.SectionId
                AND Section.SubjectCode = Subject.SubjectCode
                AND TeacherAssignedToSection.UserId = ${UserId}
            );
        `;

        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function CreateNewTask(Task) {
    try {
        if (!Task) {
            throw new Error("All parameters must be passed");
        }
        console.log(Task)
        let QueryChanges
        if (!Task.Deadline) {
            QueryChanges = `
            INSERT INTO Tasks
            (ProjectID, DescriptionOfTask)
            VALUES
            (${Task.ProjectId}, '${Task.DescriptionOfTask}');
        `;
        } else {
            QueryChanges = `
            INSERT INTO Tasks
            (ProjectID, DescriptionOfTask, Deadline)
            VALUES
            (${Task.ProjectId}, '${Task.DescriptionOfTask}', '${Task.Deadline}');
        `;
        }

        const Changes = await sql.query(QueryChanges);
        console.log(Changes)

        const QueryResult = `
            SELECT
            TaskNum, ProjectID, DescriptionOfTask, Deadline, UpdatedAt
            FROM Tasks
            WHERE ProjectID = ${Task.ProjectId}
        `;

        const result = await sql.query(QueryResult);
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function EditTask(Task) {
    try {
        if (!Task) {
            throw new Error("All parameters must be passed");
        }
        console.log(Task)
        let query

        if (!Task.Deadline)
        {
            query = `
            UPDATE Tasks
            SET DescriptionOfTask = '${Task.DescriptionOfTask}'
            WHERE TaskNum = ${Task.TaskNum}
            AND ProjectID = ${Task.ProjectId}
        `;
        } else {
            query = `
            UPDATE Tasks
            SET DescriptionOfTask = '${Task.DescriptionOfTask}',
            DEADLINE = '${Task.Deadline}'
            WHERE TaskNum = ${Task.TaskNum}
            AND ProjectID = ${Task.ProjectId}
        `;
        }
        const result = await sql.query(query);
        console.log(result)
        return result

    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function DeleteTask(Task) {
    try {

        if (!Task) {
            throw new Error("All parameters must be passed");
        }
        console.log(Task)

        const query = `
            DELETE Tasks
            WHERE TaskNum = ${Task.TaskNum}
            AND ProjectID = ${Task.ProjectId}
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

module.exports = { CreateTeam: CreateProject, 
    GetAllProjects, 
    UpdateProject, 
    GetAllProjectsForCertainTA,
    GetAllTasksForACertainProject,
    CreateNewTask,
    EditTask,
    DeleteTask
}