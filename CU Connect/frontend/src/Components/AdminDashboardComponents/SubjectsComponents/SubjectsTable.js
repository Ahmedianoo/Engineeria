import { FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { DeleteSubject, UpdateSubject } from "../../../endpoints/AdminDashboardEndpoint";

const SubjectsTable = ({ SUBJECT_DATA }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState(SUBJECT_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    SubjectCode: "",
    Name: "",
    Term: "",
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = SUBJECT_DATA.filter((subject) =>
      Object.values(subject).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
    setFilteredSubjects(filtered);
  };

  const handleDelete = async (subjectCode) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (confirmed) {
      try {
        await DeleteSubject(subjectCode);

        const updatedSubjects = filteredSubjects.filter(
          (subject) => subject.SubjectCode !== subjectCode
        );
        setFilteredSubjects(updatedSubjects);

        // console.log(`Subject with code ${subjectCode} was deleted.`);
        toast.success("Subject deleted successfully!");
      } catch (error) {
        console.error(`Failed to delete subject with code ${subjectCode}:`, error);
        toast.error("Failed to delete the subject. Please try again.");
      }
    } else {
    //   console.log(`Deletion canceled for subject with code ${subjectCode}.`);
      toast.error("Deletion canceled.");
    }
  };

  const openEditModal = (subject) => {
    setEditData({
      SubjectCode: subject.SubjectCode,
      Name: subject.Name,
      Term: subject.Term,
    });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditData({
      SubjectCode: "",
      Name: "",
      Term: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEditChanges = async () => {
    if (isUpdating) return; // Prevent multiple submissions
    
    try {
      setIsUpdating(true);
      // Call the UpdateSubject API endpoint
      await UpdateSubject(editData);

      // Update the local state with the edited data
      const updatedSubjects = filteredSubjects.map((subject) =>
        subject.SubjectCode === editData.SubjectCode
          ? { ...subject, Name: editData.Name, Term: editData.Term }
          : subject
      );
      
      setFilteredSubjects(updatedSubjects);
      toast.success("Subject updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Failed to update subject:", error);
      toast.error("Failed to update the subject. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-300 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border mb-8 hover:-translate-y-1 duration-300 ease-in-out hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Subject List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search subjects..."
            className="w-full bg-gray-300 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-300">
            <tr>
              {Object.keys(SUBJECT_DATA[0] || {}).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider sticky top-0 z-10 bg-gray-300"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider sticky top-0 z-10 bg-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {filteredSubjects.map((subject) => (
              <tr key={subject.SubjectCode}>
                {Object.values(subject).map((value, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-sm text-black"
                  >
                    {value}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <button
                    className="text-indigo-700 hover:text-indigo-600 mr-2"
                    onClick={() => openEditModal(subject)}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-700 hover:text-red-600"
                    onClick={() => handleDelete(subject.SubjectCode)}
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Subject</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subject Code
              </label>
              <input
                type="text"
                name="SubjectCode"
                value={editData.SubjectCode}
                onChange={handleEditChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="Name"
                value={editData.Name}
                onChange={handleEditChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                disabled={isUpdating}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Term
              </label>
              <select
                name="Term"
                value={editData.Term}
                onChange={handleEditChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
                disabled={isUpdating}
              >
                <option value="fall">Fall</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={saveEditChanges}
                disabled={isUpdating}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center ${
                  isUpdating ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsTable;