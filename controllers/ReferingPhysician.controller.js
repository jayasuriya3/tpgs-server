const  ReferingPhysician= require('../model/referingPhysician');

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

const getReferingPhysician=async (req, res) => {
    try {
      const result = await ReferingPhysician.find({});
      return res.send(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  };

  /*
    Resource Description:Allow to post Referring Doctor information
     to database .
    Resource URL:POST localhost:5000/referingPhysician
    Method:POST
    Parameters:
    Request Body Example:
{
  "name":"Dr. Satish",
  "dayPhone":"8489749925",
  "afterHourPhone":"9898775645",
  "hospital":"Apollo",
  "fax":"2846827",
  "email":"drsatish@gmail.com"

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

const postReferingPhysician=  async (req, res) => {
    try {
      const referingphysician = new ReferingPhysician({
        name: req.body.name,
        dayPhone: req.body.dayPhone,
        afterHourPhone: req.body.afterHourPhone,
        hospital: req.body.hospital,
        address:req.body.address,
        fax: req.body.fax,
        email: req.body.email,
      })
      const result = await referingphysician.save()
      const data = await result.toJSON()
      res.send(data)
    }
    catch (error) {
      res.status(400).send(error);
    }
  };


  module.exports = {
    getReferingPhysician,
    postReferingPhysician
}  