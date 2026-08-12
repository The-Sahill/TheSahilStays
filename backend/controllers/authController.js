const Auth = require('../models/auth')
const jwt = require('jsonwebtoken')

exports.register = async (req,res) => {

    try{
 const {name , password ,confirmationPassword,systemPassword} = req.body
 
    if(!name  || !password || !confirmationPassword || !systemPassword){
        return res.status(400).json({error:true,message:"يرجى ملء جميع الحقول"}) 
    }


    if (password !== confirmationPassword){
        return res.status(400).json({error:true,message:"كلمة المرور وتأكيد كلمة المرور غير متطابقين"})
    }

    
    if ( systemPassword !== process.env.SYSTEM_PASSWORD){
        return res.status(400).json({error:true,message:"كلمة المرور الخاصة بالنظام غير صحيحة"})
    }

    const checkName = await Auth.findOne({name})
    if (checkName) {
        return res.status(400).json({error:true,message:"اسم المستخدم موجود بالفعل"})
    }
    const auth = Auth.create({
        name,
        password
    })

    return res.status(200).json({error:false,message:"تم التسجيل بنجاح"})
    }
    catch(error){
        console.log(error);
        
    }
   
}

exports.login = async (req,res) => {
try{
    const {name , password} = req.body

    if(!name  || !password){
        return res.status(400).json({error:true,message:"يرجى ملء جميع الحقول"}) 
    }

    const auth = await Auth.findOne({name})

    if(!auth){
        return res.status(400).json({error:true,message:"اسم المستخدم غير موجود"})
    }

    if(auth.password !== password){
        return res.status(400).json({error:true,message:"كلمة المرور غير صحيحة"})
    }

    
    
  const token = jwt.sign(
    { id: auth._id, name: auth.name }
,process.env.JWT_SECRET)



res.cookie('token', token, {
  httpOnly: true,
  secure: false, // ضروري إذا تستخدم https
  sameSite: 'Lax', // يسمح بالإرسال عبر النطاقات
  maxAge: 24 * 60 * 60 * 1000 // 1 يوم مثلاً
});

    return res.status(200).json({error:false,message:"تم تسجيل الدخول بنجاح"})

}
catch(error){
    console.log(error);
    return res.status(500).json({error:true,message:"حدث خطأ ما"})
    
}

}


exports.logout = async (req, res) => {
    try {
        // مسح الـ Cookie الخاصة بالتوكن عن طريق إبطالها وتصفير وقت الصلاحية
        res.clearCookie('token', {
            httpOnly: true,
            secure: true, // يجب أن تتطابق مع إعدادات الـ cookie عند تسجيل الدخول
            sameSite: 'None',
        });

        return res.status(200).json({
            error: false,
            message: "تم تسجيل الخروج بنجاح"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "حدث خطأ ما أثناء تسجيل الخروج"
        });
    }
};


exports.getCurrentUser = async (req, res) => {
    try {
        // الـ Token يتم فك تشفيره غالباً عبر الـ Middleware الخاص بالتحقق من الحماية (auth middleware)
        // ومفرّض أن الـ req.user يحتوي على بيانات المستخدم (id, name)
        if (!req.user) {
            return res.status(401).json({ error: true, message: "غير مسجل الدخول" });
        }

        return res.status(200).json({
            error: false,
            name: req.user.name // اسم الموظف/المستخدم
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "حدث خطأ ما" });
    }
};