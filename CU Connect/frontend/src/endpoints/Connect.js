const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token)
    return dataParsed.token
}

const fetchConnections = async (subjectCode) => {
    try {
        const response = await fetch(`/api/user/getconnections`, {
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
        console.log("error in getting connections")
        console.log(error)
        throw error
    }
}

const generateStudentCode = async (subjectCode) => {
    try {
        const response = await fetch(`/api/user/genconnectcode`, {
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
        console.log("error in gen code")
        console.log(error)
        throw error
    }
}


const connectToStudent = async (connectioncode) => {
    try {
        const response = await fetch(`/api/user/connect`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                connectioncode
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
        console.log("error in coennecting to stud")
        console.log(error)
        throw error
    }
}



export { connectToStudent, generateStudentCode, fetchConnections }