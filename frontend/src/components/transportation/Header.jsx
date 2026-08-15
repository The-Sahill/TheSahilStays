import React, { useEffect, useState } from 'react'
import axios from 'axios';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {

    const [name,setName] = useState("")

   
  useEffect(() => {
    const getUser = async () => {
try{
const {data} = await axios.get(`${apiUrl}/batches/user`, { withCredentials: true });
console.log(data.name)
if(data.error==false){
setName(data.name)
}


}
catch(error){
console.log(error)
}

    }

    getUser()

  }, []);
  return (
    <div>  <header className="bg-white border-b   border-gray-100 sticky top-0 z-40">
    <nav className="max-w-[1600px]  px-6 py-4 flex items-center justify-between">
      <div className="flex items-center  gap-10">
        <div className="flex items-center gap-2 font-medium text-sm">
            <span className='text-gray-400'>مساحة العمل /</span> نظرة عامة
        </div>
        <div className="font-bold text-lg">صباح الخير، {name}</div>
      </div>
   
    </nav>
  </header></div>
  )
}

export default Header