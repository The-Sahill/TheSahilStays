const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    password:{
        type:String
    },

})

const Auth = mongoose.model('Auth', authSchema)



module.exports = Auth;
