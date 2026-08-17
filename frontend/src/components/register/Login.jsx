import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import registerBg from '../../assets/images/Register.jpg'; // استبدل بمسار الصورة الخاصة بك
import { Link } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const apiUrl = import.meta.env.VITE_BACKEND_URL;


export default function SignupCard() {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const login = async () => {
    
    try {
      setLoading(true)
      const {data} = await axios.post(`${apiUrl}/login`,  {
name,
password
      },{
        withCredentials:true
      }
      )

      if(data.error==false){
toast.success('تم تسجيل الدخول بنجاح')
      }
      navigate('/Systems')
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message)
      console.log(error);
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
         تسجيل الدخول
        </h2>

        {/* نموذج الإدخال */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
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

           

          {/* زر التسجيل */}
          <div className="pt-4">
            <button
            disabled={loading}
             onClick={()=> login()}
              className={`${loading? "cursor-not-allowed" : "cursor-pointer"} w-full py-4 bg-white hover:bg-blue-50 text-slate-950 font-bold text-lg rounded-2xl shadow-lg shadow-white/10 transition duration-300 text-center`}
            >
              {loading ? "جاري تسجيل الدخول...." : "تسجيل الدخول"}
            </button>
          </div>

        </form>

        {/* رابط تسجيل الدخول */}
        <div className="text-center mt-8">
          <p className="text-base text-gray-300">
            ليس لديك حساب؟{' '}
            <Link to="/">
            <a className="text-blue-300 font-semibold hover:text-blue-200 transition">
               تسجيل حساب جديد
            </a>
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}