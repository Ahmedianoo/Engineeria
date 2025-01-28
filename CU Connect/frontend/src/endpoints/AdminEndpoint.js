const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}

const AdminChangeUser = async (userToBeUpdated) => {
    try {
        console.log("entered AdminEndpoint.js function AdminChangeUser");
        console.log("User to be updated: ",userToBeUpdated);
        const response = await fetch("/api/user/AdminChangeUser", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({ updates: userToBeUpdated })
        });

        if (!response.ok) {
            const err = await response.json();
            throw err;
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error in AdminChangeUser:", error);
        throw error;
    }
};


const AdminGetALlUsers = async () => {
    try {
        console.log("entered AdminEndpoint.js function AdminGetALlUsers")
        const response = await fetch("/api/user/AdminGetALlUsers", {
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

const AdminRemoveCertainUser = async (UserID) => {
    try {
        console.log("entered AdminEndpoint.js function AdminRemoveCertainUser");
        console.log("User to be Removed: ",UserID);
        const response = await fetch("/api/user/RemoveCertainUser", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
            body: JSON.stringify({ UserID })
        });

        if (!response.ok) {
            const err = await response.json();
            throw err;
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error in AdminChangeUser:", error);
        throw error;
    }
};

export {AdminChangeUser, AdminGetALlUsers, AdminRemoveCertainUser}