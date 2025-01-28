import React, { useState } from 'react';
import Sidebar from '../Components/AdminDashboardComponents/Sidebar';
import Users from '../Components/AdminDashboardComponents/Users';
import Subjects from '../Components/AdminDashboardComponents/Subjects';
import Activities from '../Components/AdminDashboardComponents/Activities';
import Navbar from '../Components/Navbar';

function AdminDashboard() {
  const [adminComponent, setAdminComponent] = useState('users');
  console.log(adminComponent);

  return (
    <>
    <Navbar/>
    <div className="flex h-full">
      <Sidebar setAdminComponent={setAdminComponent} />

      <div className="flex-grow p-4 bg-gray-100">
        {adminComponent === 'users' && <Users />}
        {adminComponent === 'subjects' && <Subjects />}
        {adminComponent === 'activity' && <Activities />}
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
