import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { fetchTAs } from "../endpoints/GetSubjectDetails";
import {
    fetchProjectDetails,
    createProject,
    fetchTeamDetails,
    assignSupervisorToTeam,
} from "../endpoints/CreateProject";

const SubjectProject = () => {
    const location = useLocation();

    // Extract subject code from query parameters
    const queryParams = new URLSearchParams(location.search);
    const subjectCode = queryParams.get("subjectcode");

    // State management
    const [projectDetails, setProjectDetails] = useState(null); // Stores project name and tasks
    const [teams, setTeams] = useState([]); // Stores team details
    const [TAs, setTAs] = useState([]); // List of TAs
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    // Fetch project details and TAs when the component mounts
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (!subjectCode) throw new Error("Subject code is missing in the URL.");

                // Fetch project details
                const projectData = await fetchProjectDetails(subjectCode);
                if (projectData) {
                    setProjectDetails(projectData);
                } else {
                    throw new Error("Invalid project details structure.");
                }

                // Fetch team details
                const teamData = await fetchTeamDetails(subjectCode);
                if (teamData && Array.isArray(teamData)) {
                    setTeams(teamData); // Parse teams array from response
                } else {
                    throw new Error("Invalid team details structure.");
                }

                // Fetch TAs
                const taData = await fetchTAs();
                if (taData?.TAs && Array.isArray(taData.TAs)) {
                    setTAs(taData.TAs); // Parse TAs array from response
                } else {
                    throw new Error("Invalid TAs data structure.");
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load project details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [subjectCode]);

    // Handle creating a new project
    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        try {
            await createProject(subjectCode, newProjectName);
            setShowModal(false);
            setNewProjectName("");
            const updatedProjectDetails = await fetchProjectDetails(subjectCode);
            setProjectDetails(updatedProjectDetails);
        } catch (err) {
            console.error("Error creating project:", err);
            alert("Failed to create project. Please try again later.");
        }
    };

    // Handle assigning a supervisor to a team and update the UI dynamically
    const handleAssignSupervisor = async (teamId, taId) => {
        try {
            // Find the selected TA by their ID
            const selectedTA = TAs.find((ta) => ta.UserId === parseInt(taId));

            // Update the backend
            await assignSupervisorToTeam(teamId, taId);

            // Update the local team state
            setTeams((prevTeams) =>
                prevTeams.map((team) =>
                    team.TeamId === teamId
                        ? { ...team, TAName: selectedTA ? selectedTA.Name : "None" }
                        : team
                )
            );
        } catch (err) {
            console.error(`Error assigning supervisor to team ${teamId}:`, err);
            alert("Failed to assign supervisor. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <p>Loading project details...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold">Subject Project</h1>
                            <p className="text-sm text-gray-500">
                                Manage project tasks and teams
                            </p>
                        </div>
                    </div>

                    {/* Project Details */}
                    {projectDetails?.name?.length > 0 ? (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">
                                Project: {projectDetails.name[0].ProjectName}
                            </h2>

                            {/* Tasks Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-2">Tasks</h3>
                                <ul className="space-y-2">
                                    {projectDetails.tasks.map((task) => (
                                        <li
                                            key={task.TaskNum}
                                            className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
                                        >
                                            <p className="font-semibold">
                                                Task {task.TaskNum}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {task.DescriptionOfTask}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">No project details available.</p>
                    )}

                    {/* Teams Section */}
                    {teams.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-bold mb-2">Teams</h3>
                            <ul className="space-y-4">
                                {teams.map((team) => (
                                    <li
                                        key={team.TeamId}
                                        className="p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                                    >
                                        <div>
                                            {/* Team Name */}
                                            <p className="font-semibold text-lg">
                                                {team.TeamName}
                                            </p>

                                            {/* Team Details */}
                                            <p className="text-sm text-gray-600 mt-2">
                                                <span className="font-semibold">Leader ID:</span>{" "}
                                                {team.TeamLeaderId}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Leader Name:</span>{" "}
                                                {team.TeamLeaderName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Leader Email:</span>{" "}
                                                {team.TeamLeaderMail}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Team Size:</span>{" "}
                                                {team.TeamSize}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Supervisor:</span>{" "}
                                                {team.TAName || "None"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Grade:</span>{" "}
                                                {team.GradeValue}
                                            </p>
                                        </div>

                                        {/* Combo Box for Assigning Supervisor */}
                                        <select
                                            className="w-64 px-4 py-2 border border-gray-300 rounded-md mt-4"
                                            onChange={(e) =>
                                                handleAssignSupervisor(team.TeamId, e.target.value)
                                            }
                                            defaultValue=""
                                        >
                                            {/* Default Placeholder Option */}
                                            <option value="" disabled>
                                                {team.TAName ? "Change Supervisor" : "Assign Supervisor"}
                                            </option>

                                            {/* TA Options */}
                                            {TAs.map((ta) => (
                                                <option key={ta.UserId} value={ta.UserId}>
                                                    {ta.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No teams available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default SubjectProject;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Navbar from "../Components/Navbar";
// import { fetchTAs } from "../endpoints/GetSubjectDetails";
// import {
//     fetchProjectDetails,
//     createProject,
//     fetchTeamDetails,
//     assignSupervisorToTeam,
// } from "../endpoints/CreateProject";

// const SubjectProject = () => {
//     const location = useLocation();

//     // Extract subject code from query parameters
//     const queryParams = new URLSearchParams(location.search);
//     const subjectCode = queryParams.get("subjectcode");

//     // State management
//     const [projectDetails, setProjectDetails] = useState(null); // Stores project name and tasks
//     const [teams, setTeams] = useState([]); // Stores team details
//     const [TAs, setTAs] = useState([]); // List of TAs
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [newProjectName, setNewProjectName] = useState("");

//     // Fetch project details and TAs when the component mounts
//     useEffect(() => {
//         const loadData = async () => {
//             setIsLoading(true);
//             try {
//                 if (!subjectCode) throw new Error("Subject code is missing in the URL.");

//                 // Fetch project details
//                 const projectData = await fetchProjectDetails(subjectCode);
//                 if (projectData) {
//                     setProjectDetails(projectData);
//                 } else {
//                     throw new Error("Invalid project details structure.");
//                 }

//                 // Fetch team details
//                 const teamData = await fetchTeamDetails(subjectCode);
//                 if (teamData && Array.isArray(teamData)) {
//                     setTeams(teamData); // Parse teams array from response
//                 } else {
//                     throw new Error("Invalid team details structure.");
//                 }

//                 // Fetch TAs
//                 const taData = await fetchTAs();
//                 if (taData?.TAs && Array.isArray(taData.TAs)) {
//                     setTAs(taData.TAs); // Parse TAs array from response
//                 } else {
//                     throw new Error("Invalid TAs data structure.");
//                 }
//             } catch (err) {
//                 console.error("Error loading data:", err);
//                 setError("Failed to load project details. Please try again later.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadData();
//     }, [subjectCode]);

//     // Handle creating a new project
//     const handleCreateProject = async () => {
//         if (!newProjectName.trim()) return;

//         try {
//             await createProject(subjectCode, newProjectName);
//             setShowModal(false);
//             setNewProjectName("");
//             const updatedProjectDetails = await fetchProjectDetails(subjectCode);
//             setProjectDetails(updatedProjectDetails);
//         } catch (err) {
//             console.error("Error creating project:", err);
//             alert("Failed to create project. Please try again later.");
//         }
//     };

//     // Handle assigning a supervisor to a team
//     const handleAssignSupervisor = async (teamId, taId) => {
//         try {
//             await assignSupervisorToTeam(teamId, taId);
//             const updatedTeamDetails = await fetchTeamDetails(subjectCode);
//             setTeams(updatedTeamDetails); // Refresh teams after assignment
//         } catch (err) {
//             console.error(`Error assigning supervisor to team ${teamId}:`, err);
//             alert("Failed to assign supervisor. Please try again.");
//         }
//     };

//     if (isLoading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                     <p>Loading project details...</p>
//                 </div>
//             </>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <div className="min-h-screen bg-gray-100 p-6">
//                 <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <h1 className="text-4xl font-bold">Subject Project</h1>
//                             <p className="text-sm text-gray-500">
//                                 Manage project tasks and teams
//                             </p>
//                         </div>
//                     </div>

//                     {/* Project Details */}
//                     {projectDetails?.name?.length > 0 ? (
//                         <>
//                             <h2 className="text-2xl font-semibold mb-4">
//                                 Project: {projectDetails.name[0].ProjectName}
//                             </h2>

//                             {/* Tasks Section */}
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-bold mb-2">Tasks</h3>
//                                 <ul className="space-y-2">
//                                     {projectDetails.tasks.map((task) => (
//                                         <li
//                                             key={task.TaskNum}
//                                             className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
//                                         >
//                                             <p className="font-semibold">
//                                                 Task {task.TaskNum}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 {task.DescriptionOfTask}
//                                             </p>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </>
//                     ) : (
//                         <p className="text-sm text-gray-500">No project details available.</p>
//                     )}

//                     {/* Teams Section */}
//                     {teams.length > 0 ? (
//                         <div>
//                             <h3 className="text-lg font-bold mb-2">Teams</h3>
//                             <ul className="space-y-4">
//                                 {teams.map((team) => (
//                                     <li
//                                         key={team.TeamId}
//                                         className="p-4 bg-white border border-gray-200 rounded-md shadow-sm"
//                                     >
//                                         <div>
//                                             {/* Team Name */}
//                                             <p className="font-semibold text-lg">
//                                                 {team.TeamName}
//                                             </p>

//                                             {/* Team Details */}
//                                             <p className="text-sm text-gray-600 mt-2">
//                                                 <span className="font-semibold">Leader ID:</span>{" "}
//                                                 {team.TeamLeaderId}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-semibold">Leader Name:</span>{" "}
//                                                 {team.TeamLeaderName}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-semibold">Leader Email:</span>{" "}
//                                                 {team.TeamLeaderMail}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-semibold">Team Size:</span>{" "}
//                                                 {team.TeamSize}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-semibold">Supervisor:</span>{" "}
//                                                 {team.TAName || "None"}
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 <span className="font-semibold">Grade:</span>{" "}
//                                                 {team.GradeValue}
//                                             </p>
//                                         </div>

//                                         {/* Combo Box for Assigning Supervisor */}
//                                         <select
//                                             className="w-64 px-4 py-2 border border-gray-300 rounded-md mt-4"
//                                             onChange={(e) =>
//                                                 handleAssignSupervisor(team.TeamId, e.target.value)
//                                             }
//                                             defaultValue=""
//                                         >
//                                             {/* Default Placeholder Option */}
//                                             <option value="" disabled>
//                                                 {team.TAName ? "Change Supervisor" : "Assign Supervisor"}
//                                             </option>

//                                             {/* Filter TAs to exclude "No Supervisor" */}
//                                             {TAs.filter((ta) => ta.Name !== "No Supervisor").map((ta) => (
//                                                 <option key={ta.UserId} value={ta.UserId}>
//                                                     {ta.Name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ) : (
//                         <p className="text-sm text-gray-500">No teams available.</p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SubjectProject;












