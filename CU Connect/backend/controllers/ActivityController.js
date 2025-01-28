const { CreateActivity, RemoveActivity ,CreateGroupActivity, DeleteGroupActivity, AddParticipant, DeleteParticipant, AllParticipants, GroupSize, GroupaActivity, AllGroups, AllActivities, GroupsOfActivity, AllLocations, DeleteGroupActivityLeader } = require("../models/ActivityModel")




const test = async (req , res) => {
    console.log(req.user)
    res.json({msg : "test succesful"});
}

module.exports = {test}


const DocCreateActivity = async (req, res) => {
    try {

        const name = req.body.ActivityName

        const RowsAffected = await CreateActivity(name)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "Created Activity" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const DocRemoveActivity = async (req, res) => {
    try {

        const name = req.body.ActivityName

        const RowsAffected = await RemoveActivity(name)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "Deleted Activity" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const DocCreateGroupActivity = async (req, res) => {
    try {

        const activityName = req.body.ActivityName
        const locationName = req.body.LocationName
        const user = req.user


        const RowsAffectedGroup = await CreateGroupActivity(activityName, locationName, user)
        if (RowsAffectedGroup != 0) {
            res.status(200).json({ success: "Created Group Activity" })
        } else {
            throw new Error("No Rows of Group Affected")
        }




    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const DocDeleteGroupActivity = async (req, res) => {
    try {

        const groupId = req.body.GroupId
        const user = req.user

        const RowsAffected = await DeleteGroupActivity(groupId, user)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "Deleted Group Activity" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//DeleteGroupActivityLeader

const DocDeleteGroupActivityLeader = async (req, res) => {
    try {

        
        const user = req.user

        const RowsAffected = await DeleteGroupActivityLeader(user)


        if (RowsAffected != 0) {
            res.status(200).json({ success: "Deleted Group Activity" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const DocAddParticipant = async (req, res) => {
    try {

        const { UserId } = req.user
        const groupId = req.body.GroupId
        
        console.log(groupId)
        

        const RowsAffected = await AddParticipant(UserId, groupId)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "Added Participant" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocDeleteParticipant = async (req, res) => {
    try {

        const { UserId } = req.user


        const RowsAffected = await DeleteParticipant(UserId)
        if (RowsAffected != 0) {
            res.status(200).json({ success: "Deleted from Group Activity" })
        } else {
            throw new Error("No Rows Affected")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}





const DocAllParticipants = async (req, res) => {///it is not working correctly!!!!!
    try {
        const groupId = req.body.GroupId
        const Rows = await AllParticipants(groupId)
       
        
        if (Rows && Rows.length !== 0) {
            res.status(200).json({Rows});
        } else {
                throw new Error("No members found :(");
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const DocGroupSize = async (req, res) => {
    
    try {
        const groupId = req.body.GroupId
        const size = await GroupSize(groupId)
       
        
        res.status(200).json({ groupSize: size });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocGroupaActivity = async (req, res) => {
    
    try {
        const groupId = req.body.GroupId
        const groupActivity = await GroupaActivity(groupId)

        res.status(200).json({ groupActivity });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const DocAllGroups = async (req, res) => {
    
    try {
        const groups = await AllGroups()

        res.status(200).json({ groups });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocAllActivities = async (req, res) => {
    
    try {
        const activities = await AllActivities()

        res.status(200).json({ activities });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocAllLocations = async (req, res) => {
    
    try {
        const Locations = await AllLocations()

        res.status(200).json({ Locations });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const DocGroupsOfActivity = async (req, res) => {
    
    try {
        const activityName = req.body.ActivityName
        console.log(activityName)
        const groupsOfActivities = await GroupsOfActivity(activityName)

        res.status(200).json({ groupsOfActivities });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}






module.exports = {DocCreateActivity, DocRemoveActivity, DocCreateGroupActivity, DocDeleteGroupActivity, DocAddParticipant, DocDeleteParticipant, DocAllParticipants, DocGroupSize, DocGroupaActivity, DocAllGroups, DocAllActivities, DocGroupsOfActivity, DocAllLocations, DocDeleteGroupActivityLeader,test}

