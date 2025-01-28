import Navbar from "../Components/Navbar"
import ProjectsTAView from "../Components/ProjectsDashboardComponents/TAView"
import StudentProject from "../Components/ProjectViews/StudentProject";
import { useAuthContext } from "../hooks/useAuthContext";

function Projects() {
    const { user } = useAuthContext();
    console.log(user.user.UserType)
    const UserType = user.user.UserType
    return (
        <>
            <Navbar/>
            <h1 className="text-3xl font-bold">
                projects
            </h1>
            
            {UserType === 'teacherTA' && <ProjectsTAView/> }
            {UserType === 'student' && <StudentProject/> }
        </>
    )
}

export default Projects
