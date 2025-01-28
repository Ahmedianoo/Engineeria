const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}

const TAGetAllProjectTeamsForCertainTA = async (TeamId) => {
    try {
        console.log("entered TAEndpoint.js function TAGetAllProjectTeamsForCertainTA")
        const response = await fetch("/api/projectTeams/TAGetAllProjectTeamsForCertainTA", {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAGetStudentsInCertainProjectTeam = async (TeamId) => {
    try {
        console.log("entered TAEndpoint.js function TAGetStudentsInCertainProjectTeam")
        const response = await fetch("/api/projectTeams/TAGetStudentsInCertainProjectTeam", {
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({ TeamId : TeamId })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAGetAllProjectsForTA = async () => {
    try {
        console.log("entered TAEndpoint.js function TAGetAllProjectsForTA")
        const response = await fetch("/api/projects/TAGetAllProjectsForTA", {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAGetAllTasksInProject = async (Task) => {
    try {
        console.log("entered TAEndpoint.js function TAGetAllTasksInProject")
        const response = await fetch("/api/projects/TAGetAllTasksInProject", {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TACreateNewTask = async (Task) => {
    try {
        console.log("entered TAEndpoint.js function TACreateNewTask")
        console.log("New task: ",Task);
        const response = await fetch("/api/projects/TACreateNewTask", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({
                Task: Task
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAEditTask = async (Task) => {
    try {
        console.log("entered TAEndpoint.js function TAEditTask")

        console.log(Task);
        const response = await fetch("/api/projects/TAEditTask", {
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({
                Task: Task
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TADeleteTask = async (Task) => {
    try {
        console.log("entered TAEndpoint.js function TADeleteTask")

        console.log(Task);
        const response = await fetch("/api/projects/TADeleteTask", {
            method : "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({
                Task: Task
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAGetGradeForCertainTeam = async (TeamId) => {
    try {
        console.log("entered TAEndpoint.js function TAGetGradeForCertainTeam")
        const response = await fetch("/api/projectTeams/TAGetGradeForCertainTeam", {
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({
                TeamId
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

const TAAssignGradeForTask = async (GradeValue, TeamId) => {
    try {
        console.log("entered TAEndpoint.js function TAAssignGradeForTask")
        const response = await fetch("/api/projectTeams/TAAssignGradeForTask", {
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`
                },
            body: JSON.stringify({
                GradeValue,
                TeamId
            })
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        console.log(response)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

export { 
    TAGetStudentsInCertainProjectTeam,
    TAGetAllProjectTeamsForCertainTA,
    TAGetAllProjectsForTA,
    TAGetAllTasksInProject,
    TACreateNewTask,
    TAEditTask,
    TADeleteTask,
    TAAssignGradeForTask,
    TAGetGradeForCertainTeam
 }