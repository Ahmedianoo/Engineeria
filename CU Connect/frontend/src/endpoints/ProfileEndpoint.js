const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}


const UpdateUserPassword = async (password) => {
    try {
        const response = await fetch("/api/user/updateuserpass", {
            method : "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
                },
            body : JSON.stringify({password : password})
        })
        if (!response.ok) {
            const err = await response.json()
            throw err;
        }
        // console.log(response)
        // console.log("done")
        const data = await response.json()
        // console.log(data)
        return data
    } catch (error) {
        console.log("error")
        console.log(error)
        throw error
    }
}

// UpdateUserPassword("Hazd")

export {UpdateUserPassword}