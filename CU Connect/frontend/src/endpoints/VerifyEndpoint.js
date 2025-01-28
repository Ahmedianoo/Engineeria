const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}


const VerifyUser = async (email) => {
    try {
        // console.log("hello world")
        const response = await fetch("/api/auth/verify", {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
                },
            body : JSON.stringify({email})
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


export {VerifyUser}