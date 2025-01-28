const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token)
    return dataParsed.token
}


const fetchProjectDetails = async (subjectCode) => {
    try {
        const response = await fetch(`/api/user/subjectproject?subjectcode=${subjectCode}`, {
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



const fetchTeamDetails = async (subjectCode) => {
    try {
        const response = await fetch(`/api/user/getprojectteams`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                subjectCode
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



const createProject = async (projectName, subjectcode) => {
    try {
        const response = await fetch("/api/user/createproject", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                projectName: projectName,
                subjectcode: subjectcode
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



const assignSupervisorToTeam = async (teamId, taId) => {
    try {
        const response = await fetch("/api/user/createproject", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                teamId,
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


module.exports = { createProject, fetchProjectDetails, fetchTeamDetails, assignSupervisorToTeam };