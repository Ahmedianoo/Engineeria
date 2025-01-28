const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}

const GetAllSubjects = async () => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/admindashboard/getallsubjects", {
            method : "GET",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                }
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        // console.log(response)
        const data = await response.json()
        // console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const GetStudentsPerSubject = async () => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/admindashboard/getstudentsinsubject", {
            method : "GET",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                }
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        // console.log(response)
        const data = await response.json()
        // console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const DeleteSubject = async (SubjectCode) => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/admindashboard/deletesubject", {
            method : "DELETE",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SubjectCode : SubjectCode})
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        // console.log(response)
        const data = await response.json()
        // console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const UpdateSubject = async (editedData) => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/admindashboard/updatesubject", {
            method : "PUT",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify(editedData)
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        // console.log(response)
        const data = await response.json()
        // console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

export { GetAllSubjects , GetStudentsPerSubject , DeleteSubject , UpdateSubject} 