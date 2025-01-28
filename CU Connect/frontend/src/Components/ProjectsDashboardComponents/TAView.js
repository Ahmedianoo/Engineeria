import React, { useState, useEffect } from "react";
import { 
  TAGetStudentsInCertainProjectTeam,
  TAGetAllProjectTeamsForCertainTA,
  TAGetAllProjectsForTA,
  TAGetAllTasksInProject,
  TACreateNewTask,
  TAEditTask,
  TADeleteTask,
  TAAssignGradeForTask,
  TAGetGradeForCertainTeam
} from "../../endpoints/TAEndpoint";

function ProjectsTAView() {
  const [currentView, setCurrentView] = useState("start");
  const [projects, setProjects] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTaskData, setUpdatedTaskData] = useState({
    TaskNum: "",
    DescriptionOfTask: "",
    Deadline: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Add missing state for selected project ID
  

  const fetchStudents = async (TeamId) => {
    setLoading(true);
    setError("");
    try {
      const data = await TAGetStudentsInCertainProjectTeam(TeamId);
      setStudents(data.result.recordset);
      setCurrentView("students");
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle team and task fetching based on current view
  useEffect(() => {
    if (currentView === "teams") {
      fetchProjectTeams();
    } else if (currentView === "tasks") {
      fetchTasks();
      fetchProjects();
    }
  }, [currentView]);
  
  // Fetch project teams
  const fetchProjectTeams = async () => {
    setLoading(true);
    try {
      const data = await TAGetAllProjectTeamsForCertainTA();
      console.log(data);
      setProjectTeams(Array.isArray(data.result.recordset) ? data.result.recordset : []);
    } catch (err) {
      console.error("Error fetching project teams:", err);
      setProjectTeams([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Fetch grades for all teams when the component mounts
    projectTeams.forEach((team) => {
      fetchGradeForTeam(team.TeamId);
    });
  }, [projectTeams]); 

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await TAGetAllTasksInProject();
      setTasks(Array.isArray(data.result.recordset) ? data.result.recordset : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await TAGetAllProjectsForTA();
      console.log(data.result);
      setProjects(data.result.recordset);  // Set the fetched projects
      setSelectedProjectId(data.result.recordset[0]);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  
  // Handle task creation
  const handleCreateTask = async (newTask) => {
    try {
      await TACreateNewTask(newTask);
      const updatedTasks = await TAGetAllTasksInProject();
      setTasks(updatedTasks.result.recordset);
      setUpdatedTaskData({ DescriptionOfTask: "", Deadline: "" });
      setSelectedProjectId(null); // Reset project selection after creating task
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };
  
  // Handle task editing
  const handleEditTask = async () => {
    try {
      const updatedTask = {
        TaskNum: editingTask.TaskNum,
        ProjectId: editingTask.ProjectId,
        DescriptionOfTask: updatedTaskData.DescriptionOfTask,
        Deadline: updatedTaskData.Deadline,
      };
  
      await TAEditTask(updatedTask);
      const updatedTasks = await TAGetAllTasksInProject();
      setTasks(updatedTasks.result.recordset);
      setEditingTask(null);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = async (task) => {
    try {
      await TADeleteTask(task); // Pass the whole task object to TADeleteTask
      const updatedTasks = await TAGetAllTasksInProject();
      setTasks(updatedTasks.result.recordset);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;  // Regular expression to match the YYYY-MM-DD format
    return regex.test(date);
  };

  const handleDeadlineChange = (e) => {
    const newDeadline = e.target.value;
    setUpdatedTaskData({ ...updatedTaskData, Deadline: newDeadline });

    // Show error only if there's input and it's invalid
    if (newDeadline && !validateDate(newDeadline)) {
      setError('Invalid date format. Please use YYYY-MM-DD.');
    } else {
      setError('');
    }
  };

  const isSubmitDisabled = error || !updatedTaskData.Deadline;
  
  const renderTasksTable = () => (
    <div className="overflow-x-auto">
      <button className="btn btn-secondary mb-4" onClick={() => setCurrentView("start")}>
        Back to Main menu
      </button>
  
      {/* New Task Creation Form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Create New Task</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedProjectId) {
              alert("Please select a project!");
              return;
            }
            const newTask = {
              ProjectId: selectedProjectId.ProjectId,
              DescriptionOfTask: updatedTaskData.DescriptionOfTask,
              Deadline: updatedTaskData.Deadline,
            };
            console.log(newTask);
            handleCreateTask(newTask); // Pass the task object to the handler
          }}
        >
          <div>
            <label className="block">Description</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={updatedTaskData.DescriptionOfTask}
              onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, DescriptionOfTask: e.target.value })}
            />
          </div>
  
          <div>
          <label className="block">Deadline</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={updatedTaskData.Deadline}
              onChange={handleDeadlineChange}
            />
            {updatedTaskData.Deadline && error && (
              <p className="text-red-500">{error}</p>
            )}

          </div>
          <div>
            <label className="block">Select Project</label>
            <select
              className="input input-bordered w-full"
              value={selectedProjectId}
              onChange={(e) =>  {
                setSelectedProjectId(e.target.value)}
              }>
              <option value="" disabled>Select a Project</option>
              {projects.map((project) => (
                <option key={project.ProjectId} value={project.ProjectId}>
                  {project.ProjectName}
                </option>
              ))}
            </select>
          </div>
            <button
              type="submit"
              disabled={isSubmitDisabled}  // Disable the button if there's an error or no input
              className="btn btn-primary mt-4"
            >
              Submit
            </button>
        </form>
      </div>
  
      {/* Task Table */}
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Task Number</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={`${task.TaskNum}-${task.ProjectID}`}>
              <td>{task.ProjectName}</td>
              <td>{task.TaskNum}</td>
              <td>{task.DescriptionOfTask}</td>
              <td>{task.Deadline || "No Deadline"}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm mr-2"
                  onClick={() => {
                    setEditingTask(task);
                    setUpdatedTaskData({
                      TaskNum: task.TaskNum,
                      DescriptionOfTask: task.DescriptionOfTask,
                      Deadline: task.Deadline,
                    });
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-error btn-sm" onClick={() => handleDeleteTask(task)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Edit Task Form */}
      {editingTask && (
        <div className="mt-4 p-4 border bg-white rounded">
          <h3 className="text-xl font-semibold">Edit Task</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTask();
            }}
          >
            <div>
              <label className="block">Description</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedTaskData.DescriptionOfTask}
                onChange={(e) => setUpdatedTaskData({ ...updatedTaskData, DescriptionOfTask: e.target.value })}
              />
            </div>
            <div>
              <label className="block">Deadline</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={updatedTaskData.Deadline}
                onChange={handleDeadlineChange}
              />
              {updatedTaskData.Deadline && error && (
                <p className="text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitDisabled}  // Disable the button if there's an error or no input
                className="btn btn-primary mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );


  const renderStartView = () => (
    <div className="flex flex-col items-center space-y-4">
      <button className="btn btn-primary" onClick={() => setCurrentView("teams")}>
        View My Teams
      </button>
      <button className="btn btn-secondary" onClick={() => setCurrentView("tasks")}>
        View All Tasks
      </button>
    </div>
  );

  const [grades, setGrades] = useState({});
  
  const fetchGradeForTeam = async (teamId) => {
    try {
      const gradeData = await TAGetGradeForCertainTeam(teamId);
      console.log(gradeData.result.recordset)
      // Check if recordset exists and contains elements
      if (gradeData && gradeData.result.recordset && gradeData.result.recordset.length > 0) {
        const teamGrade = gradeData.result.recordset[0].GradeValue; // Access the grade from the first element
        
        if (teamGrade !== null) {
          setGrades((prevGrades) => ({
            ...prevGrades,
            [teamId]: teamGrade, // Update state with the grade
          }));
        } else {
          setGrades((prevGrades) => ({
            ...prevGrades,
            [teamId]: null, // If grade is null, keep it as null
          }));
        }
      } else {
        // If no grade found in the recordset
        setGrades((prevGrades) => ({
          ...prevGrades,
          [teamId]: null,
        }));
      }
    } catch (error) {
      console.error('Error fetching grade for team:', error);
    }
  };
  
  
  const handleGradeChange = (teamId, e) => {
    const value = e.target.value;
    // Only update the grade for the specific team
    setGrades({
      ...grades,
      [teamId]: value,
    });
  };
  
  const handleAssignGrade = (teamId) => {
    const gradeValue = grades[teamId]; // Get the grade for the specific team
    if (!gradeValue) {
      setError((prevError) => ({
        ...prevError,
        [teamId]: 'Grade value is required',
      }));
      return;
    }
  
    // Call the TAAssignGradeForTask function with grade value and teamId
    TAAssignGradeForTask(gradeValue, teamId)
      .then((data) => {
        console.log('Grade assigned:', data);
        setError((prevError) => ({
          ...prevError,
          [teamId]: '', // Clear error if assignment is successful
        }));
      })
      .catch((err) => {
        console.error('Error assigning grade:', err);
        setError((prevError) => ({
          ...prevError,
          [teamId]: 'Error assigning grade', // Set error message if API call fails
        }));
      });
  };
  
  

  const renderProjectTeamsTable = () => (
    <div className="overflow-x-auto">
      {/* Back Button */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => setCurrentView("start")} // This will switch to the start view
      >
        Back to Main menu
      </button>
  
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Team Size</th>
            <th>Leader Name</th>
            <th>Leader Email</th>
            <th>Subject Code</th>
          </tr>
        </thead>
        <tbody>
          {projectTeams.map((team) => (
            <tr key={team.TeamId}>
              <td className="cursor-pointer" onClick={() => fetchStudents(team.TeamId)}>{team.TeamName}</td>
              <td className="cursor-pointer" onClick={() => fetchStudents(team.TeamId)}>{team.TeamSize}</td>
              <td className="cursor-pointer" onClick={() => fetchStudents(team.TeamId)}>{team.Name}</td>
              <td className="cursor-pointer" onClick={() => fetchStudents(team.TeamId)}>{team.Email}</td>
              <td className="cursor-pointer" onClick={() => fetchStudents(team.TeamId)}>{team.SubjectCode}</td>

              <td>
                {/* Grade input */}
                <input
                  type="number"
                  value={grades[team.TeamId] || ""} // Default to empty string if no grade is set yet
                  onChange={(e) => handleGradeChange(team.TeamId, e)} // Call the grade change handler
                  className="input input-bordered w-full"
                  disabled={grades[team.TeamId] !== null} // Disable input if a grade has been fetched
                />
                {error[team.TeamId] && <p className="text-red-500">{error[team.TeamId]}</p>}
                <button
                  onClick={() => handleAssignGrade(team.TeamId)} // Use teamId directly for handling grade assignment
                  className="btn btn-primary mt-2"
                  disabled={grades[team.TeamId] !== null}
                >
                  Assign Grade
                </button>
              </td>

              {/* On clicking the row, fetch students for the selected team */}
              <td onClick={() => fetchStudents(team.TeamId)} className="cursor-pointer">
                View Students
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  

  const renderStudentsTable = () => (
    <div className="overflow-x-auto">
      <button className="btn btn-secondary mb-4" onClick={() => setCurrentView("teams")}>
        Back to Project Teams
      </button>
      <button className="btn btn-secondary mb-4" onClick={() => setCurrentView("start")}>
        Back to Main Menu
      </button>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Task Number</th>
            <th>Description of Task</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={`${student.TaskNum}-${student.UserId}`}>
              <td>{student.Name}</td>
              <td>{student.TaskNum}</td>
              <td>{student.DescriptionOfTask}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {currentView === "start"
          ? "Choose Your View"
          : currentView === "teams"
          ? "Project Teams"
          : currentView === "tasks"
          ? "All Tasks"
          : "Students in Project Team"}
      </h1>
      {loading ? (
        <div className="text-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : currentView === "start" ? (
        renderStartView()
      ) : currentView === "teams" ? (
        renderProjectTeamsTable()
      ) : currentView === "tasks" ? (
        renderTasksTable()
      ) : (
        renderStudentsTable()
      )}
    </div>
  );
}

export default ProjectsTAView;
