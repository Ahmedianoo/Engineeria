import React, { useState, useEffect } from "react";
import {
  CreateProjectTeam,
  GetProjectTeamsInSection,
  ParticipateInProjectTeam,
} from "../../../endpoints/StudentProjectEndpoint"; // Ensure the correct path
import toast from "react-hot-toast";
import { FaPlus, FaSpinner } from "react-icons/fa";

const ProjectTeams = ({ subjectCode, selectedSectionId }) => {
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null); // For storing error messages
  const [loading, setLoading] = useState(false); // To manage loading state
  const [joinLoading, setJoinLoading] = useState(null); // Track loading state for joining a team

  // Fetch teams when selectedSectionId changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedSectionId) return; // Avoid unnecessary calls if no section is selected
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const data = await GetProjectTeamsInSection(selectedSectionId, subjectCode);
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again.");
        toast.error("Error loading teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedSectionId, subjectCode]);

  const handleCreateTeam = async () => {
    if (teamName.trim() === "") return;

    const projectTeamDetails = {
      TeamName: teamName,
      SubjectCode: subjectCode, // Use the SubjectCode passed as prop
    };

    setLoading(true);
    try {
      const response = await CreateProjectTeam(projectTeamDetails);
      window.location.reload()
      if (response.success === "Team created") {
        toast.success("Team created successfully!");
        setTeams([...teams, response.newTeam]); // Update teams list with the new team
        setTeamName(""); // Clear the input field
        setShowModal(false); // Close the modal
      }
    } catch (err) {
      setError("Failed to create a new team. Please try again.");
      toast.error("Error creating team. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (team) => {
    setJoinLoading(team.TeamId); // Set loading state for the specific team
    try {
      const response = await ParticipateInProjectTeam(selectedSectionId, team.TeamId);
      toast.success("You joined the team successfully!");
      console.log(response);
      window.location.reload()
      // Optionally, update team status or UI to indicate participation
    } catch (err) {
      console.error("Error joining team:", err);
      toast.error("Failed to join the team. Please try again.");
    } finally {
      setJoinLoading(null); // Reset loading state
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Project Teams</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-white flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Team</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create a New Team</h2>
            <input
              type="text"
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className={`btn btn-primary ${loading && "loading"}`}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Create Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teams List */}
      {loading ? (
        <div className="text-center py-4">
          <FaSpinner className="animate-spin text-gray-500 text-3xl mx-auto" />
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {teams.map((team) => (
            <div
              key={team.TeamId}
              className="card card-bordered shadow-md flex justify-between items-center p-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{team?.TeamName}</h3>
                <p className="text-gray-700">Created by: {team?.Name}</p>
                <p className="text-gray-500">{team?.Email}</p>
              </div>
              <button
                className={`btn btn-success flex items-center space-x-2 ${
                  joinLoading === team.TeamId && "loading"
                }`}
                onClick={() => handleJoinTeam(team)}
                disabled={joinLoading === team.TeamId}
              >
                {joinLoading === team.TeamId ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <span>Join Team</span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTeams;
