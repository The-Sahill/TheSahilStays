import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Dashboard from './Dashboard'
import Requests from './Requests'
import Financial from './Financial'
import Sidebar from './SideMenu';
import UpdateRequest from './UpdateRequest'

const Home = () => {

    const [page, setPage] = useState("Dashboard")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className='flex h-screen bg-slate-50 text-slate-900 font-sans' dir='rtl'>
       <Sidebar 
        page={page} 
        setPage={setPage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
       {page === "Dashboard" && <Dashboard />}
       {page === "Requests" && <Requests />}
       {page === "Financial" && <Financial />}
       {page === "Update Requests" && <UpdateRequest />}
     
    </div>
  )
}

export default Home