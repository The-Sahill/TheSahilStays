import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Dashboard from './Dashboard'    
import Rooms from './Rooms'
import Requests from './Requests'
import DryCleaningDispatch from './DryCleaningDispatch'
import DeliveryBatches from './Deliveries'
import AuditLog from './AuditLog'
import ItemTypesAndPricing from './ItemTypes'
import RoomConfig from './RoomConfig'

const Home = () => {

    const [page, setPage] = useState("Dashboard")
  return (
    <div className='flex h-screen bg-slate-50 text-slate-900 font-sans' dir='rtl'>
        <SideMenu setPage={setPage} page={page} />
       {page === "Dashboard" && <Dashboard />}
       {page === "Rooms" && <Rooms />}
       {page === "Requests" && <Requests />}
       {page === "Dry Cleaning" && <DryCleaningDispatch />}
       {page === "Batches" && <DeliveryBatches />}
       {page === "Audit Log" && <AuditLog />}
       {page === "Item Types" && <ItemTypesAndPricing />}
       {page === "Room Config" && <RoomConfig />}
    </div>
  )
}

export default Home