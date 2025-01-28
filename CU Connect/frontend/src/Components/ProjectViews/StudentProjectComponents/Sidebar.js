import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";

// Assume EnrollInSection is imported
import { EnrollInSection } from "../../../endpoints/StudentProjectEndpoint"; // Adjust the import path accordingly

const Sidebar = ({ enrollments, setAdminComponent, setSelectedSectionId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classCode, setClassCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API to enroll in a section
      const result = await EnrollInSection(classCode);

      // Show success toast and log result
      toast.success(result.success);
      console.log(result);

      // Optionally update UI with new enrollment (if needed)
      // For example, if you want to fetch enrollments again:
      // fetchEnrollments();

      // Close the modal
      setClassCode("");
      setIsModalOpen(false);
    } catch (error) {
      // Show error message
      toast.error(error.message || "Failed to enroll in class");
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`relative z-5 transition-all duration-300 ease-in-out flex-shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        style={{ width: isSidebarOpen ? "170px" : "80px" }}
      >
        <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r h-full min-h-screen overflow-y-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-300 transition-colors max-w-fit"
            >
              <FaBars size={24} />
            </button>
            {isSidebarOpen && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                <IoMdAdd size={24} />
              </button>
            )}
          </div>

          <nav className="mt-8 flex-grow overflow-y-auto">
            {enrollments.map((enrollment, index) => (
              <button
                key={index}
                onClick={() => {
                  setAdminComponent(enrollment.SubjectCode);
                  setSelectedSectionId(enrollment.SectionId);
                }}
              >
                <div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors mb-2">
                  {isSidebarOpen ? (
                    <span className="whitespace-normal">
                      {enrollment.Name} - {enrollment.Timing}
                    </span>
                  ) : (
                    <h1 className="text-xl">
                      {enrollment.Name.charAt(0) + enrollment.Name.charAt(1)}
                    </h1>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Join Class Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Join Class</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter Class Code</span>
              </label>
              <input
                type="text"
                placeholder="Enter code here"
                className="input input-bordered w-full"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Join
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Sidebar;
