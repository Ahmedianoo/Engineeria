import React, { useState, useEffect } from 'react'
import StatCard from './SubjectsComponents/StatCard '
// import { PieChart } from 'recharts'
import { FaBookReader } from "react-icons/fa";
import SubjectLineChart from './SubjectsComponents/SubjectLineChart';
import SubjectBarChart from './SubjectsComponents/SubjectBarChart';
import SubjectsTable from './SubjectsComponents/SubjectsTable';
import { GetAllSubjects } from '../../endpoints/AdminDashboardEndpoint';

function Subjects() {
  const [subjects, setSubjects] = useState([]); 
  const [formatedDataForLineChart, setformatedDataForLineChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const data = await GetAllSubjects(); 
        setSubjects(data); 
        processformatedDataForLineChart(data);
        setLoading(false); 
      } catch (err) {
        setError(err.message); 
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []); 

  const processformatedDataForLineChart = (data) => {
    const termCount = {};

    // Aggregate subjects by term and year
    data.forEach((subject) => {
      const term = subject.Term.charAt(0).toUpperCase() + subject.Term.slice(1); // Capitalize term
      const year = new Date(subject.CreatedAt).getFullYear(); // Extract year from CreatedAt
      const key = `${year} ${term}`;

      termCount[key] = (termCount[key] || 0) + 1;
    });

    // Convert aggregated data into desired format
    const formattedData = Object.entries(termCount).map(([key, count]) => ({
      name: key,
      SubjectsInTerm: count,
    }));

    setformatedDataForLineChart(formattedData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner border-4 border-dashed border-gray-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>; // Display error state
  // console.log(subjects.length)
  // console.log(subjects)
  // console.log("Subjects:", subjects);
  // console.log("formated Data:", formatedDataForLineChart);

  return (
    <>
    <div>

    <header className='bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg border-2 border-gray-400 rounded-lg mb-5'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-black'>Subjects</h1>
      </div>
    </header>


    <div
					className='grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 mb-8'	>
          <StatCard name='Total Subjects' icon={FaBookReader} value={subjects.length} color='#6366F1' />
    </div>

    <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
					<SubjectLineChart data={formatedDataForLineChart}/>
          <SubjectBarChart/>
          <SubjectsTable SUBJECT_DATA={subjects}/>
		</div>
    
    </div>
    
    </>
  )
}

export default Subjects