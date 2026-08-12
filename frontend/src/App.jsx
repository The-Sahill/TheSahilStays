import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/register/SignUp';
import Login from './components/register/Login';
import { ToastContainer } from 'react-toastify';
import Home from './components/dryClean/Home';
import Systems from './components/home/Home';
import DeliveryBatches from './components/dryClean/Deliveries';
import { Loader2 } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

// مكون لحماية المسارات يتأكد من تسجيل الدخول
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // نتحقق من الـ API للتأكد من صحة جلسة المستخدم عبر الكوكيز
        const response = await fetch(`${apiUrl}/batches/user`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('خطأ في التحقق من المصادقة:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // أثناء عملية التحقق، نعرض علامة تحميل لئلا تظهر الصفحة المحمية بالخطأ
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // إذا لم يكن مسجلاً، وجهه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // إذا كان مسجلاً، اعرض المكون المطلوب
  return children;
};

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* صفحة التسجيل والدخول عامة (يمكنك وضع حماية لها أيضاً لو أردت منع الدخول إليها لمن سجل مسبقاً) */}
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/DeliveryBatches" element={<DeliveryBatches />} />

        {/* الصفحات المحمية بالكامل */}
        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Dashboard/dry-clean" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Systems" 
          element={
            <ProtectedRoute>
              <Systems />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;