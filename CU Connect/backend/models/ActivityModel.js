const sql = require('mssql');
require('dotenv').config()

const config = {
    user: process.env.DATABASE_CONFIG_USERNAME,
    password: process.env.DATABASE_CONFIG_PASSWORD,
    server: process.env.DATABASE_CONFIG_SERVER,
    database: process.env.DATABASE_CONFIG_DATABASE,
    options: {
        trustServerCertificate: true,
    },
};

async function Connection() {
    await sql.connect(config);
    console.log('Connected to SQL Server!');
}


async function CreateActivity(activityName) {///////////

    try {
        await sql.connect(config);
        //name must be unique
        const result = await sql.query(`insert into Activity (ActivityName) VALUES ('${activityName}');`);

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function RemoveActivity(activityName) {/////////////////

    try {
        await sql.connect(config);
        //name must be unique
        
        const result = await sql.query(`delete from Activity where ActivityName = '${activityName}';`);
        
    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function CreateGroupActivity(activityName, locationName, user) {////////////////////////

    try {
        await sql.connect(config);

        const locationResult = await sql.query(`select LocationId from Locations where LocationName='${locationName}';`);
        const locationId = locationResult.recordset[0].LocationId;

        const activityResult = await sql.query(`select ActivityId from Activity where ActivityName='${activityName}';`);
        const activityId = activityResult.recordset[0].ActivityId;

        const result = await sql.query(`insert into GroupActivity (ActivityId, LocationId, StudentId) VALUES (${activityId},${locationId}, ${user.UserId});`);

        const groupResult = await sql.query(`select GroupId from GroupActivity where StudentId='${user.UserId}';`);
        const groupId = groupResult.recordset[0].GroupId

        const resultPar = await sql.query(`insert into ParticipateActivity (StudentId, GroupId) VALUES (${user.UserId},${groupId});`);

        console.log('Insert Result:', result);
        console.log('leader added: ', resultPar);

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function DeleteGroupActivity(groupActivityId, user) {/////////////////////////////

    try {
        await sql.connect(config);


        const result1 = await sql.query(`delete from ParticipateActivity where GroupId = ${groupActivityId}`);
        const result2 = await sql.query(`delete from GroupActivity where GroupId = ${groupActivityId} or StudentId = ${user.UserId};`);

       /// const result = await sql.query(`delete from GroupActivity where StudentId = ${user.UserId}`); and send user 
                                                                                                    //as parameter   

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}


async function DeleteGroupActivityLeader(user) {/////////////////////////////

    try {
        await sql.connect(config);

        const groupResult = await sql.query(`select GroupId from GroupActivity where StudentId = ${user.UserId}`);
        // if (!groupResult.recordset.length) {
        //     return res.status(400).json({ error: 'You are not the leader of any group.' });
        // }


        const groupActivityId = groupResult.recordset[0].GroupId;
        const result1 = await sql.query(`delete from ParticipateActivity where GroupId = ${groupActivityId}`);
        const result2 = await sql.query(`delete from GroupActivity where StudentId = ${user.UserId};`);

        console.log(result2);

        return result2.rowsAffected[3];

        // if (result2.rowsAffected[3] > 0) {
        //     return res.status(200).json({ success: 'Group deleted successfully.' });
        // } else {
            
        //     console.log("HERE I AMMMMMM model")
        //     throw new Error('Failed to delete the group.');
        // }

       /// const result = await sql.query(`delete from GroupActivity where StudentId = ${user.UserId}`); and send user 
                                                                                                    //as parameter   

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}





async function AddParticipant(userAddedId, GroupId) { // edit database first then uncomment
                                                      /////////////////////////////          
    try {
        await sql.connect(config);
        const result = await sql.query(`insert into ParticipateActivity (StudentId, GroupId) values (${userAddedId}, ${GroupId}) ;`);

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function DeleteParticipant(userRemovedId) {////////////////////////////

    try {
        await sql.connect(config);
        //assuming a student can join one group only at a time
        const result = await sql.query(`delete from ParticipateActivity where StudentId = ${userRemovedId};`);

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function AllParticipants(GroupId) {

    try {                    //edit the database first then uncomment 
        await sql.connect(config); ////////////////////////////////////////
        //assuming a student can join one group only at a time
        //need to edit participateActivity at databaase
        const result = await sql.query(`select UserId, Name from Users, ParticipateActivity where ParticipateActivity.StudentId = Users.UserId and ParticipateActivity.GroupId = ${GroupId};`);
        
        console.log('Query Result:', result);

        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('No participants found for the given GroupId');
        }

        return result.recordset;


    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}


async function GroupSize(groupId) {

    try {                  
        await sql.connect(config);  ///////////////////////////////////////
        const result = await sql.query(`select GroupSize from GroupActivity where GroupId = ${groupId};`);

        console.log('Query Result:', result);

        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('Group not found');
        }

        return result.recordset[0].GroupSize;

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}



async function GroupaActivity(groupId) {///may be useless

    try {                  
        await sql.connect(config); //////////////////////////////////////////
        
                                                          //i wish it will work              
        const result = await sql.query(`select G.GroupSize, G.CreatedAt, G.GroupId, L.LocationName, A.ActivityName, U.UserId, U.Name from GroupActivity as G, Users as U, Locations as L, Activity as A where G.ActivityId = A.ActivityId and G.LocationId = L.LocationId and G.StudentId = U.UserId and G.GroupId = ${groupId};`);

        console.log('Query Result:', result);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('Group activity not found');
        }

        return result.recordset;


    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function AllGroups() {

    try {                  
        await sql.connect(config);
        
                                                          //i wish it will work              
        const result = await sql.query(`select GroupSize, G.CreatedAt, GroupId, LocationName, ActivityName, UserId, U.Name from GroupActivity as G, Users as U, Locations as L, Activity as A where G.ActivityId = A.ActivityId and G.LocationId = L.LocationId and G.StudentId = U.UserId;`);
     
     
        console.log('Query Result:', result);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('no groups found');
        }

        return result.recordset;   
        
        
    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}

async function AllActivities() {

    try {                  
        await sql.connect(config); //activity name must be unique
        const result = await sql.query(`select ActivityName from Activity`);

        console.log('Query Result:', result);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('no activiies found');
        }

        return result.recordset; 

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}


async function AllLocations() {

    try {                  
        await sql.connect(config); //Location name must be unique
        const result = await sql.query(`select LocationName from Locations`);

        console.log('Query Result:', result);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('no Locations found');
        }

        return result.recordset; 

    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}


async function GroupsOfActivity(activityName) {

    try {                  
        await sql.connect(config); 


        let x = 0
        const result1 = await sql.query(`SELECT ActivityName FROM Activity;`);
        if (!activityName) { 
            
            console.log(result1);  
            let x = 1;
            return result1.recordset;
            
        }

        if(x === 1){
            console.log("testttt")
            console.log(result1.recordset)
        }
       
  

        console.log(activityName)
        const activityResult = await sql.query(`select ActivityId from Activity where ActivityName='${activityName}';`);
        console.log(activityResult)
        activityId = activityResult.recordset[0].ActivityId
        console.log(activityId)
        console.log(activityResult)


        const result = await sql.query(`select GroupSize, G.CreatedAt, GroupId, LocationName, ActivityName, UserId, U.Name from GroupActivity as G, Users as U, Locations as L, Activity as A where G.ActivityId = A.ActivityId and G.LocationId = L.LocationId and G.StudentId = U.UserId and A.ActivityId = ${activityId};`);

        console.log('Query Result:', result);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('no groups of activity found');
        }

        return result.recordset; 


    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }

}





Connection();
module.exports = { CreateActivity, RemoveActivity ,CreateGroupActivity, DeleteGroupActivity, DeleteParticipant, GroupSize, GroupaActivity, AllGroups, AllActivities, GroupsOfActivity, AddParticipant, AllParticipants, AllLocations, DeleteGroupActivityLeader}







