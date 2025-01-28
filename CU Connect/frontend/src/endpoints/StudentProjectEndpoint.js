const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}

const GetStudentEnrollments = async () => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/studentproject/getstudentenrollent", {
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

const CreateProjectTeam = async (ProjectTeamDetails) => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/studentproject/projectteams", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify(ProjectTeamDetails)
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

const GetProjectTeamsInSection = async (SectionId , subjectCode) => {
    try {
        console.log(SectionId )
        console.log( "hello" )
        console.log( subjectCode )
        // console.log("hello world")
        const response = await fetch("/api/studentproject/getprojectteams", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , SubjectCode : subjectCode})
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const EnrollInSection = async (ClassCode) => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/studentproject/enrollinsection", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({ClassCode : ClassCode})
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}


const ParticipateInProjectTeam = async (SectionId , ProjectTeamId) => {
    try {
        const response = await fetch("/api/studentproject/participate", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , ProjectTeamId : ProjectTeamId})
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const CheckIfUserInTeam = async (SectionId) => {
    try {
        const response = await fetch("/api/studentproject/checkifinteam", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const GetSubjectDoctor = async (SubjectCode) => {
    try {
        const response = await fetch("/api/studentproject/getdoctor", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SubjectCode : SubjectCode })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const GetSubjectTA = async (SectionId , SubjectCode) => {
    try {
        const response = await fetch("/api/studentproject/getta", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , SubjectCode : SubjectCode })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const GetTeamIdAndLeaderId = async (SectionId , SubjectCode) => {
    try {
        const response = await fetch("/api/studentproject/getteamidAndleaderid", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , SubjectCode : SubjectCode })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const GetAllStudentsInATeam = async (SectionId , SubjectCode) => {
    try {
        const response = await fetch("/api/studentproject/getstudentsinteam", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , SubjectCode : SubjectCode })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}
const GetAllTasksForATeam = async (SectionId , SubjectCode) => {
    try {
        const response = await fetch("/api/studentproject/getalltasks", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({SectionId : SectionId , SubjectCode : SubjectCode })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

const KickStudentFromTeam = async (StudentId , TeamId) => {
    try {
        const response = await fetch("/api/studentproject/kickstudentfromteam", {
            method : "POST",
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`
                },
                body : JSON.stringify({StudentId : StudentId , TeamId : TeamId })
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
        console.log("error: ")
        console.log(error)
        throw error
    }
}

export {GetStudentEnrollments , CreateProjectTeam , GetProjectTeamsInSection ,EnrollInSection , ParticipateInProjectTeam , CheckIfUserInTeam , GetSubjectDoctor , GetSubjectTA , GetTeamIdAndLeaderId , GetAllStudentsInATeam , KickStudentFromTeam , GetAllTasksForATeam} 
