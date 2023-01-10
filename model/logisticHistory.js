const mongoose = require("mongoose");

const logisticHistorySchema = new mongoose.Schema({
  siNo: {
    type: String
  },
  kitId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  UHID: {
    type: String,
    required: true
  },
  Hospital: {
    type: String,
    required: true
  },
  Doctor: {
    type: String,
    required: true
  },
  Service: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  ShippedStatus: {
    type: String,
    required: true
  },
  ShippedLogistics: {
    type: String,
    required: true
  },
  ShippedAWB: {
    type: String,
    required: true
  },
  ReturnStatus: {
    type: String,
    required: true
  },
  accessoryInfo:[{
    service:{
        type:String
        

 },
 accessory:{
    type:String
   
 },
 vendor:{
    type:String
   
 },
 deviceSerialNo:{
    type:String
  
 },
 deviceModel:{
    type:String
  
 },
 purchaseDate:{
    type:String
  
 },
 expiryDate:{
    type:String
 },
 warranty:{
    type:String
 },
 additionalInfo:{
    type:Array
 },
 
 contact:{
    type:String
 },
 
 shippingAddress:{
    type:String
 },
 returningAWB:{
    type:String
 },
 returnDate:{
    type:String
 },
 shippingDate:{
    type:String
 },
}],
})

module.exports = mongoose.model('LogisticHistory',logisticHistorySchema)
