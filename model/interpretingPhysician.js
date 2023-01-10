const mongoose = require('mongoose')

const interpretingPhysicianSchema = new mongoose.Schema({
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
    
    fax: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },


   
})

module.exports = mongoose.model('InterpretingPhysician', interpretingPhysicianSchema)