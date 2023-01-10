const mongoose = require('mongoose')



const criteriaSchema=new mongoose.Schema({
    mctNoticeRhythm:{
        type: String,
       required: true
    },
    reportWeekly:{
        type: String,
       required: true
    },
    urgentNotification:{
        type: String,
       required: true
    },
    immediateNotification:{
        type: String,
       required: true
    },
    status:{
        type: String,
       required: true
    },
})

const patientSchema = new mongoose.Schema({
    patientID: {
        type: String,
        required: true,
        unique:true
    },
    eventType: {
        type: String,
        required: true
    },
    eventID: {
        type: String,
        required: true,
        unique:true
    },
    studyID:{
        type: String,
        required: true
    },
    studyType:{
        type: String,
        required: true
    },
    
    facility:{
        type: String,
        required: true
    },
    

    maxHR: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
       required: true
    },
    primaryContact: {
        type: String,
       required: true
    },
    secondaryContact: {
        type: String,
       required: true
    },
    address: {
        type: String,
       required: true
    },
    implantDevice:{
        type: String,
        required: true 
    },
    criteria:{
        type: Array,
        required: true
    },
    heartRateData:{
        type: Array,
        default:""
       
    },
    
    physicianComment:[{
        comment:{
            type:String,
            default:""

     }}],
    technicianComment:[{
        comment:{
            type:String,
            default:""

     }}],


    VE:{
        type: Array,
        
    },
    SVE:{
        type: Array,
        
    },
    event:{
        type: Array,
},
    heartRateVariablity:{
        type:Array
    },
    burdenPulseIndication:{
        type:Array
    },
    stMVCH1:{
        type:Array
    },
    stMVCH2:{
        type:Array
    },
    stMVCH3:{
        type:Array
    },
    others:{
        type:Array
    },
    serviceManagement:{
        type:Array  
    },
    studySetting:{
        type:Array  
    },
   
    diagnosisInformation:{
        type:Array  
    },
    studyLogs:{
        type:String,
        default:""  
    },
    studyNotes:{
        type:String,
        default:""  
    },
    physicianAmendmentNote:{
        type:String,
        default:""  
    },
    deviceNotificationHistory:{
        type:String,
        default:""  
    },
    
    studyHistory:{
        type:String,
        default:""  
    },
    
    interpretingPhysicianID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'InterpretingPhysician'
    },
    referingPhysicianID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ReferingPhysician'
    },
    sinus:[{
        arrhythmia:{
            type:String,
            required:true

     },
     valid:{
        type:Number,
        default:0
     },
     inValid:{
        type:Number,
        default:0
     }
}],
atrialRhythm:[{
    arrhythmia:{
   type:String
 

     },
     valid:{
     
        default:0
     },
     inValid:{
        type:Number,
        default:0
     }
}]
})
module.exports = mongoose.model('Patient', patientSchema)
