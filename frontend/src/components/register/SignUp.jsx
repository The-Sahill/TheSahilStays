import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import registerBg from '../../assets/images/Register.jpg'; // استبدل بمسار الصورة الخاصة بك
import { Link } from 'react-router-dom';
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';


const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignupCard() {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [systemPassword, setSystemPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const naviagte = useNavigate()

  

const register = async () => {
 try{
  setLoading(true)
  
  const {data} = await axios.post(`${apiUrl}/register`, { 
    name,
    password,
    confirmationPassword,
    systemPassword
  },{withCredentials:true}
  )
  

  if(data.error==false){
    toast.success('تم إنشاء الحساب بنجاح')
  }

  naviagte('/login')
  
  setLoading(false)
 }catch(error){
  toast.error(error.response?.data?.message)
  setLoading(false)
 }
}

  return (
    // الحاوية الرئيسية: استخدام الصورة المستوردة كخلفية
    <div 
      className="relative flex items-center justify-center min-h-screen font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${registerBg})` }} 
    >
      {/* طبقة تغشية (Overlay) داكنة خفيفة فوق الصورة لضمان وضوح النص */}
      <div className="absolute inset-0  z-0"></div>

      {/* صندوق إنشاء الحساب الشفاف */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-[2.5rem] backdrop-blur-xl bg-gradient-to-b from-white/5 via-white/5 to-black/10 border border-white/10 shadow-2xl shadow-black/30 text-right" dir="rtl">
        
        {/* العنوان */}
        <h2 className="text-3xl font-bold text-white text-center mb-10 tracking-tight">
          إنشاء حساب
        </h2>

        {/* نموذج الإدخال */}
        <div className="space-y-6">
          
          {/* حقل اسم المستخدم */}
          <div className="relative flex items-center group">
            <input
            onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="اسم المستخدم"
              className="w-full py-4 pr-14 pl-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 text-base focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition duration-300"
            />
            <User className="absolute right-5 w-6 h-6 text-gray-400 group-focus-within:text-blue-300 transition" />
          </div>

         

          {/* حقل كلمة المرور */}
          <div className="relative flex items-center group">
            <input
            onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="كلمة المرور"
              className="w-full py-4 pr-14 pl-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 text-base focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition duration-300"
            />
            <Lock className="absolute right-5 w-6 h-6 text-gray-400 group-focus-within:text-blue-300 transition" />
          </div>

            {/* حقل كلمة المرور */}
            <div className="relative flex items-center group">
            <input
                onChange={(e) => setConfirmationPassword(e.target.value)}
              type="password"
              placeholder="تأكيد كلمة المرور "
              className="w-full py-4 pr-14 pl-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 text-base focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition duration-300"
            />
            <Lock className="absolute right-5 w-6 h-6 text-gray-400 group-focus-within:text-blue-300 transition" />
          </div>


            {/* حقل كلمة المرور */}
            <div className="relative flex items-center group">
            <input
                onChange={(e) => setSystemPassword(e.target.value)}
              type="password"
              placeholder="كلمة المرور الخاصة بالنظام"
              className="w-full py-4 pr-14 pl-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 text-base focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition duration-300"
            />
            <Lock className="absolute right-5 w-6 h-6 text-gray-400 group-focus-within:text-blue-300 transition" />
          </div>

          {/* زر التسجيل */}
          <div className="pt-4">
          <button
  onClick={register}
  disabled={loading}
  className={`w-full py-4 font-bold text-lg rounded-2xl transition duration-300
    ${
      loading
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-white hover:bg-blue-50 text-slate-950"
    }`}
>
  {loading ? "جاري إنشاء الحساب..." : "تسجيل"}
</button>
          </div>

        </div>

        {/* رابط تسجيل الدخول */}
        <div className="text-center mt-8">
          <p className="text-base text-gray-300">
            هل لديك حساب؟{' '}
            <Link to="/Login">
            <a className="text-blue-300 font-semibold hover:text-blue-200 transition">
               تسجيل الدخول
            </a>
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}