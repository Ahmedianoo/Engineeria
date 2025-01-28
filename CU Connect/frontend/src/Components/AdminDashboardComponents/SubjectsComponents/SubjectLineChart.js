import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const salesData = [
// 	{ name: "2023 Fall", SubjectsInTerm: 12 },
// 	{ name: "2023 Spring", SubjectsInTerm: 10 },
// 	{ name: "2024 Fall", SubjectsInTerm: 12 },
// 	{ name: "2024 Spring", SubjectsInTerm: 9 },
// 	{ name: "2025 Fall", SubjectsInTerm: 15 },
// ];

const SubjectLineChart = ({data}) => {
	return (
		<div
			className="bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl px-6 pt-6 transform transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
			<h2 className="text-lg font-medium mb-5 text-black">Subjects</h2>

			<div className="h-80 ">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" stroke="#000000" />
						<XAxis dataKey="name" stroke="#000000" />
						<YAxis stroke="#000000" />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 1)",
								borderColor: "#000000",
							}}
							itemStyle={{ color: "#000000" }}
						/>
						<Line
							type="monotone"
							dataKey="SubjectsInTerm"
							stroke="#6366F1"
							strokeWidth={4}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default SubjectLineChart;
