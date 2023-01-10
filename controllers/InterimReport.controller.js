const InterimReport = require('../model/interimReport');

  //get Refering Physician info
       /*
    Resource Description:Allow to get all Referring Doctor informations
     to database .
    Resource URL:GET localhost:5000/referingPhysician
    Method:GET
    Parameters:
    Request Body Example:
    Header:token
    Example Response Body:
 {
    "name": "Dr. Satish",
    "dayPhone": "8489749925",
    "afterHourPhone": "9898775645",
    "hospital": "Apollo",
    "fax": "2846827",
    "email": "drsatish@gmail.com",
    "_id": "62ed16547a03a58c6b8d97ae",
    "createdAt": "2022-08-05T13:08:36.845Z",
    "updatedAt": "2022-08-05T13:08:36.845Z",
    "__v": 0
}
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */

  /*
    Resource Description:Allow to get interim report information from database .
    Resource URL:get localhost:5000/InterimReport
    Method:GET
    Parameters:
    Request Body Example:
    Header:token
   
   
    Example Response Body:
 {
    "status": "red",
    "patientName": "vonith kumar",
    "patientID": "43521",
    "physician": "Evan",
    "duration": "3",
    "reportType": "Normal",
    "studyType": "EXT_HOLTER",
    "_id": "62ed0afbf4072119a55127f9",
    "createdAt": "2022-08-05T12:20:11.251Z",
    "updatedAt": "2022-08-05T12:20:11.251Z",
    "__v": 0
}
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */

const getInterimReport= async (req, res) => {
    try {
      const result = await InterimReport.find({});
      return res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

   
/*
    Resource Description:Allow to post interim report information to database .
    Resource URL:POST localhost:5000/InterimReport
    Method:POST
    Parameters:
    Request Body Example:
{
    "status": "red",
    "patientName": "vonith kumar",
    "patientID": "43521",
    "physician": "Evan",
    "duration": "3",
    "reportType": "Normal",
    "studyType": "EXT_HOLTER",
   
}
    Header:token
   
   
    Example Response Body:
 {
  "acknowledgement":"true"
 }
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */
    //posting patient data
const postInterimReport= async (req, res) => {
    try {
      
      const interimreport = new InterimReport({
        status: req.body.status,
        dateOfService: req.body.dateOfService,
         patientName: req.body.patientName,
        patientID: req.body.patientID,
        physician: req.body.physician,
        duration: req.body.duration,
        reportType: req.body.reportType,
        dayReportType: req.body.dayReportType,
        studyType:req.body.studyType,
        sentReport:req.body.sentReport
      })
      const result = await interimreport.save()
      const data = await result.toJSON()
      res.send(data)
    }
    catch (error) {
      res.status(400).send(error);
    }
  }


  module.exports = {
    getInterimReport,
    postInterimReport
}  