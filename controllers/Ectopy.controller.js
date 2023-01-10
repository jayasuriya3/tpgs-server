const Ectopy=require('../model/ectopy')

      /*
    Resource Description:Allow to get ectopy  data to database.it help to select appropriate list ectopy from the ectopy list 
    Resource URL:GET localhost:5000/ectopy
    Method:GET
    Parameters:
    Request Body Example:
    Header:token
   
    Example Request :  localhost:5000/ectopy
    Example Response:
 {
  "_id":"1547fd54d5fdd454f54d5"
   "name":"Multifocal PVCs",
}
  Status and ERROR Code:
  200 :Successfully added
  400:ERROR

    */
const getEctopy= async (req, res) => {
    try {
      const result = await Ectopy.find({});
      return res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

    //Ectopy post req
     /*
    Resource Description:Allow to post arrhythmias  data to database.it help to add list of arrhithmias 
    Resource URL:POST localhost:5000/ectopy
    Method:POST 
    Parameters:
    Request Body Example:
    Header:token
    {
   "name":"Multifocal PVCs",
   
    }

    Example Request :
    POST localhost:5000/ectopy
    Example Response:
  {
    "acknowledgement":"true"
  }
  Status and ERROR Code:
  200 :Successfully added
  400:ERROR

    */
  const postEctopy=async (req, res) => {
    try {
      const ectopy = new Ectopy({
        name: req.body.name
      })
      const result = await ectopy.save()
      const data = await result.toJSON()
      res.send(data)
    }
    catch (error) {
      res.status(400).send(error);
    }
  }

  
  module.exports = {
    getEctopy,
    postEctopy
}  
