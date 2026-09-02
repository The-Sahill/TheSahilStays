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
const transportation = require('./routes/transportation/requestRoute.js') // مسار ملف الـ Routes
const financialtransportation = require('./routes/transportation/financialRoute.js') // مسار ملف الـ Routes
const dashTransportation = require('./routes/transportation/dashboardRoute.js') // مسار ملف الـ Routes
const GuestRequest = require('./routes/userSystem/guestRequestRoute.js') 
const storeItem = require('./routes/storeItem/storeItemRoute.js') 
const guestReview = require('./routes/guestReview/guestReviewRoute.js') 
const hotelReview = require('./routes/hotelReview/hotelReviewRoute.js') 
const whatsapp = require('./routes/whatsapp/whatsappRoute.js') 


app.use(cors({
    origin: process.env.FRONTEND_URL ,
    credentials:true,
}
))

app.use(cookieParser())
app.use('/',authRoute)

// ربط المسارات مع بادئة /api
app.use('/',requestRoute)
app.use('/',GuestRequest)
app.use('/', roomRoutes);
app.use('/',batchRoute)
app.use('/',dashboardRoute) // ربط مسار لوحة التحكم
app.use('/',financialtransportation)
app.use('/',dashTransportation)
app.use('/',transportation)
app.use('/',storeItem)
app.use('/',guestReview)
app.use('/',hotelReview)
app.use('/',whatsapp)


mongoose.connect(process.env.MongoDB_URL).then(() => {
app.listen(process.env.PORT,()=> {
    console.log("Server is Ready to Take Off on Port:"+ process.env.PORT);
    
})
})