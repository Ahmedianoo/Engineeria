import Navbar from "../Components/Navbar"
import React, { useState, useEffect, useCallback } from "react";


const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token)
    return dataParsed.token
}


const formatDate = (dateString) => {
    const options = {  
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true, 
    };
  
   
    const date = new Date(dateString);
  
    
    return date.toLocaleString('en-EG', options); 
  };


function Activities() {

    console.log("Ahmed Hamada")

    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    const [groups, setGroups] = useState([]);

    const [userGroup, setUserGroup] = useState(null);

    
    const [selectedGroupId, setSelectedGroupId] = useState('');
    
    

    

    const user = JSON.parse(localStorage.getItem('user'));


        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/activities/allgroups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${GetToken()}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch groups.");
                }
    
                setGroups(Array.isArray(data.groups) ? data.groups : []);
    
                // Find the user's group (if any)
                const userGroup = data.groups.find(group => group.StudentId === user.UserId);
                setUserGroup(userGroup || null);
            } catch (error) {
                console.error("Error fetching groups:", error);
                alert("Error fetching groups. Please try again.");
            }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleGroupSelect = (event) => {
        setSelectedGroupId(event.target.value);
    };

    const handleJoinGroup = async () => {
        if (!selectedGroupId) {
            alert("Please select a group.");
            return;
        }

        console.log("Selected Group ID:", selectedGroupId);

        console.log("Joining group:", selectedGroupId);
    
        try {
            const response = await fetch("/api/activities/addparticipant", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${GetToken()}`,
                },
                body: JSON.stringify({
                    userAddedId: user.UserId,
                    GroupId: selectedGroupId,
                }),
            });
    
           
            console.log("Response status:", response.status);
            const responseData = await response.json();
            console.log("Response data:", responseData);
    
            if (response.ok) {
                alert(responseData.success || "Successfully joined the group!");
                fetchGroups();  
            } else {
                throw new Error(responseData.message || "Failed to join the group.");
            }
        } catch (error) {
            console.error('Error joining group:', error);
            alert("Error joining group. Please try again.");
        }
    };
   
    const handleLeaveGroup = async () => {
        if (!userGroup) {
            alert("You are not part of any group.");
            return;
        }
    
        try {
            const response = await fetch('/api/activities/deleteparticipant', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${GetToken()}`,
                },
                body: JSON.stringify({ userRemovedId: user.UserId }), 
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to leave the group.");
            }
    
            alert(data.success || "Successfully left the group.");
            setUserGroup(null); 
            fetchGroups(); 
        } catch (error) {
            console.error("Error leaving group:", error);
            alert(error.message || "Error leaving group. Please try again.");
        }
    };


    const handleDeleteGroup = async () => {
        if (!userGroup) {
            alert("You are not the leader of any group.");
            return;
        }

        const groupId = userGroup.GroupId;

        try {
            const response = await fetch("/api/activities/deletegroupleader", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`,
                },
                body: JSON.stringify({ GroupId: groupId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete group.");
            }

            const data = await response.json();
            alert(data.success || "Group deleted successfully!");
            setUserGroup(null);  // Remove user from the group
            fetchGroups();  // Call fetchGroups to refresh the list
        } catch (error) {
            console.error("Error deleting group:", error);
            alert("Error deleting group. Please try again.");
        }
    };

    
    // useEffect(() => {
    //     const fetchGroups = async () => {
    //         try {
    //             const response = await fetch('/api/activities/allgroups', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${GetToken()}`,
    //                 },
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setGroups(data.groups);
    
    //             const user = JSON.parse(localStorage.getItem('user'));
    //             const userGroup = data.groups.find(group => group.StudentId === user.UserId);
    //             setUserGroup(userGroup);
    
    //             // Log the user group to verify it's set correctly
    //             console.log("User's group:", userGroup);
    //         } catch (error) {
    //             console.error('Error fetching groups:', error);
    //         }
    //     };
    //     fetchGroups();
    // }, []);
    


    // useEffect(() => {
    //     const fetchGroups = async () => {
    //         try {
    //             const response = await fetch('/api/activities/allgroups', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${GetToken()}`,
    //                 },
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setGroups(data.groups);
    //         } catch (error) {
    //             console.error('Error fetching groups:', error);
    //         }
    //     };

    //     fetchGroups();
    // }, []);




    

    useEffect(() => {
        
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/activities/allactivities', {
                    method: 'POST', // If your endpoint requires POST
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${GetToken()}`,

                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, []);


    useEffect(() => {
        // Fetch locations
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/activities/alllocations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${GetToken()}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Locations:', data);
                setLocations(data.Locations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };


    const handleCreateGroup = async () => {
        if (!selectedActivity || !selectedLocation) {
            alert("Please select both an activity and a location.");
            return;
        }

        try {
            const response = await fetch("/api/activities/creategroupactivity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GetToken()}`,
                },
                body: JSON.stringify({
                    ActivityName: selectedActivity,
                    LocationName: selectedLocation,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create group activity.");
            }

            const data = await response.json();
            alert(data.success || "Group activity created successfully!");
        } catch (error) {
            console.error("Error creating group activity:", error);
            alert("Error creating group activity. Please try again.");
        }
    };



    







    


    
    return (
        <>
        <Navbar/>
        <div className="activities">


        <h1 className="fancy-title-activities">Activities</h1>

        
       
        <form className="createGroup">
        <h2 className="createYourgroup"> Create Your Group Now </h2>
       

            <div className="form-caontainer">



                <div className="form-item">
                <label className="activityForm">Activity</label>
                    <select className="activityFormSelect" value={selectedActivity} onChange={handleActivityChange}>
                        <option value=""> Select an activity </option>
                        {Array.isArray(activities.activities) && activities.activities.map(activity => (
                            
                        <option key={activity.ActivityName} value={activity.ActivityName}>
                        {activity.ActivityName}
                        </option>
                ))}
                    </select>
                </div>


                <div className="form-item">
                    <label className="locationForm">Location</label>
                    <select
                        className="locationFormSelect"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                    >
                        <option value="">Select a location</option>
                        {Array.isArray(locations) &&
                            locations.map((location) => (
                                <option
                                    key={location.LocationName}
                                    value={location.LocationName}
                                >
                                    {location.LocationName}
                                </option>
                            ))}
                    </select>
                </div>




            </div>

            

            <button
                        type="button"
                        onClick={handleCreateGroup}
                        className="create-group-button"
                    >
                        Create Group Activity
            </button>

        </form>

        {userGroup && userGroup.StudentId === user.UserId && (
        <button type="button" onClick={handleDeleteGroup} className="delete-group-button">
        Delete Your Group
        </button>
        )}

        {userGroup && userGroup.StudentId === user.UserId && (
                <button
                    type="button"
                    onClick={handleLeaveGroup}
                    className="delete-group-button"
                >
                    Leave Your Group
                </button>
                )}



<div className="join-group-form">
        <h2 className="join-group-title">Join a Group</h2>
        <div className="form-container">
            <select
                onChange={handleGroupSelect}
                value={selectedGroupId}
                className="group-select"
            >
                <option value="">Select a group</option>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <option key={group.GroupId} value={group.GroupId}>
                            {group.ActivityName} - {group.LocationName} - {group.GroupId}
                        </option>
                    ))
                ) : (
                    <option value="">No groups available</option>
                )}
            </select>
            <button onClick={handleJoinGroup} className="join-group-button">
                Join Group
            </button>
        </div>
    </div>

        
        <div className="groups-container">
                <h2 className="groups-title">Existing Groups</h2>
                <div className="groups-list">
                    {groups && groups.length > 0 ? (
                        groups.map(group => (
                            <div className="group-card" key={group.GroupId}>
                                <h3>{group.ActivityName} - {group.LocationName}</h3>
                                <p><strong>Group Size:</strong> {group.GroupSize}</p>
                                <p><strong>Group Id:</strong> {group.GroupId}</p>
                                <p><strong>Leader:</strong> {group.Name}</p>
                                <p><strong>Date Created:</strong> {formatDate(group.CreatedAt)}</p>

                                {/* Display Buttons */}
                                {group.StudentId !== user.UserId ? (
                                    userGroup?.GroupId === group.GroupId ? (
                                        <button
                                            className="leave-group-button"
                                            onClick={handleLeaveGroup}
                                        >
                                            Leave Group
                                        </button>
                                    ) : (
                                        !userGroup && (
                                            <button
                                                className="join-group-button"
                                                onClick={() => handleJoinGroup(group.GroupId)}
                                            >
                                                Join Group
                                            </button>
                                        )
                                    )
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No groups available.</p>
                    )}
                </div>
            </div>





        </div>
        
        </>
    )
}

export default Activities




