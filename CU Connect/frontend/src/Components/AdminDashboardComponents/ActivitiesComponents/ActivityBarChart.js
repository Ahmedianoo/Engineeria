import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useEffect, useState } from "react";
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const GetToken = () => {
    const data = localStorage.getItem("user")
    const dataParsed = JSON.parse(data)
    console.log(dataParsed.token) 
    return dataParsed.token
}


const ActivityBarChart = () => {

    // const [activities, setActivities] = useState([]); 
    // const [selectedActivity, setSelectedActivity] = useState(""); 
    // const [chartData, setChartData] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
  
    
    const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all activities when the component mounts
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
          body: JSON.stringify({ ActivityName: "" }), // Fetch all activities
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setActivities(result.groupsOfActivities);

        // Set default selected activity
        setSelectedActivity(result.groupsOfActivities[0]?.ActivityName || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Fetch chart data for the selected activity
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedActivity) return;

      try {
        setLoading(true);

        const response = await fetch("/api/activities/groupsofactivity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GetToken()}`,
          },
          body: JSON.stringify({ ActivityName: selectedActivity }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Aggregate data to count groups per activity
        const data = result.groupsOfActivities.reduce((acc, curr) => {
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

        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedActivity]);

  // Handle change in selected activity from dropdown
  const handleActivityChange = (e) => {
    setSelectedActivity(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner border-4 border-dashed border-gray-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (chartData.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No group data available for any activity.</p>;
  }





	return (
        <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 hover:-translate-y-1 duration-300 ease-in-out hover:shadow-2xl">
      <h2 className="text-lg font-medium mb-4 text-black">Groups per Activity</h2>

      {/* Dropdown for selecting activity */}
      <div className="mb-4">
        <label htmlFor="activity-select" className="block text-sm font-medium text-black">
          Select Activity:
        </label>
        <select
          id="activity-select"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedActivity}
          onChange={handleActivityChange}
        >
          {activities.map((activity, index) => (
            <option key={index} value={activity.ActivityName}>
              {activity.ActivityName}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      <div className="h-96">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="ActivityName" stroke="#000000" />
            <YAxis stroke="#000000" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "#000000",
              }}
              itemStyle={{ color: "#000000" }}
            />
            <Legend />
            <Bar dataKey="GroupCount" fill="#000000">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
	);
};
export default ActivityBarChart;