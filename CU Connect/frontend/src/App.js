// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './hooks/useAuthContext'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Activities from './Pages/Activities'
import Projects from './Pages/Projects'
import Error404Page from './Pages/Error404Page'
import Profile from './Pages/Profile'
import CreateSubject from './Pages/Subject'
import SubjectDetails from './Pages/SubjectDetails'
import SubjectProject from './Pages/SubjectProject'
import StudentConnections from './Pages/Connection'
import AdminDashboard from './Pages/AdminDashboard'

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={user?.user?.UserType === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects"
              element={user ? <Projects /> : <Navigate to="/login" />}
            />
            <Route 
              path="/activity" 
              element={user?.user?.UserType === "admin" || user?.user?.UserType === "student" ?  <Activities/> : <Navigate to="/" />} 
            />

            <Route 
              path="/connection" 
              element={user?.user?.UserType === "student" ?  <StudentConnections /> : <Navigate to="/" />} 
            />

            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/subjects"
              element={user?.user?.UserType !== "teacherTA" && user?.user?.UserType !== "student" ? <CreateSubject /> : <Navigate to="/Subject" />}
            />
            <Route
              path="/subjectdetails"
              element={user ? <SubjectDetails /> : <Navigate to="/" />}
            />
            <Route
              path="/subjectproject"
              element={user ? <SubjectProject /> : <Navigate to="/" />}
            />
            <Route
              path="/connection"
              element={user ? <StudentConnections /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={<Error404Page />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;