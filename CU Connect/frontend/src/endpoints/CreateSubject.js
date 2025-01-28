const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token)
    return dataParsed.token
}

const AddSubject = async (formdata) => {
    try {
        console.log(formdata)
        const response = await fetch("/api/user/createsubject", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({
                Subject: {
                    formdata
                }
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
        console.log("error in adding")
        console.log(error)
        throw error
    }
}

const GetSubjects = async () => {
    try {
        const response = await fetch("/api/user/getsubjects", {
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










// UpdateUserPassword("Hazd")

export { AddSubject, GetSubjects }