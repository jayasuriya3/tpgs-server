const mongoose = require('mongoose')

const referingPhysicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dayPhone: {
        type: String,
        required: true
    },
   
    afterHourPhone: {
        type: String,
        required: true
    },
   
    hospital: {
        type: String,
        required: true
    },
    
    address: {
        type: String,
        required: true
    },
    
    fax: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },


   
},{timestamps:true})

module.exports = mongoose.model('ReferingPhysician', referingPhysicianSchema)