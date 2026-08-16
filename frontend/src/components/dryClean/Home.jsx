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
       {page === "الاحصائيات" && <Dashboard />}
       {page === "الغرف" && <Rooms />}
       {page === "الطلبات" && <Requests />}
       {page === "ارسال الدفعة" && <DryCleaningDispatch />}
       {page === "الدفعات" && <DeliveryBatches />}
       {page === "Audit Log" && <AuditLog />}
       {page === "Item Types" && <ItemTypesAndPricing />}
       {page === "تكوين الغرفة" && <RoomConfig />}
    </div>
  )
}

export default Home