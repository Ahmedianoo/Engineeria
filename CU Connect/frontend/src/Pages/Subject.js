import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Navbar from "../Components/Navbar";
import { AddSubject, GetSubjects } from "../endpoints/CreateSubject";
import { useNavigate } from "react-router-dom"; // Import this for navigation


const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        >
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>,
        document.body // Mounts the modal outside of the React root
    );
};

const Subjects = () => {
    // State for form data
    const [formData, setFormData] = useState({
        subjectName: "",
        subjectCode: "",
        term: "",
    });

    // State for the list of subjects
    const [subjects, setSubjects] = useState([]);

    // State for modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);

    // State for loading status
    const [isLoading, setIsLoading] = useState(false);

    // Fetch subjects taught by the user
    const fetchSubjects = async () => {
        try {
            const userSubjects = await GetSubjects(); // Assume GetSubjects fetches data
            setSubjects(userSubjects.recordset); // Updating state triggers re-render
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    // Handle form input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await AddSubject(formData);
        setIsLoading(false);
        fetchSubjects(); // Refresh subjects list after addition
        setIsModalVisible(false); // Close modal
    };

    // Fetch subjects on component mount
    useEffect(() => {
        fetchSubjects();
    }, []);

    // Subject List Component
    const SubjectList = ({ subjects }) => {
        const navigate = useNavigate();

        const handleRedirect = (subjectCode) => {
            navigate(`/subjectdetails?subjectcode=${subjectCode}`);
        };

        return (
            <div className="bg-white shadow-md rounded-lg mb-6 p-6">
                <h2 className="text-xl font-bold mb-4">Existing Subjects</h2>
                {subjects.length > 0 ? (
                    <ul className="space-y-2">
                        {subjects.map((subject, index) => (
                            <li
                                key={index}
                                onClick={() => handleRedirect(subject.SubjectCode)}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
                            >
                                <p className="text-lg font-semibold">{subject.Name}</p>
                                <p className="text-sm text-gray-600">
                                    Code: {subject.SubjectCode} | Semester: {subject.Term}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No subjects created yet.</p>
                )}
            </div>
        );
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                {/* Header Section */}
                <div className="w-full max-w-2xl">
                    <h1 className="text-3xl font-bold text-center mb-6">Subjects Management</h1>

                    {/* Existing Subjects Section */}
                    <SubjectList subjects={subjects} />

                    {/* Add New Subject Button */}
                    <div className="text-center mb-6">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsModalVisible(true)}
                        >
                            Add New Subject
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Subject Modal */}
            <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
                <h2 className="text-2xl font-bold mb-6 text-center">Create Subject</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subject Name Field */}
                    <div>
                        <label htmlFor="subjectName" className="block text-sm font-medium mb-1">
                            Subject Name
                        </label>
                        <input
                            type="text"
                            id="subjectName"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Enter subject name"
                            required
                        />
                    </div>

                    {/* Subject Code Field */}
                    <div>
                        <label htmlFor="subjectCode" className="block text-sm font-medium mb-1">
                            Subject Code
                        </label>
                        <input
                            type="text"
                            id="subjectCode"
                            name="subjectCode"
                            value={formData.subjectCode}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Enter subject code"
                            required
                        />
                    </div>

                    {/* Semester Dropdown */}
                    <div>
                        <label htmlFor="Term" className="block text-sm font-medium mb-1">
                            Semester
                        </label>
                        <select
                            id="term"
                            name="term"
                            value={formData.term}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="" disabled>
                                Select semester
                            </option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Subject"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default Subjects;





