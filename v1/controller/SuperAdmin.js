//const Model = require("../../model/index");   
const User = require("../../models").User;
const Service = require("../../models").Service;
const Accessory = require("../../models").Accessory;
const AccessLog = require("../../models").AccessLog;
const Device = require("../../models").Device;
const Vendor = require("../../models").Vendor;
const GeneralDevice = require("../../models").GeneralDevice;
const Customer = require("../../models").Customer;
const Order = require("../../models").Order;
const AccessoryInfo = require("../../models").AccessoryInfo;
const OrderShipping = require("../../models").OrderShipping;
const Patient = require("../../models").Patient;
const KitAccessory = require("../../models").KitAccessory;
const UserAccount = require("../../models").UserAccount;
const Kit = require("../../models").Kit;
//const Customer = require("../../models").Customer;

const bcrypt = require("bcryptjs");
const Validation = require("../validations/SuperAdmin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//import fetch from "node-fetch"

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../../models").sequelize;
const { lookup } = require('geoip-lite');

module.exports.SuperAdminRegister = async (req, res) => {
  try {
    await Validation.SuperAdminRegister.validateAsync(req.body);
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    const result = await user.save();
    const { password, ...data } = await user.toJSON();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//login of technician
module.exports.SuperAdminLogin = async (req, res) => {
  try {
    await Validation.superAdminLogin.validateAsync(req.body);
    const user = await UserAccount.findOne({ where: { email: req.body.email } });

    console.log(user);

    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {

      return res.status(400).send({
        message: "invalid credentials",
      });
    }


    var ipAddress = (req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress || 
req.connection.socket.remoteAddress).split(",")[0];

var geo=lookup(ipAddress)
console.log("geo",geo,ipAddress)
var ipLocation;
if(geo){
ipLocation=geo.country+" "+geo.city 
}
    const accessLog=await AccessLog.create({
      name:user.name,
      userName:user.userName,
      userType:user.userType,
      activity:"Log in",
      ipAddress:ipAddress,
      ipLocation:ipLocation,
   logDateTime:new Date()

    })
    console.log("access log",accessLog)


    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // })
    res.send({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
    console.log(error);
  }
};
module.exports.logout = async (req, res) => {
  try {
    const user = await UserAccount.findOne({ where: { email: req.body.email } });

    console.log(user);

    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    }
   

    var ipAddress = (req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress || 
req.connection.socket.remoteAddress).split(",")[0];

var geo=lookup(ipAddress)
console.log("geo",geo,ipAddress)
var ipLocation;
if(geo){
ipLocation=geo.country+" "+geo.city 
}
    const accessLog=await AccessLog.create({
      name:user.name,
      userName:user.userName,
      userType:user.userType,
      activity:"Log out",
      ipAddress:ipAddress,
      ipLocation:ipLocation,
   logDateTime:new Date()

    })
    console.log("access log",accessLog)


  

    // })
    res.send({
      msg:"Successfully Logged Out"
    });
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
    console.log(error);
  }
};

module.exports.AddCustomer = async (req, res) => {
  try {
  
    const customer = await Customer.create({
      customerName: req.body.customerName,
      organizationName: req.body.organizationName,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      contactPerson: req.body.contactPerson,
      contactPerson2: req.body.contactPerson2,
      mobileNumber2: req.body.mobileNumber2,
      email2: req.body.email2,
      logo: req.body.logo,
      address: req.body.address,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip: req.body.zip,
      customerType: req.body.customerType,
      serviceType: req.body.serviceType,
      serviceMode: req.body.serviceMode,
      interpretationMode: req.body.interpretationMode,
      customOption: req.body.customOption,
      autoInterpretationTemplate: req.body.autoInterpretationTemplate,
      timeZone: req.body.timeZone,
      dateTimeFormat: req.body.dateTimeFormat,
      emailNotification: req.body.emailNotification,
      emailNotificationEmail: req.body.emailNotificationEmail,
      smsNotification: req.body.smsNotification,
      smsNotificationContact: req.body.smsNotificationContact,
      messengerNotification: req.body.messengerNotification,
      messengerType: req.body.messengerType,
      messengerNotificationContact: req.body.messengerNotificationContact,
      currencyType: req.body.currencyType,
      passwordRotationPolicy: req.body.passwordRotationPolicy,
      createdBy: req.body.createdBy,
      createdByPhoto: req.body.createdByPhoto
    });
    const result = await customer.save();
    console.log("results", result);
    //  const { password, ...data } = await user.toJSON();
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AddUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const customer = await UserAccount.create({
      userType: req.body.userType,
      customer:req.body.customer,
      name:req.body.name,
      contactPerson:req.body.contactPerson,
      email:req.body.email,
      location:req.body.location,
      role:req.body.role, 
      emailNotification:req.body.isEmailNotification,
      notificationEmail:req.body.emailNotificationEmail,
      smsNotification:req.body.isSMS_Notification,
      smsContactNumber:req.body.smsContactNo,
      userName:req.body.userName,
      messengerType:req.body.messengerType,
      messengerContactNumber:req.body.messengerContactNo,
      messengerNotification:req.body.isMessengerNotification,
      password:hashedPassword,
      createdBy: req.body.createdBy,
      createdByPhoto: req.body.createdByPhoto
    });
    const result = await customer.save();
    console.log("results", result);
    //  const { password, ...data } = await user.toJSON();
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.AllCustomer = async (req, res, next) => {
  try {
   
    const customer = await Customer.findAll({
     
    });
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AllAccessLog = async (req, res, next) => {
  try {
   
    const customer = await AccessLog.findAll({
     
    });
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//all user
module.exports.AllUser = async (req, res, next) => {
  try {
   
    const customer = await UserAccount.findAll({
     
    });
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.viewCustomerById = async (req, res, next) => {
  try {
   
    const customer = await Customer.findOne({
     where:{
      id:req.params.id
     }
    });
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.viewUserById = async (req, res, next) => {
  try {
   
    const customer = await UserAccount.findOne({
     where:{
      id:req.params.id
     }
    });
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.updatePassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);

    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const customer = await UserAccount.update(
      {password:hashedPassword,
        modifiedBy: req.body.modifiedBy,
        modifiedByPhoto: req.body.modifiedByPhoto
      },
      {
      
     where:{
      id:req.params.id
     }
     
    
    });
    console.log(customer)
  
    res.send(customer);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.editDisableEnableUser = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const service = await UserAccount.update(
      {
        disable: !req.body.disable,
        modifiedBy: req.body.modifiedBy

      },
      { where: { id: req.params.id } ,
      returning:true,
      raw:true
    }
    
    );
    //const result = await accessory.save();
    console.log("results", service);
    //  const { password, ...data } = await user.toJSON();
    res.send(service);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};