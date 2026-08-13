import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Dashboard from './Dashboard'
import Requests from './Requests'
import Financial from './Financial'

const Home = () => {

    const [page, setPage] = useState("Dashboard")
  return (
    <div className='flex h-screen bg-slate-50 text-slate-900 font-sans' dir='rtl'>
        <SideMenu setPage={setPage} page={page} />
       {page === "Dashboard" && <Dashboard />}
       {page === "Requests" && <Requests />}
       {page === "Financial" && <Financial />}
     
    </div>
  )
}

export default Home