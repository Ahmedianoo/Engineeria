import React, { useState, useEffect } from "react";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { GetSubjectDoctor, GetSubjectTA, GetTeamIdAndLeaderId, GetAllStudentsInATeam, KickStudentFromTeam } from "../../../endpoints/StudentProjectEndpoint";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { GetAllTasksForATeam } from "../../../endpoints/StudentProjectEndpoint"; // Import your endpoint

const SubjectAndProjectData = ({ subjectCode, selectedSectionId }) => {
  const [doctorData, setDoctorData] = useState(null);
  const [taData, setTaData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [editingTA, setEditingTA] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]); // Team users data
  const [teamLeaderId, setTeamLeaderId] = useState(null); // Team leader ID
  const [teamId, setTeamId] = useState(null); // Team ID
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const { user } = useAuthContext();
  const currentUserID = user.user.UserId;

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const data = await GetSubjectDoctor(subjectCode);
        setDoctorData(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    const fetchTaData = async () => {
      try {
        const data = await GetSubjectTA(selectedSectionId, subjectCode);
        setTaData(data);
      } catch (error) {
        console.error("Error fetching TA data:", error);
      }
    };

    const fetchTeamData = async () => {
      try {
        if (subjectCode && selectedSectionId) {
          const teamData = await GetTeamIdAndLeaderId(selectedSectionId, subjectCode);
          console.log("Team Data:", teamData); // Log the team ID and leader ID
          setTeamLeaderId(teamData[0].TeamleaderId); // Assuming this is the team leader ID
          setTeamId(teamData[0].TeamId);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    const fetchTeamUsers = async () => {
      try {
        if (subjectCode && selectedSectionId) {
          const students = await GetAllStudentsInATeam(selectedSectionId, subjectCode);
          console.log("Team Students:", students);
          // Filter out the team leader
          const filteredStudents = students.filter(student => student.UserId !== teamLeaderId);
          setTeamUsers(filteredStudents);
        }
      } catch (error) {
        console.error("Error fetching team users:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        if (subjectCode && selectedSectionId) {
          const tasksData = await GetAllTasksForATeam(selectedSectionId, subjectCode);
          setTasks(tasksData); // Set the tasks data
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (subjectCode && selectedSectionId) {
      fetchDoctorData();
      fetchTaData();
      fetchTeamData();
      fetchTeamUsers();
      fetchTasks(); // Fetch tasks data when the component mounts
    }
  }, [subjectCode, selectedSectionId, teamLeaderId]);

  const handleRate = (taId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [taId]: rating,
    }));
  };

  const handleCancel = () => {
    setEditingTA(null);
  };

  const handleSave = () => {
    console.log(`Saved ratings for TA ${editingTA}:`, ratings[editingTA]);
    setEditingTA(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Call the API to kick the user from the team
      const response = await KickStudentFromTeam(userId, teamId);

      if (response.success) {
        // Update state to reflect the removal of the user
        setTeamUsers((prevUsers) => prevUsers.filter((user) => user.UserId !== userId));
        console.log(`User with ID: ${userId} has been kicked from the team.`);
      } else {
        console.log("Failed to kick the user:", response.error);
      }
    } catch (error) {
      console.error("Error kicking the user:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Doctor</h2>
      {doctorData ? (
        <div className="mb-4">
          <p className="text-lg font-semibold">{doctorData.Name}</p>
          <p className="text-gray-600">{doctorData.Email}</p>
        </div>
      ) : (
        <p>Loading doctor information...</p>
      )}

      <h2 className="text-xl font-bold mb-2">Teaching Assistants</h2>
      {taData.length > 0 ? (
        taData.map((ta) => (
          <div key={ta.UserId} className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{ta.Name}</p>
                <p className="text-gray-600">{ta.Email}</p>
              </div>
              <div>
                {editingTA !== ta.UserId ? (
                  <button
                    onClick={() => {
                      setEditingTA(ta.UserId);
                      setRatings((prev) => ({ ...prev, [ta.UserId]: 0 })); // Reset rating
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Rate This TA
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`cursor-pointer ${
                          ratings[ta.UserId] >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => handleRate(ta.UserId, star)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {editingTA === ta.UserId && (
              <div className="mt-2 flex space-x-2">
                <button onClick={handleCancel} className="btn btn-error btn-sm">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-success btn-sm">
                  Save
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Loading teaching assistant information...</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-2">Project Tasks</h2>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Task #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Responsible
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {tasks.length > 0 ? (
              tasks.map((task , index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.TaskNum}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.DescriptionOfTask}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.Name || "not assigned"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-sm text-center text-black">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-2">Team Members</h2>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {teamUsers.map((user) => (
              <tr key={user.UserId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {teamLeaderId === currentUserID && (
                    <div className="flex space-x-4">
                      <button onClick={() => handleDeleteUser(user.UserId)}>
                        <FaTrash size={18} className="text-red-500 cursor-pointer" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectAndProjectData;
