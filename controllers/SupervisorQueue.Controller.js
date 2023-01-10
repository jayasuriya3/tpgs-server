const SupervisorQueue= require('../model/supervisorQueue')


      /*
    Resource Description:Allow to post Supervisor Queue data with 
    status,patientName,eventID,deviceID,event,queueTime,technician,file review
    to database
    Resource URL: localhost:5000/supervisorQueue
    Method:POST 
    Parameters:
    Request Body Example:
    Header:token
    {
   "status":"red",
   "patientName":"Ramesh",
   "eventID":"43522",
   "deviceID":"43522",
   "event":"tachy",
   "queueTime":"5",
   "technician":"Ariene Winson"
    }

    Example Request :
    POST localhost:5000/supervisorQueue
    Example Response:
  {
    "acknowledgement":"true"
  }
  Status and ERROR Code:
  200 :Successfully added
  400:ERROR

    */
    //supervisor queue add
const postSupervisorQueue= async (req, res) => {
    try {
     
      const supervisorQueue = new SupervisorQueue({
        status: req.body.status,
        patientName: req.body.patientName,
        eventID: req.body.eventID,
        deviceID: req.body.deviceID,
        event: req.body.event,
        queueTime: req.body.queueTime,
        technician: req.body.technician,
        fileReview: req.body.fileReview
      })
      const result = await supervisorQueue.save()
      const data = await result.toJSON()
      res.send(data)
    }
    catch (error) {
      res.status(400).send(error);
    }
  }
  /*
    Resource Description:Allow to get Supervisor Queue data with 
    status,patientName,eventID,deviceID,event,queueTime,technician,file review
    to database
    Resource URL:GET localhost:5000/supervisorQueue
    Method:GET 
    Parameters:
    Request Body Example:
    Header:token
  
    Example Request :
    GET localhost:5000/supervisorQueue
    Example Response:
{
    "status": "red",
    "patientName": "Ramesh",
    "eventID": "43522",
    "deviceID": "43522",
    "event": "tachy",
    "queueTime": "5",
    "technician": "Ariene Winson",
    "fileReview": "MDN",
    "_id": "62ee8f9f048fef31e16500c2",
    "createdAt": "2022-08-06T15:58:23.328Z",
    "updatedAt": "2022-08-06T15:58:23.328Z",
    "__v": 0
}
  Status and ERROR Code:
  200 :Successfully added
  400:ERROR

    */

  const getSupervisorQueue= async (req, res) => {
    try {
      const result = await SupervisorQueue.find({});
      return res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

   //get files by Valid /unvalid /MDN
     /*
    Resource Description:Allow to get specific type of files like valid ,invalid ,mdn/all type   data from database as 
    parameter.
    Resource URL:GET localhost:5000/MDN
    Method:GET
    Parameters:MDN
    Request Body Example:
    Header:token
   
    Example Request :  localhost:5000/MDN
    Example Response:
 {
        "_id": "62e958bc11c6533ae051606f",
        "status": "neutral",
        "patientName": "Aman",
        "eventID": "4546",
        "deviceID": "5445",
        "event": "Aflb",
        "queueTime": "5 min",
        "technician": "Evan Flores",
        "fileReview": "MDN",
        "createdAt": "2022-08-02T17:02:52.140Z",
        "updatedAt": "2022-08-02T17:02:52.140Z",
        "__v": 0
    },
   
  Status and ERROR Code:
  200 :Successful
  400:ERROR

    */

  const getQueueByFileType=async (req, res) => {
    try {
      const fileReview = req.params.fileReview;
      const result = await SupervisorQueue.find({ fileReview: fileReview });
      return res.send(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  }

  module.exports = {
    postSupervisorQueue,
    getSupervisorQueue,
    getQueueByFileType
}  