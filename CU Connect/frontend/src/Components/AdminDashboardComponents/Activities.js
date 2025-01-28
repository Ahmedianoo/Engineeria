import React, { useState, useEffect } from 'react'
import StatCard from './ActivitiesComponents/StatCard'
import { FaBookReader } from "react-icons/fa";
import { 
  FaBars, 
  FaUsers ,
  FaRunning 
} from "react-icons/fa";
import ActivityBarChart from './ActivitiesComponents/ActivityBarChart';

const GetToken = () => {
  const data = localStorage.getItem("user")
  const dataParsed = JSON.parse(data)
  console.log(dataParsed.token) 
  return dataParsed.token
}

function Subjects() {
  const [activities, setActivities] = useState([]);
  const [groupCounts, setGroupCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/activities/groupsofactivity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GetToken()}`,
          },
          body: JSON.stringify({ ActivityName: null }), // Fetch groups for all activities
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update activities and group counts for the bar chart
        const groupCountsData = data.groupsOfActivities.reduce((acc, curr) => {
          const existingActivity = acc.find((item) => item.ActivityName === curr.ActivityName);
          if (existingActivity) {
            existingActivity.GroupCount += 1;
          } else {
            acc.push({
              ActivityName: curr.ActivityName,
              GroupCount: 1,
            });
          }
          return acc;
        }, []);

        setActivities(data.groupsOfActivities);
        setGroupCounts(groupCountsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner border-4 border-dashed border-gray-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  } 

  return (
    <>
    <div>
      <header className="bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg border-2 border-gray-400 rounded-lg mb-5">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-black">Activities</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 mb-8">
        <StatCard
          name="Total Activities"
          icon={FaRunning}
          value={groupCounts.length}
          color="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ActivityBarChart data={groupCounts} />
      </div>
    </div>
    
    </>
  )
}

export default Subjects