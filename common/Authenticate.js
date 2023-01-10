const jwt = require("jsonwebtoken");
const Model=require('../models/index')
//JWT verify middleware
module.exports.verifyJWT=(req, res, next)=> {
    const authHeader = req.headers.authorization;
   // console.log(authHeader);
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader;
    //console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
   //   console.log(err)
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
  
      req.decoded = decoded;
      next();
    //  console.log(decoded)
    });
  }
  //verify user is technician or not
  module.exports.verifyTechnician = async (req, res, next) => {
    const requesterMail = req.decoded.email;
    const requesterRole = req.decoded.role;
    const requesterAccount = await Model.User.findOne({ email: requesterMail },{role:requesterRole});
    if (requesterAccount.role === 'technician') {
      next();
    }
    else {
      res.status(403).send({ message: 'forbidden' });
    }
  }
  //verify user is supervisor 
  module.exports.verifySupervisor = async (req, res, next) => {
    const requesterMail = req.decoded.email;
    const requesterRole = req.decoded.role;
    const requesterAccount = await Model.User.findOne({ email: requesterMail },{role:requesterRole});
    if (requesterAccount.role === 'supervisor') {
      next();
    }
    else {
      res.status(403).send({ message: 'forbidden' });
    }
  }
  module.exports.verifyDeviceLogistics = async (req, res, next) => {
    const requesterMail = req.decoded.email;
    const requesterRole = req.decoded.role;
    const requesterAccount = await Model.User.findOne({ email: requesterMail },{role:requesterRole});
    if (requesterAccount.role === 'deviceLogistics') {
      next();
    }
    else {
      res.status(403).send({ message: 'forbidden' });
    }
  }
  module.exports.verifyAssetMaster = async (req, res, next) => {
    const requesterMail = req.decoded.email;
    const requesterRole = req.decoded.role;
    const requesterAccount = await Model.User.findOne({ email: requesterMail },{role:requesterRole});
    if (requesterAccount.role === 'assetMaster') {
      next();
    }
    else {
      res.status(403).send({ message: 'forbidden' });
    }
  }