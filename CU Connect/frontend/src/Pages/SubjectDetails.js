import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { fetchSubjectDetails, fetchTAs, assignTAToSection, removeStudent, addSection } from "../endpoints/GetSubjectDetails";
import { useLocation } from "react-router-dom";

const SubjectDetails = () => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const subjectCode = queryParams.get("subjectcode");

    const [subjectDetails, setSubjectDetails] = useState({ sections: [] });
    const [TAs, setTAs] = useState([]); // List of TAs
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTimingInput, setShowTimingInput] = useState(false); // Controls textbox visibility
    const [newTiming, setNewTiming] = useState(""); // Stores the timing input

    const loadSubjectDetails = async () => {
        try {
            setIsLoading(true);
            const subjectData = await fetchSubjectDetails(subjectCode);
            if (subjectData && Array.isArray(subjectData.sections)) {
                setSubjectDetails(subjectData);
            } else {
                throw new Error("Invalid subject details structure.");
            }
        } catch (err) {
            console.error("Error re-fetching subject details:", err);
            alert("Failed to update subject details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSection = () => {
        setShowTimingInput(true); // Show the textbox for timing input
    };

    const handleSubmitTiming = async () => {
        if (!newTiming.trim()) {
            alert("Please enter valid timing for the section.");
            return;
        }

        try {
            // Call backend to add a new section with timing
            await addSection(subjectCode, newTiming); // Assume backend supports timing
            setNewTiming("");
            setShowTimingInput(false);

            // Re-fetch subject details after adding the section
            await loadSubjectDetails();
        } catch (err) {
            console.error("Error adding new section:", err);
            alert("Failed to add a new section. Please try again.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!subjectCode) throw new Error("Subject code is missing in the URL.");

                await loadSubjectDetails();

                const taData = await fetchTAs();
                if (taData && Array.isArray(taData.TAs)) {
                    setTAs(taData.TAs); // Expecting { TAs: [{ UserId: 2, Name: 'Omar Gamal' }] }
                } else {
                    throw new Error("Invalid TAs data structure.");
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load subject details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [subjectCode]);

    const handleAssignTA = async (sectionId, taId) => {
        try {
            await assignTAToSection(sectionId, taId);
            await loadSubjectDetails(); // Re-fetch details to reflect changes
        } catch (err) {
            console.error(`Error assigning TA to section ${sectionId}:`, err);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <p>Loading subject details...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold">Subject Details</h1>
                            <p className="text-sm text-gray-500">Manage sections, TAs, and students</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                                onClick={handleAddSection}
                            >
                                Add Section
                            </button>
                            <button
                                className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                onClick={() =>
                                    window.location.href = `/subjectproject?subjectcode=${subjectCode}`
                                }
                            >
                                View Project
                            </button>
                        </div>
                    </div>

                    {/* Timing Input */}
                    {showTimingInput && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-2">Enter Section Timing</h3>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Enter timing (e.g., Mon 10-12)"
                                    value={newTiming}
                                    onChange={(e) => setNewTiming(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                />
                                <button
                                    className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                                    onClick={handleSubmitTiming}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}

                    {subjectDetails.sections.map((section) => (
                        <div key={section.SectionId} className="mb-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Section {section.SectionId}{" "}
                                    <span className="text-sm text-gray-600">({section.Timing})</span>
                                </h2>
                                <p className="text-sm text-gray-500 font-semibold">
                                    Class Code: {section.ClassCode}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2">Teaching Assistants</h3>
                                <div className="flex items-center space-x-4">
                                    <select
                                        className="w-64 px-4 py-2 border border-gray-300 rounded-md"
                                        onChange={(e) =>
                                            handleAssignTA(section.SectionId, parseInt(e.target.value))
                                        }
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select a TA
                                        </option>
                                        {TAs.map((ta) => (
                                            <option key={ta.UserId} value={ta.UserId}>
                                                {ta.Name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-gray-600">
                                        Currently Assigned:{" "}
                                        <span className="font-semibold">
                                            {section.SectionTA?.map((ta) => ta.Name).join(", ") || "None"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">Students</h3>
                                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                                    <ul className="space-y-2">
                                        {section.SectionStudents?.map((student) => (
                                            <li
                                                key={student.UserId}
                                                className="p-4 bg-white border border-gray-200 rounded-md shadow-sm flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-semibold">{student.Name}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        Email: {student.Email}
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-error px-4 py-2 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                                                    onClick={() =>
                                                        removeStudent(student.UserId, section.SectionId)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SubjectDetails;

// import React, { useState, useEffect } from "react";
// import Navbar from "../Components/Navbar";
// import { fetchSubjectDetails, fetchTAs, assignTAToSection, removeStudent, addSection } from "../endpoints/GetSubjectDetails";
// import { useLocation } from "react-router-dom";

// const SubjectDetails = () => {
//     const location = useLocation();

//     const queryParams = new URLSearchParams(location.search);
//     const subjectCode = queryParams.get("subjectcode");

//     const [subjectDetails, setSubjectDetails] = useState({ sections: [] });
//     const [TAs, setTAs] = useState([]); // List of TAs
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showTimingInput, setShowTimingInput] = useState(false); // Controls textbox visibility
//     const [newTiming, setNewTiming] = useState(""); // Stores the timing input

//     const loadSubjectDetails = async () => {
//         try {
//             setIsLoading(true);
//             const subjectData = await fetchSubjectDetails(subjectCode);
//             if (subjectData && Array.isArray(subjectData.sections)) {
//                 setSubjectDetails(subjectData);
//             } else {
//                 throw new Error("Invalid subject details structure.");
//             }
//         } catch (err) {
//             console.error("Error re-fetching subject details:", err);
//             alert("Failed to update subject details. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleAddSection = () => {
//         setShowTimingInput(true); // Show the textbox for timing input
//     };

//     const handleSubmitTiming = async () => {
//         if (!newTiming.trim()) {
//             alert("Please enter valid timing for the section.");
//             return;
//         }

//         try {
//             // Call backend to add a new section with timing
//             await addSection(subjectCode, newTiming); // Assume backend supports timing
//             setNewTiming("");
//             setShowTimingInput(false);

//             // Re-fetch subject details after adding the section
//             await loadSubjectDetails();
//         } catch (err) {
//             console.error("Error adding new section:", err);
//             alert("Failed to add a new section. Please try again.");
//         }
//     };

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 if (!subjectCode) throw new Error("Subject code is missing in the URL.");

//                 await loadSubjectDetails();

//                 const taData = await fetchTAs();
//                 if (taData && Array.isArray(taData.TAs)) {
//                     setTAs(taData.TAs); // Expecting { TAs: [{ UserId: 2, Name: 'Omar Gamal' }] }
//                 } else {
//                     throw new Error("Invalid TAs data structure.");
//                 }
//             } catch (err) {
//                 console.error("Error loading data:", err);
//                 setError("Failed to load subject details. Please try again later.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadData();
//     }, [subjectCode]);

//     const handleAssignTA = async (sectionId, taId) => {
//         try {
//             await assignTAToSection(sectionId, taId);
//             await loadSubjectDetails(); // Re-fetch details to reflect changes
//         } catch (err) {
//             console.error(`Error assigning TA to section ${sectionId}:`, err);
//         }
//     };

//     if (isLoading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                     <p>Loading subject details...</p>
//                 </div>
//             </>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <div className="min-h-screen bg-gray-100 p-6">
//                 <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <h1 className="text-4xl font-bold">Subject Details</h1>
//                             <p className="text-sm text-gray-500">Manage sections, TAs, and students</p>
//                         </div>
//                         <div className="flex space-x-4">
//                             <button
//                                 className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600 transition"
//                                 onClick={handleAddSection}
//                             >
//                                 Add Section
//                             </button>
//                             <button
//                                 className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
//                                 onClick={() =>
//                                     window.location.href = `/subjectproject?subjectcode=${subjectCode}`
//                                 }
//                             >
//                                 View Project
//                             </button>
//                         </div>
//                     </div>

//                     {/* Timing Input */}
//                     {showTimingInput && (
//                         <div className="mb-8">
//                             <h3 className="text-lg font-bold mb-2">Enter Section Timing</h3>
//                             <div className="flex space-x-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Enter timing (e.g., Mon 10-12)"
//                                     value={newTiming}
//                                     onChange={(e) => setNewTiming(e.target.value)}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
//                                 />
//                                 <button
//                                     className="btn btn-primary px-4 py-2 text-sm font-semibold rounded-md bg-green-500 text-white hover:bg-green-600 transition"
//                                     onClick={handleSubmitTiming}
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {subjectDetails.sections.map((section) => (
//                         <div key={section.SectionId} className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4">
//                                 Section {section.SectionId}{" "}
//                                 <span className="text-sm text-gray-600">({section.Timing})</span>
//                             </h2>

//                             <div className="mb-4">
//                                 <h3 className="text-lg font-bold mb-2">Teaching Assistants</h3>
//                                 <div className="flex items-center space-x-4">
//                                     <select
//                                         className="w-64 px-4 py-2 border border-gray-300 rounded-md"
//                                         onChange={(e) =>
//                                             handleAssignTA(section.SectionId, parseInt(e.target.value))
//                                         }
//                                         defaultValue=""
//                                     >
//                                         <option value="" disabled>
//                                             Select a TA
//                                         </option>
//                                         {TAs.map((ta) => (
//                                             <option key={ta.UserId} value={ta.UserId}>
//                                                 {ta.Name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <p className="text-sm text-gray-600">
//                                         Currently Assigned:{" "}
//                                         <span className="font-semibold">
//                                             {section.SectionTA?.map((ta) => ta.Name).join(", ") || "None"}
//                                         </span>
//                                     </p>
//                                 </div>
//                             </div>

//                             <div>
//                                 <h3 className="text-lg font-bold mb-2">Students</h3>
//                                 <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
//                                     <ul className="space-y-2">
//                                         {section.SectionStudents?.map((student) => (
//                                             <li
//                                                 key={student.UserId}
//                                                 className="p-4 bg-white border border-gray-200 rounded-md shadow-sm flex justify-between items-center"
//                                             >
//                                                 <div>
//                                                     <p className="font-semibold">{student.Name}</p>
//                                                     <p className="text-gray-600 text-sm">
//                                                         Email: {student.Email}
//                                                     </p>
//                                                 </div>
//                                                 <button
//                                                     className="btn btn-sm btn-error px-4 py-2 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition"
//                                                     onClick={() =>
//                                                         removeStudent(student.UserId, section.SectionId)
//                                                     }
//                                                 >
//                                                     Remove
//                                                 </button>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SubjectDetails;




