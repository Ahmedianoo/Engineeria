const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token)
    return dataParsed.token
}


const fetchSubjectDetails = async (subjectCode) => {
    try {
        const response = await fetch(`/api/user/getsubjectdetails?subjectcode=${subjectCode}`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            // body: JSON.stringify({

            // })
        })

        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        console.log("done")
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error in getting")
        console.log(error)
        throw error
    }
}


const fetchTAs = async () => {
    try {
        const response = await fetch(`/api/user/getalltas`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },

        })

        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        console.log("done")
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error in getting")
        console.log(error)
        throw error
    }
}




const assignTAToSection = async (sectionId, taId) => {
    try {
        const response = await fetch(`/api/user/assigntatosection`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                sectionId,
                taId
            })
        })

        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        console.log("done")
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error in getting")
        console.log(error)
        throw error
    }
}







const removeStudent = async (studentID, sectionId) => {
    try {

        const response = await fetch("/api/user/removestudent", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                studentID,
                sectionId
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        console.log("done")
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error in removing student")
        console.log(error)
        throw error
    }
}


const addSection = async (subjectCode, newTiming) => {
    try {

        const response = await fetch("/api/user/addnewsection", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                subjectCode,
                newTiming
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        console.log("done")
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error in removing student")
        console.log(error)
        throw error
    }
}




export { fetchSubjectDetails, removeStudent, fetchTAs, assignTAToSection, addSection }