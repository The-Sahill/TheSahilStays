const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
app.use(express.json())
const authRoute = require('./routes/authRoute')
const roomRoutes = require('./routes/room'); // مسار ملف الـ Routes
const requestRoute = require('./routes/requestRoute') // مسار ملف الـ Routes
const batchRoute = require('./routes/batchRoute') // مسار ملف الـ Routes
const dashboardRoute = require('./routes/dashboardRoute') // مسار ملف الـ Routes


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}
))

app.use(cookieParser())
app.use('/',authRoute)

// ربط المسارات مع بادئة /api
app.use('/', roomRoutes);
app.use('/',requestRoute)
app.use('/',batchRoute)
app.use('/',dashboardRoute) // ربط مسار لوحة التحكم


mongoose.connect(process.env.MongoDB_URL).then(() => {
app.listen(process.env.PORT,()=> {
    console.log("Server is Ready to Take Off on Port:"+ process.env.PORT);
    
})
})