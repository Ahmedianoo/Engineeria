import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaBars, 
  FaUsers ,
  FaRunning 
} from "react-icons/fa";
import { MdOutlineMenuBook } from "react-icons/md";

const SIDEBAR_ITEMS = [
  { name: "Users", icon: FaUsers, color: "#EC4899" , comp : "users" },
  { name: "Subjects", icon: MdOutlineMenuBook, color: "#10B981" , comp : "subjects" },
  { name: "Activities", icon: FaRunning, color: "#3B82F6" , comp : "activity" },
];

const Sidebar = ({setAdminComponent}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
    <div
      className={`relative z-5 transition-all duration-300 ease-in-out flex-shrink-0  ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      style={{ width: isSidebarOpen ? "170px" : "80px" }}
    >
      <div className=" bg-gray-300 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r h-full min-h-screen">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-300 transition-colors max-w-fit"
        >
          <FaBars size={24} />
        </button>

        <nav className="mt-8 flex-grow ">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.comp} onClick={() => setAdminComponent(item.comp)}>
              <div
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors mb-2"
              >
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                {isSidebarOpen && (
                  <span className="ml-4 whitespace-nowrap">{item.name}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
