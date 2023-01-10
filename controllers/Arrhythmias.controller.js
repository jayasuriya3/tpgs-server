const Arrhythmias=require('../model/arrhythmias')


const getArrhythmias= async (req, res) => {
    try {
      const result = await Arrhythmias.find({});
      return res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

    //arhythmias post req
     /*
    Resource Description:Allow to post arrhythmias  data to database.it help to add list of arrhithmias 
    Resource URL:POST localhost:5000/arrhythmias
    Method:POST 
    Parameters:
    Request Body Example:
    Header:token
    {
   "name":"Sinus Rhythm",
   
    }

    Example Request :
    POST localhost:5000/arrhythmias
    Example Response:
  {
    "acknowledgement":"true"
  }
  Status and ERROR Code:
  200 :Successfully added
  400:ERROR

    */
  const postArrhythmias=async (req, res) => {
    try {
      const arrhythmias = new Arrhythmias({
        name: req.body.name
      })
      const result = await arrhythmias.save()
      const data = await result.toJSON()
      res.send(data)
    }
    catch (error) {
      res.status(400).send(error);
    }
  }

  
  module.exports = {
    getArrhythmias,
    postArrhythmias
}  
