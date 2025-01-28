import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

// Mock functions to simulate API calls
import {
    fetchConnections,
    generateStudentCode,
    connectToStudent,
} from "../endpoints/Connect";

const StudentConnections = () => {
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(null);
    const [connectCode, setConnectCode] = useState("");
    const [error, setError] = useState(null);

    // Fetch connections when the component mounts
    useEffect(() => {
        const loadConnections = async () => {
            setIsLoading(true);
            try {
                const response = await fetchConnections(); // Simulated API call
                if (response && response.connections) {
                    setConnections(response.connections); // Access the 'connections' array in JSON
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (err) {
                console.error("Error fetching connections:", err);
                setError("Failed to load connections.");
            } finally {
                setIsLoading(false);
            }
        };

        loadConnections();
    }, []);

    // Generate a code
    const handleGenerateCode = async () => {
        try {
            const response = await generateStudentCode(); // Simulated API call
            if (response && response.ConnectionCode) {
                setGeneratedCode(response.ConnectionCode);
            } else {
                throw new Error("Invalid response structure for generated code.");
            }
        } catch (err) {
            console.error("Error generating code:", err);
            alert("Failed to generate code. Please try again.");
        }
    };

    // Connect to a student using a code
    const handleConnect = async () => {
        if (!connectCode.trim()) {
            alert("Please enter a valid code.");
            return;
        }

        try {
            await connectToStudent(connectCode); // Simulated API call
            alert("Connection successful!");
            setConnectCode("");
            const updatedConnections = await fetchConnections(); // Refresh connections
            if (updatedConnections && updatedConnections.connections) {
                setConnections(updatedConnections.connections);
            }
        } catch (err) {
            console.error("Error connecting to student:", err);
            alert("Failed to connect. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-4xl font-bold mb-6">Student Connections</h1>

                    {/* Connections List */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Your Connections</h2>
                            <p className="text-sm text-gray-600">
                                Total Connections: <span className="font-semibold">{connections.length}</span>
                            </p>
                        </div>
                        {isLoading ? (
                            <p>Loading connections...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                                <ul className="space-y-2">
                                    {connections.map((connection, index) => (
                                        <li
                                            key={index}
                                            className="p-4 bg-gray-50 border-b last:border-none border-gray-200"
                                        >
                                            <p className="font-semibold">{connection.name}</p>
                                            <p className="text-sm text-gray-600">{connection.Email}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Generate Code Section */}
                    <div className="mt-8">
                        <div className="flex items-center space-x-4">
                            <button
                                className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                onClick={handleGenerateCode}
                            >
                                Generate Code
                            </button>
                            {generatedCode && (
                                <p className="text-sm text-gray-700">
                                    Code: <span className="font-semibold">{generatedCode}</span>
                                </p>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Code is valid for one connection only.
                        </p>
                    </div>

                    {/* Connect to Student Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2">Connect to a Student</h3>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={connectCode}
                                onChange={(e) => setConnectCode(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                onClick={handleConnect}
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentConnections;
