const {GetSubjects , GetStudentsPerSubject , deleteSubject , UpdateSubject} = require("../models/AdminDashboardModel")

const GetAllSubjects = async (req , res) => {
    try {
        // console.log(req.user)
        const Subjects = await GetSubjects();
        res.json(Subjects)
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({ error: error.message }); 
    }
}

const GetStudentsInSubject = async (req , res) => {
    try {
        const Subjects = await GetStudentsPerSubject();
        // console.log(Subjects)
        res.json(Subjects)
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({ error: error.message }); 
    }
}

const DeleteSubject = async (req , res) => {
    try {
        // console.log("hello")
        // console.log(req.body)
        const result = await deleteSubject(req.body.SubjectCode);
        // console.log(result)
        if(result === 0){
            throw new Error("No subject deleted");
        }
        res.json({success: "subject deleted succesfully"})
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({ error: error.message }); 
    }
}
const updateSubject = async (req , res) => {
    try {
        // console.log("hello")
        const NewData = req.body
        // console.log(req.body)
        const result = await UpdateSubject(NewData);
        // console.log(result)
        if(result === 0){
            throw new Error("No subject Updated");
        }
        res.json({success: "subject Updated succesfully"})
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({ error: error.message }); 
    }
}

module.exports = {GetAllSubjects , GetStudentsInSubject, DeleteSubject , updateSubject}