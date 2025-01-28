// import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { GetStudentsPerSubject } from "../../../endpoints/AdminDashboardEndpoint"; 
import { useEffect, useState } from "react";
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

// const SALES_CHANNEL_DATA = [
// 	{ SubjectCode: "CMPS101", NumberOfStudents: 110 },
// 	{ SubjectCode: "MTHS101", NumberOfStudents: 200 },
// 	{ SubjectCode: "CMPS202", NumberOfStudents: 190 },
// 	{ SubjectCode: "CMPS201", NumberOfStudents: 60 },
// ];
// Sales by Channel
const SubjectBarChart = () => {
	const [subjects, setSubjects] = useState([]); 
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); 

	useEffect(() => {
		const fetchSubjects = async () => {
		try {
			setLoading(true)
			const data = await GetStudentsPerSubject(); 
			setSubjects(data); 
			setLoading(false); 
		} catch (err) {
			setError(err.message); 
			setLoading(false);
		}
		};

		fetchSubjects();
	}, []); 

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
	return (
		<div className='bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 hover:-translate-y-1 duration-300 ease-in-out hover:shadow-2xl'>
			<h2 className='text-lg font-medium mb-4 text-black'>Students per subject</h2>
			<div className='h-96'>
				<ResponsiveContainer>
					<BarChart data={subjects}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey='SubjectCode' stroke='#000000' />
						<YAxis stroke='#000000' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 1)",
								borderColor: "#000000",
							}}
							itemStyle={{ color: "#000000" }}
						/>
						<Legend />
						<Bar dataKey={"NumberOfStudents"} fill='#000000'>
							{subjects.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
export default SubjectBarChart;
