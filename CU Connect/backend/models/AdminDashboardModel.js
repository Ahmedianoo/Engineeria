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

async function GetSubjects() {
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM Subject`);
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function GetStudentsPerSubject() {
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT sub.SubjectCode, COUNT(si.StudentId) AS NumberOfStudents FROM Subject sub JOIN Section sec ON sub.SubjectCode = sec.SubjectCode JOIN StudiesIn si ON sec.SectionId = si.SectionId GROUP BY sub.SubjectCode, sub.Name;`);
        // console.log(result)
        return result.recordset
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

async function deleteSubject(subjectCode) {
    try {
        await sql.connect(config);

        const request = new sql.Request();

        const result = await request
            .input('SubjectCode', sql.NVarChar, subjectCode)
            .execute('DeleteSubjectData');
        return result.rowsAffected[24]
    } catch (error) {
        console.error('Error deleting subject:', error);
        throw error;
    }
}

async function UpdateSubject({SubjectCode , Name , Term}) {
    try {
        await sql.connect(config);
        const result = await sql.query(`UPDATE Subject SET Name = '${Name}', Term = '${Term}', UpdatedAt = GETDATE() WHERE SubjectCode = '${SubjectCode}';`);
        console.log(result.rowsAffected[0])
        return result.rowsAffected[0]
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}



Connection();

module.exports = { GetSubjects , GetStudentsPerSubject, deleteSubject , UpdateSubject};
