import React, { useEffect, useState } from 'react';
import Sidebar from './StudentProjectComponents/Sidebar';
import { GetStudentEnrollments } from '../../endpoints/StudentProjectEndpoint';
import SubjectAndProjectData from './StudentProjectComponents/SubjectAndProjectData';
import ProjectTeams from './StudentProjectComponents/ProjectTeams';
import { CheckIfUserInTeam } from '../../endpoints/StudentProjectEndpoint';

function StudentProject() {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState(0);
  const [isParticipating, setIsParticipating] = useState(null); // State to track participation status
  const [loading, setLoading] = useState(false); // State to track loading status

  // Fetch enrollments on initial load
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await GetStudentEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };
    fetchEnrollments();
  }, []);

  // Check if the user is in a team whenever selectedSectionId changes
  useEffect(() => {
    const checkParticipation = async () => {
      if (!selectedSectionId) return; // Avoid unnecessary calls when no section is selected
      setLoading(true);
      try {
        const { isParticipating } = await CheckIfUserInTeam(selectedSectionId);
        setIsParticipating(isParticipating);
        console.log(isParticipating)
      } catch (error) {
        console.error('Error checking participation:', error);
        setIsParticipating(null); // Handle errors gracefully
      } finally {
        setLoading(false);
      }
    };

    checkParticipation();
  }, [selectedSectionId]);
  console.log(isParticipating)
  return (
    <>
      <div className="flex h-full">
        <Sidebar
          enrollments={enrollments}
          setAdminComponent={setSelectedComponent}
          setSelectedSectionId={setSelectedSectionId}
        />

        <div className="flex-grow p-4 bg-gray-100">
          {loading ? (
            <div>Loading...</div>
          ) : isParticipating === null ? (
            <div>If you clicked and nothing shows try again if you didn't click just choose from the sidebar and see the magic</div>
          ) : !isParticipating ? (
            <ProjectTeams
              subjectCode={selectedComponent}
              selectedSectionId={selectedSectionId}
            />
          ) : (
            <SubjectAndProjectData subjectCode={selectedComponent} selectedSectionId={selectedSectionId}/>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentProject;
