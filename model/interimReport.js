const mongoose = require('mongoose')



const interimReportSchema = new mongoose.Schema({

    status: {

        type: String,

        required: true

    },
    dateOfService: {

        type: String,

        required: true

    },
    patientName: {

        type: String,

     required: true,
   

    },

    patientID: {

        type: String,

     required: true,
     unique:true

    },


    physician: {

        type: String,
      required: true,
   

    },

   duration: {

        type: String,

     required: true

    },



reportType: {

        type: String,

     required: true

    },
    
dayReportType: {

    type: String,

 required: true

},
    
studyType:{
   
    type: String,

    required: true 
},

    
sentReport:{
   
    type: String,

    required: true,
    default:"no" 
},

},{timestamps:true})



module.exports = mongoose.model('InterimReport', interimReportSchema)