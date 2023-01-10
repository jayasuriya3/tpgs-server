const mongoose = require('mongoose')



const supervisorQueueSchema = new mongoose.Schema({

    status: {

        type: String,

        required: true

    },

    patientName: {

        type: String,

        required: true

    },

    eventID: {

        type: String,

     required: true,
    

    },

    deviceID: {

        type: String,
      required: true,
      

    },

event: {

        type: String,

     required: true

    },

queueTime: {

        type: String,

     required: true

    },


technician: {

        type: String,

     required: true

    },
    
fileReview:{
   
    type: String,

    required: true 
}








},{timestamps:true})



module.exports = mongoose.model('SupervisorQueue', supervisorQueueSchema)