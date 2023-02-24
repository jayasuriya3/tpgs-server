//const Model = require("../../model/index");
const User = require("../../models").User;
const UserAccount = require("../../models").UserAccount;
const Service = require("../../models").Service;
const Accessory = require("../../models").Accessory;
const Device = require("../../models").Device;
const Vendor = require("../../models").Vendor;
const GeneralDevice = require("../../models").GeneralDevice;
const Customer = require("../../models").Customer;
const Order = require("../../models").Order;
const AccessoryInfo = require("../../models").AccessoryInfo;
const OrderShipping = require("../../models").OrderShipping;
const Patient = require("../../models").Patient;
const Logistic = require("../../models").Logistic;
const KitAccessoryInfo = require("../../models").KitAccessoryInfo;
const Kit = require("../../models").Kit;
const moment =require('moment');

const bcrypt = require("bcryptjs");
const Validation = require("../validations/DeviceLogistics");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../../models").sequelize;

module.exports.DeviceLogisticRegister = async (req, res) => {
  try {
    await Validation.DeviceLogisticRegister.validateAsync(req.body);
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
module.exports.DeviceLogisticLogin = async (req, res) => {
  try {
    await Validation.DeviceLogisticLogin.validateAsync(req.body);
    const user = await User.findOne({ where: { email: req.body.email } });
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

module.exports.addPatient = async (req, res) => {
  try {
    const logisticHistory =await Patient.create({
      patientName: req.body.patientName,
      PatientID: req.body.PatientID,
      hospitalName: req.body.hospitalName,
      doctorName: req.body.doctorName,
      device:req.body.device,
      serviceType: req.body.serviceType,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      contactNumber: req.body.contactNumber,
      duration: req.body.contactNumber,
      address: req.body.address,

    });
    
   
    res.send(logisticHistory);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
// module.exports.addPatient= async (req, res) => {
//   try {
//     const patient = Patient.bulkCreate([
//      { patientName:"Aman",
 
//      PatientID:"5554",
//      hospitalName:"Apollo",
//      doctorName: "Alan",
//      serviceType: "Madic",
//      location: "India",
//      startDate: "",
//      endDate: "",
//      contactNumber: req.body.contactNumber,
//      duration: req.body.contactNumber,
//      address: req.body.address,
//     }
//     ]);
//     const result = await logisticHistory.save();
//     const data = await result.toJSON();
//     res.send(data);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// };

//get all logistic history

module.exports.getLogisticHistory = async (req, res) => {
  try {
    const result = await Model.LogisticHistory.find({});
    return res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.getLogisticHistoryDetail = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log(_id);
    const result = await Model.LogisticHistory.find({ _id: _id });
    console.log(result);
    return res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.AllPatient = async (req, res) => {
  try {
    const patient = await Patient.findAll();

    res.send(patient);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//all kit list
module.exports.AllKit = async (req, res) => {
  try {
    const kit = await Kit.findAll({
      order: [['createdAt', 'DESC']],



    });
    console.log("kit",kit)

    res.send(kit);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.allUnassignedKit = async (req, res) => {
  try {
    const kit = await Kit.findAll({
      where:{
        assignStatus:"UnAssigned",
      },
      include:[
    {
      model:Device,
      include:[{
        model:Service,
        attributes:['service']
      },
      {
    model:Accessory,
    attributes:['accessory','accessoryType']

      },
      {
        model:Vendor,
        attributes:['vendorName']

          },

  ]
    }
    ]      

    });
    console.log("kit",kit)

    res.send(kit);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//updateDeleteAccessoryKit
module.exports.updateDeleteAccessoryKit = async (req, res) => {
  try {


    // const {id}=req.body;
    console.log(req.params.kitId)
    //finding all device of the specific kitId
    const kit = await KitAccessoryInfo.findAll({
      where:{kitId:req.params.kitId}});
    // console.log("filter",req.body.filter(req=> kit.includes(req)))
//    //then finding on these kit how many devices are there 

    console.log("kit for delete",kit)
    //    //then finding on these kit how many devices are there 

    const deviceId=kit.map(device=>device.deviceId);
    const id=kit.map(device=>device.id);
    //then mapping the specific device id
    const updatedDeviceId=req.body.map(device=>device.deviceId)

    const Id=kit.map(device=>device.KitAccessoryId);
    const ids=kit.map(device=>device.id);
    const updatedId=req.body.map(device=>device.KitAccessoryId)

    console.log("kitaccessory data which previously exist",Id)
    console.log("kitaccessory data which updated data",updatedId)
    //for finding id of kit accessory
const elementsToDeleteKitAccessoryId = Id.filter(element => !updatedId.includes(element));
const elementsToDeleteDeviceId = deviceId.filter(element => !updatedDeviceId.includes(element));
console.log("need to delete element",elementsToDeleteDeviceId)
// const OldDeviceId=elementsToDelete.map(device=>device.deviceId);

// const KitAccessoryId=elementsToDelete.map(device=>device.KitAccessoryId);

    

//then firstly updating it to device
await Device.update({kitId:null,
deviceStatus:null
},{where:{deviceId:elementsToDeleteDeviceId}})

const updatedKitAccessory=await KitAccessoryInfo.update({kitId:null,
  deviceStatus:null
  },{where:{KitAccessoryId:elementsToDeleteKitAccessoryId}})

 await Kit.update({quantity:req.body.length,
lastModifiedBy:req.params.editedBy
},
  {
  where:{
    id:req.params.kitId
  }
}
  )
  const updates= await Device.update({kitId:req.params.kitId,
  deviceStatus:"Assigned"
  },{where:{deviceId:updatedDeviceId}})
  console.log("deviceUpdate",updates)
  // const updatesKitAccessory= await KitAccessoryInfo.update({kitId:req.params.kitId,
  // deviceStatus:"Assigned"
  // },{where:{KitAccessoryId:updatedId}})

  const updatesKitAccessory=await KitAccessoryInfo.bulkCreate(
    req.body ,
        {
         updateOnDuplicate:["kitId","editedBy"],
        })
      
       
  
  console.log("updatesKitAccessory",updatesKitAccessory)

  //const updates=await Device.bulkCreate(req.body,{updateOnDuplicate:['id']})

    res.send(updates);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.getKitAccessoryMobileDevice = async (req, res) => {
  try {
    const device = await KitAccessoryInfo.findOne({ where: {KitAccessoryId: req.params.KitAccessoryId } });
    // const vendor =await  Vendor.findAll();

    res.send(device);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.allDeviceKitSearch = async (req, res, next) => {
  try {
   
    const device = await Device.findAll({
      where: {
        serviceId: req.params.serviceId,
        accessoryId: req.params.accessoryId,
        deviceStatus:{[Op.or]:[null,"Working"]},
        kitId:{
          [Op.is]:null
        }

       
      },
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(device);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AddKit = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const kit = await Kit.create({
      id: req.body.id,
      quantity: req.body.quantity,
      service: req.body.service,
      serviceId: req.body.serviceId,
      accessory: req.body.accessory,
      service: req.body.service,
      accessoryId: req.body.accessoryId,
    });
    //const result = await accessory.save();
    console.log("results", kit);
    //  const { password, ...data } = await user.toJSON();
    res.send(kit);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//add accessory kit
module.exports.AddAccessoryKit = async (req, res, next) => {
  try {
    const kit = await Kit.create({
      id: req.body.id,
      quantity: req.body.quantity,
      service: req.body.service,
      serviceId: req.body.serviceId,
      accessory: req.body.accessory,
      service: req.body.service,
      accessoryId: req.body.accessoryId,
    });     

 console.log("add accessory", req.body);
    //res.send(req.body)
    const {searchDevice}=req.body
    const deviceId=req.body.searchDevice.map(device=>device.id);
    const deviceUpdate=await Device.update({
      kitId:req.params.kitId,
      deviceStatus:"Assigned"
      
    },
      {
      where: {
        id:deviceId
        
      }
    }
    
  )
    const createKit=await KitAccessoryInfo.bulkCreate(req.body.searchDevice);
    
  
 console.log("deviceUpdate,deviceId,createKit",deviceId,deviceUpdate,createKit)

    res.send({kit,deviceUpdate});
  } catch (error) {
    return next({ status: 404, message: error });
  }
};
module.exports.kitDashboard = async (req, res) => {
  
  try {
  console.time("kitDashboard")
    //counting assigned kit which is delivered
    const kitDelivered=  Kit.count({
  where: {

    assignStatus: "Assigned",
    assignedDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }  
   
    }      
  

})
   //unassigned kits in Stock
const kitStock= Kit.count({
where:{
  assignStatus:"UnAssigned",
  createdAt: {
    [Op.gte]: new Date(req.params.startDate),
    [Op.lt]: new Date(req.params.endDate)
  }  

}
})
//get complained device for dashboard based on per month
const ComplainDevice= Device.count({
where:{

    deviceStatus:{[Op.or]:['Damaged','Defective','Missing']},
    kitId:{
      [Op.not]:null
    },
    deviceStatusUpdateDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }  

}
})

//res.status(200).json({kitDelivered:kitDelivered,kitStock:kitStock,ComplainDevice:ComplainDevice})

const assignedKit= Kit.count({
  where: {

    assignStatus: "Assigned",
    assignedDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }  
   
    }      
  

})
   //unassigned kits in Stock
const unassignedKit= Kit.count({
where:{
  assignStatus:"UnAssigned",
  createdAt: {
    [Op.gte]: new Date(req.params.startDate),
    [Op.lt]: new Date(req.params.endDate)
  }  

}
})
//get complained device for dashboard based on per month

//res.status(200).json({assignedKit:assignedKit,unassignedKit:unassignedKit})

    //counting assigned kit which is delivered
    const ComplainedDevice= Device.findAll({
      where:{
      
          deviceStatus:{[Op.or]:['Damaged','Defective','Missing']},
          kitId:{
            [Op.not]:null
          },
          deviceStatusUpdateDate: {
            [Op.gte]: new Date(req.params.startDate),
            [Op.lt]: new Date(req.params.endDate)
          } 
         
      
      },
       include:[{
            model:Kit,
            include:[{
              model:Logistic,
              
            },
          {
            model:Patient,
            attributes:['patientName','hospitalName','doctorName']
          }
          ]
          }]

      })
   //unassigned kits in Stock

//get complained device for dashboard based on per month

const kitSummary= Kit.findAll({
  where: {

    assignStatus: "Assigned",
    assignedDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    },
   
   
    }     ,
    include:[{
      model:Patient,
      attributes:['patientName','doctorName','hospitalName']
    }]   
  

})

const logisticAnalysis= Logistic.findAll({

  group: ["logisticName"],
  attributes: [
    "logisticName",

    [sequelize.fn("COUNT", sequelize.col("logisticName")), "count"],
  ],
  order: [[Sequelize.literal("count"), "DESC"]],
  where: { 
    
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }
  }, 
  includeIgnoreAttributes: false,

  raw: true,
})

const logisticSummary =  Kit.findAll({
    
  include:[{
    model:Patient,
   
  },
{
  model:Logistic,
  where:{
    shippingStatus:{
      [Op.or]:["Shipped","In Transit","Delivered"]
    },
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }
  
  }

}

]
});

  // .then((result) => {
  //   console.log("result", result);
  //  //res.send(result)
  // })
  const [PromisekitDelivered, promisekitStock,promiseComplainDevice,promiseassignedKit,promiseunassingedKit,promiseComplainedDevice,promisekitSummary,promiselogisticAnalysis,PromiselogisticSummary
    
    ] = await Promise.all([kitDelivered, kitStock,ComplainDevice,
      assignedKit,unassignedKit,ComplainedDevice,kitSummary,logisticAnalysis,logisticSummary
      
      ]);
      console.timeEnd('blocking');
      
      res.status(200).json({kitDelivered:PromisekitDelivered,kitStock:promisekitStock,ComplainDevice:promiseComplainDevice,assignedKit:promiseassignedKit,unassignedKit:promiseunassingedKit,ComplainedDevice:promiseComplainedDevice,kitSummary:promisekitSummary,logisticAnalysis:promiselogisticAnalysis,
        logisticSummary:PromiselogisticSummary
      })
      
//res.status(200).json(kitSummary)
console.timeEnd("kitDashboard")

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.kitAnalysis = async (req, res) => {
  try {
    //counting assigned kit which is delivered
    const assignedKit=await Kit.count({
  where: {

    assignStatus: "Assigned",
    assignedDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }  
   
    }      
  

})
   //unassigned kits in Stock
const unassignedKit=await Kit.count({
where:{
  assignStatus:"UnAssigned",
  createdAt: {
    [Op.gte]: new Date(req.params.startDate),
    [Op.lt]: new Date(req.params.endDate)
  }  

}
})
//get complained device for dashboard based on per month

res.status(200).json({assignedKit:assignedKit,unassignedKit:unassignedKit})
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.complainSummary = async (req, res) => {
  try {
    //counting assigned kit which is delivered
    const ComplainDevice=await Device.findAll({
      where:{
      
          deviceStatus:{[Op.or]:['Damaged','Defective','Missing']},
          kitId:{
            [Op.not]:null
          },
          deviceStatusUpdateDate: {
            [Op.gte]: new Date(req.params.startDate),
            [Op.lt]: new Date(req.params.endDate)
          } 
         
      
      },
       include:[{
            model:Kit,
            include:[{
              model:Logistic,
              
            }]
          }]

      })
   //unassigned kits in Stock

//get complained device for dashboard based on per month

res.status(200).json(ComplainDevice)
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//get kit summary of assigned kit by month
module.exports.kitSummary = async (req, res) => {
  try {
    //counting assigned kit which is delivered
    const kitSummary=await Kit.findAll({
  where: {

    assignStatus: "Assigned",
    assignedDate: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }  
   
    }      
  

})
 
res.status(200).json(kitSummary)
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//logisticAnalysis
module.exports.logisticAnalysis = async (req, res,next) => {
  try {
    // const vendor =await  Vendor.findAll();
  return Logistic.findAll({

      group: ["logisticName"],
      attributes: [
        "logisticName",

        [sequelize.fn("COUNT", sequelize.col("logisticName")), "count"],
      ],
      order: [[Sequelize.literal("count"), "DESC"]],
      where: { 
        
        createdAt: {
          [Op.gte]: new Date(req.params.startDate),
          [Op.lt]: new Date(req.params.endDate)
        }
      }, 
      includeIgnoreAttributes: false,

      raw: true,
    })
      .then((result) => {
        console.log("result", result);
       res.send(result)
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.kitDetails = async (req, res) => {
  try {
    const order =  Device.findAll({
      include:[{
        model:Kit
      }]
    }).then((result) => {
      console.log("result runed from post", result);
      res.send(result);
    })
    .catch((error) => {
      return next({ status: 404, message: error });
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.viewKitAccessoryDetail = async (req, res, next) => {
  try {
   
    const kitAccessory = await KitAccessoryInfo.findAll({
      where: {
       // serviceId: req.body.serviceId,
       // accessoryId: req.body.accessoryId,
        kitId: req.params.kitId
      },
      include:[{
        model: Service,
        attribute:['service']
       // required: true // this will inner join the Service model
      }, {
        model: Accessory,
        attribute:['accessory']
      //  required: true // this will inner join the Accessory model
      }, {
        model: Vendor,
        attribute:['vendorName']
       // required: true // this will inner join the Vendor model
      },
   
    ]
    });
   
    res.send(kitAccessory);

  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.viewKitAccessoryDetailCompleted = async (req, res, next) => {
  try {
   
    const kitAccessory = await Device.findAll({
      where: {
       // serviceId: req.body.serviceId,
       // accessoryId: req.body.accessoryId,
        kitId: req.params.kitId
      },
      include:[{
        model: Service,
       // required: true // this will inner join the Service model
      }, {
        model: Accessory,
      //  required: true // this will inner join the Accessory model
      }, {
        model: Vendor,
       // required: true // this will inner join the Vendor model
      },
    {
      model:Kit,
      attributes:['patientName']
    }
    ]
    });
   
    res.send(kitAccessory);

  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//get logistic min max year
module.exports.getLogisticMinMaxYear = async (req, res, next) => {
  try {
    const minYear = await Kit.min('createdAt');
    const maxYear = await Kit.max('updatedAt');
    console.log("minYear,maxYear",minYear,maxYear)
    res.json({minYear:minYear,maxYear:maxYear});

  }

   catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.viewKitAccessoryDetailById = async (req, res, next) => {
  try {
    console.log("api hitted",req.params.kitId)
   
    const kitAccessory = await Device.findAll({
      where: {
       
        kitId: req.params.kitId
      },
      include:[{
        model: Service,
       // required:false,
       // required: true 
        // this will inner join the Service model
      }, {
        model: Accessory,
       // required:false,

       // required: true 
        // this will inner join the Accessory model
      }, {
        model: Vendor,
       // required:false
       // required: true // this will inner join the Vendor model
      }] 
    });
    const kit = await Kit.findOne({
      where: {
       
        id: req.params.kitId
      },
    });
    console.log("kit",kitAccessory,kit)
   
    res.send({kitAccessory:kitAccessory,kit:kit});
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//assign unassigned kit
module.exports.AssignedUnassignedPatient = async (req, res, next) => {
  try {
    const firstDay = moment().startOf('month').format('YYYY-M-DD');
const lastDay = moment().endOf('month').format('YYYY-M-DD');
   if(req.params.assignStatus==="Assigned"){

    const patient = await Patient.findAll({
      where: {

        assignStatus: req.params.assignStatus,
        // updatedAt: {
        //   [Op.gte]: new Date(firstDay),
        //   [Op.lt]: new Date(lastDay)
        // } ,

      },
      include:[{
        model:Kit,
        include:[{
          model:Device,
          include:[{
            model: Service,
            attribute:['service']
           // required: true // this will inner join the Service model
          }, {
            model: Accessory,
            attribute:['accessory']
          //  required: true // this will inner join the Accessory model
          }, {
            model: Vendor,
            attribute:['vendorName']
           // required: true // this will inner join the Vendor model
          },
       
        ]
        }]
      }],
      order: [['updatedAt', 'DESC']],



    });
  
    res.send(patient);
  }
   else if(req.params.assignStatus==="UnAssigned"){
    const patient = await Patient.findAll({
      where: {

        assignStatus: req.params.assignStatus
      },
    });
  
    res.send(patient);
  }
   
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getAssignedPatient = async (req, res, next) => {
  try {
if(req.params.startDate===req.params.endDate){
  console.log("req.params.startDate,endDate",req.params.startDate,req.params.endDate)
  const patient = await Patient.findAll({
    where: {
      where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),
  
      // updatedAt: {
      //  //[Op.eq]: 

      //   //[Op.gte]: req.params.startDate,
      //   //  [Op.lte]: new Date(req.params.endDate)
      // } ,
      assignStatus:{
        [Op.or]:["Assigned","Reassigned"]  

      }

    },
    include:[{
      model:Kit,
      include:[{
        model:Device,
        include:[{
          model: Service,
          attribute:['service']
         // required: true // this will inner join the Service model
        }, {
          model: Accessory,
          attribute:['accessory']
        //  required: true // this will inner join the Accessory model
        }, {
          model: Vendor,
          attribute:['vendorName']
         // required: true // this will inner join the Vendor model
        },
     
      ]
      }]
    }],
    order: [['updatedAt', 'DESC']],



  });

return  res.send(patient);
}
else{
  const startDate = new Date(req.params.startDate);
const endDate = new Date(req.params.endDate);

// Set the start time of the start date to 00:00:00 and the end time of the end date to 23:59:59
startDate.setHours(0, 0, 0, 0);
endDate.setHours(23, 59, 59, 999);

  
    const patient = await Patient.findAll({
      where: {
        updatedAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        } ,
        assignStatus:{
          [Op.or]:["Assigned","Reassigned"]  
  
        }

      },
      include:[{
        model:Kit,
        include:[{
          model:Device,
          include:[{
            model: Service,
            attribute:['service']
           // required: true // this will inner join the Service model
          }, {
            model: Accessory,
            attribute:['accessory']
          //  required: true // this will inner join the Accessory model
          }, {
            model: Vendor,
            attribute:['vendorName']
           // required: true // this will inner join the Vendor model
          },
       
        ]
        }]
      }],
      order: [['updatedAt', 'DESC']],



    });
  
    res.send(patient);
  }
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//assign unassigned kit
module.exports.incompleteDeviceRefurnish = async (req, res, next) => {
  try {
   
    const patient = await Kit.findAll({
      where: {

        kitReceived: req.params.kitReceived,
        deviceReceiveStatusCheck:{
          [Op.is]:false
        }
      },
     // include:{all:true}
      include:[{
        model:Patient
      }, 
    {
      model:Logistic

    },
    {
      model:KitAccessoryInfo,
      include:[{
        model:Service,
        attributes:["service"]
      },
    {
      model:Accessory,
      attributes:["accessory"]
    },
    {
      model:Vendor,
      attributes:["vendorName"]
    }
    ]
    }
    ]
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(patient);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.logisticHistories = async (req, res, next) => {
 // const firstDay = moment().startOf('month').format('YYYY-M-DD');
//const lastDay = moment().endOf('month').format('YYYY-M-DD');
const firstDay = moment().format('YYYY-M-DD');
console.log("firstday",firstDay,new Date())
const lastDay = moment().subtract(30, 'days').format('YYYY-M-DD');

  try {
    if(req.params.startDate===req.params.endDate){
      console.log("req.params.startDate,endDate",req.params.startDate,req.params.endDate)
      // const patient = await Patient.findAll({
      //   where: {
      //     where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),
      
   

    const patient = await Kit.findAll({
    
      include:[{
        model:Patient,
       
      },
    {
      model:Logistic,
      where:{
        shippingStatus:{
          [Op.or]:["Shipped","In Transit","Delivered","Received By Patient"]  
          
        },
       
      },


    },
    {
      model:Device,
      include:[{
        model:Service,
        attributes:['service']
      },
      {
    model:Accessory,
    attributes:['accessory']

      },
      {
        model:Vendor,
        attributes:['vendorName']

          },

  ]
    }
    
    ],
    where:{
    //  status:"Completed",
      where: sequelize.where(sequelize.fn('DATE', sequelize.col('Kit.updatedAt')), req.params.startDate),

    //   updatedAt: {
    //    [Op.gte]: new Date(req.params.startDate),
    //    [Op.lte]: new Date(req.params.endDate)
    //  } ,
   }
    // where:{
    // updatedAt: {
    //   [Op.gte]: firstDay,   
    //   [Op.lt]:lastDay
    // } },
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
 return   res.send(patient);
  }
  else{
   
      console.log("req.params.startDate,endDate",req.params.startDate,req.params.endDate)
      // const patient = await Patient.findAll({
      //   where: {
      //     where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),
      
   

    const patient = await Kit.findAll({
    
      include:[{
        model:Patient,
       
      },
    {
      model:Logistic,
      where:{
        shippingStatus:{
          [Op.or]:["Shipped","In Transit","Delivered","Received By Patient"]  
          
        },
       
      },


    },
    {
      model:Device,
      include:[{
        model:Service,
        attributes:['service']
      },
      {
    model:Accessory,
    attributes:['accessory']

      },
      {
        model:Vendor,
        attributes:['vendorName']

          },

  ]
    }
    
    ],
    where:{
    //  status:"Completed",
     // where: sequelize.where(sequelize.fn('DATE', sequelize.col('Kit.updatedAt')), req.params.startDate),

      updatedAt: {
       [Op.gte]: new Date(req.params.startDate),
       [Op.lte]: new Date(req.params.endDate)
     } ,
   }
    // where:{
    // updatedAt: {
    //   [Op.gte]: firstDay,   
    //   [Op.lt]:lastDay
    // } },
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(patient);
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.logisticSummary = async (req, res, next) => {
  try {
   
    const patient = await Kit.findAll({
    
      include:[{
        model:Patient,
       
      },
    {
      model:Logistic,
      where:{
        shippingStatus:{
          [Op.or]:["Shipped","In Transit","Delivered"]
        },
        createdAt: {
          [Op.gte]: new Date(req.params.startDate),
          [Op.lt]: new Date(req.params.endDate)
        }
      
      }

    }
    
    ]
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(patient);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//Quality check of completed from incompleted tab received device 
module.exports.qualityCheckDevice = async (req, res, next) => {
  try {
   
    const kitAccessory = await KitAccessoryInfo.findAll({
      where: {
       statusCheck:{
        [Op.is]:null
       },
        receiveStatus: req.params.receiveStatus,

        // deviceStatus:{
        //   [Op.is]:null
        // },
        kitId:{
          [Op.not]:null

        }
        
      },
      include:[{
        model: Service,
        attributes:["service"]
       // required: true // this will inner join the Service model
      }, {
        model: Accessory,
        attributes:["accessory"]

      //  required: true // this will inner join the Accessory model
      }, {
        model: Vendor,
       attributes:["vendorName"]

       // required: true // this will inner join the Vendor model
      }] ,
      attributes: [[   sequelize.fn("COALESCE", sequelize.col("KitAccessoryInfo.accessory"), sequelize.col("Accessory.accessory")),
      "accessory"
    ],
    [   sequelize.fn("COALESCE", sequelize.col("Service.service")),
      "service"
    ],
    [   sequelize.fn("COALESCE", sequelize.col("KitAccessoryInfo.vendor"), sequelize.col("Vendor.vendorName")),
    "vendor"
  ],"KitAccessoryId","deviceId","deviceModel","warrantyTime","warranty","purchaseDate","expiryDate","comment","kitId","updatedAt","editedBy"
  ]

     
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(kitAccessory);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.completedDevice = async (req, res, next) => {
  try {
    if(req.params.startDate===req.params.endDate){
      console.log("req.params.startDate,endDate",req.params.startDate,req.params.endDate)
      // const patient = await Patient.findAll({
      //   where: {
      //     where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),
      
    const devices = await Kit.findAll({
      
        where:{
         status:{

        [Op.or]: ["Completed","In QC"]},


        //  updatedAt: {
        //   [Op.gte]: new Date(req.params.startDate),
        //   [Op.lt]: new Date(req.params.endDate)
        // } ,
      }
    ,
      include:[{
        model:KitAccessoryInfo,
        include:[{
          model: Service,
          attributes:["service"]
         // required: true // this will inner join the Service model
        }, {
          model: Accessory,
          attributes:["accessory"]
  
        //  required: true // this will inner join the Accessory model
        }, {
          model: Vendor,
         attributes:["vendorName"]
  
         // required: true // this will inner join the Vendor model
        }] ,
      where: {

       receiveStatus:"Received",
       
        deviceStatus:{
          [Op.not]:null
        },
        kitId:{
          [Op.not]:null
        }
        
      },
    },
    {
    model:Logistic,
    where:{
      returnDate:req.params.startDate
    }

    },
    {
    model:Patient
    }
  ]
     
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
  return  res.send(devices);
  }
  else{
    // if(req.params.startDate===req.params.endDate){
      console.log("req.params.startDate,endDate",req.params.startDate,req.params.endDate)

      // const patient = await Patient.findAll({
      //   where: {
      //     where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),
      
    const devices = await Kit.findAll({
      
        where:{
          status:{

            [Op.or]: ["Completed","In QC"]},
        // where: sequelize.where(sequelize.fn('DATE', sequelize.col('Patient.updatedAt')), req.params.startDate),

        
      }
    ,
      include:[{
        model:KitAccessoryInfo,
        include:[{
          model: Service,
          attributes:["service"]
         // required: true // this will inner join the Service model
        }, {
          model: Accessory,
          attributes:["accessory"]
  
        //  required: true // this will inner join the Accessory model
        }, {
          model: Vendor,
         attributes:["vendorName"]
  
         // required: true // this will inner join the Vendor model
        }] ,
      where: {

       receiveStatus:"Received",
       
        deviceStatus:{
          [Op.not]:null
        },
        kitId:{
          [Op.not]:null
        }
        
      },
    },
    {
    model:Logistic,
    returnDate: {
      [Op.gte]: req.params.startDate,
      [Op.lte]:req.params.endDate
    } ,
    },
    {
    model:Patient
    }
  ]
     
    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
  return  res.send(devices);
  // }
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AssignedDispatchKit = async (req, res, next) => {
  try {
   
    const kit = await Kit.findAll({
      where: {

         assignStatus:{
          [Op.or]:["Assigned","Reassigned"]  

          
         },
         shippingStatus:{[Op.or]:["Ready to Ship",null]}

       
        }  ,
        include:[{
          model:Patient
        },
      {
        model:Logistic
      }
      ]    
      

    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(kit);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AssignedKit = async (req, res, next) => {
  try {
   
    const kit = await Kit.findAll({
      where: {

         assignStatus: req.params.assignStatus,

       //   shippingStatus:{[Op.not]:['Shipped']}
        }      
      

    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(kit);
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AssignedKitList = async (req, res, next) => {
  try {
    if(req.params.startDate===req.params.endDate){
    const kit = await Kit.findAll({
      where: {
        where: sequelize.where(sequelize.fn('DATE', sequelize.col('Kit.assignedDate')), req.params.startDate),
         assignStatus: req.params.assignStatus,


       //   shippingStatus:{[Op.not]:['Shipped']}
        },
        include:[{
          model:Patient
        },
    //   {
    //     model:KitAccessoryInfo,
    //     include:[{
    //       model:Service,
    //       attributes:['service']
    //     },
    //     {
    //   model:Accessory,
    //   attributes:['accessory']

    //     },
    //     {
    //       model:Vendor,
    //       attributes:['vendorName']

    //         },

    // ]
    //   }
      ]      
      

    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(kit);
  }
  else{
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    
    // Set the start time of the start date to 00:00:00 and the end time of the end date to 23:59:59
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const kit = await Kit.findAll({
      where: {
        // updatedAt: {
        //   [Op.between]: [
        //     sequelize.fn('DATE', req.params.startDate),
        //     sequelize.fn('DATE', req.params.endDate)
        //   ]
        // },
        assignedDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        } ,
         assignStatus: req.params.assignStatus,


       //   shippingStatus:{[Op.not]:['Shipped']}
        },
        include:[{
          model:Patient
        },
    //   {
    //     model:KitAccessoryInfo,
    //     include:[{
    //       model:Service,
    //       attributes:['service']
    //     },
    //     {
    //   model:Accessory,
    //   attributes:['accessory']

    //     },
    //     {
    //       model:Vendor,
    //       attributes:['vendorName']

    //         },

    // ]
    //   }
      ]      
      

    });
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    res.send(kit);
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//viewKitAccessoriesDetail by kit id
module.exports.viewKitAccessoriesDetail = async (req, res, next) => {
  try {
   
    const kit = await Device.findAll({
      where: {

        kitId: req.params.id
      },
    });
  
    res.send(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};



module.exports.viewKitAccessoriesDeviceDetail = async (req, res, next) => {
  try {
   
    const kit = await Device.findOne({
      where: {

        deviceId: req.params.deviceId
      },
      include:[{
        model:Kit,
        attribute:['patientName']
      }]
    });
  
    res.send(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getKitById = async (req, res, next) => {
  try {
   
    const kit = await Kit.findOne({
      where: {

        id: req.params.kitId
      },
    });
  
    res.json(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
}; 

module.exports.getPatientDetails = async (req, res, next) => {
  try {
   
    const kit = await Patient.findOne({
      where: {

        id: req.params.id
      },
      attributes:[
        'patientName','hospitalName'
      ]
    });
  
    res.json(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
// module.exports.viewKitPatientDetail = async (req, res, next) => {
//   try {
   
//     const patient = await Patient.findAll({
//       where: {

//         kitId: req.params.kitId
//       },
//     });
  
//     res.send(patient);
  
//   } catch (error) {
//     return next({ status: 404, message: error });
//     res.status(400).send(error);
//     console.log(error);
//   }
// };
module.exports.viewPatientDetail = async (req, res, next) => {
  try {
   
    const kit = await Kit.findOne({
      where: {

        id: req.params.id
      },
      include:{all:true}

    });
  
    res.send(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.viewShippingDetail = async (req, res, next) => {
  try {
   
    const patient = await Logistic.findOne({
      where: {

        id: req.params.id
      }
     
    });
  
    res.send(patient);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.shippedTracking = async (req, res, next) => {
  try {
   
    const kit = await Kit.findAll({
      include:[{
        model:Patient
      },
    
      {
        model:Logistic,
        where:{
        shippingStatus:{[Op.or]:["Ready to Ship","Shipped","In Transit","Received By Patient"]},
        //  returnStatus:null
            returnStatus:{[Op.or]:['Ready to Ship','Shipped','In Transit',null]}
          
        }
       
      }
    ],
    
    order: [['createdAt', 'DESC']]

    });
  
    res.send(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//receiptEntryReturn
module.exports.receiptEntryReturn = async (req, res, next) => {
  try {
   
    const kit = await Kit.findAll({
    where:{
   kitReceived:false
    },
      include:[{
        model:Patient},
        {
          model:Logistic,
        where:{
          returnStatus:req.params.returnStatus,
          shippingStatus:req.params.shippingStatus
        }
      },
      {
        model:Device,
        include:[{
          model:Service,
          attributes:['service']
        },
        {
      model:Accessory,
      attributes:['accessory']

        },
        {
          model:Vendor,
          attributes:['vendorName']

            },

    ]
      }
      ]
    });
    console.log("Kit",kit)
  
    res.send(kit);
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//update kit id in patient and status

module.exports.AssignKit = async (req, res, next) => {
console.log("req.body.kitId,patientId",req.body.kitId,req.body.patientId)
    return Kit.update({
      hospitalName:req.body.hospitalName,
      patientId:req.body.patientId,
      patientName:req.body.patientName,
      assignStatus:"Assigned",
      assignedDate:new Date(),
      lastModifiedBy:req.body.lastModifiedBy,

    },
      {
      where: {
        id: req.body.kitId
        
      }
    }
    
  ).then((result)=>{
      console.log("result of kit update",result)
      return Patient.update({
        kitId:req.body.kitId,
        assignStatus:"Assigned"},
        {
        where: {
          id: req.body.patientId
          
        }
      }
      )}).then((result) => {

        console.log("patient Status changed",result)
   
    res.status(200).send(result)
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
    }

module.exports.ReAssignKit = async (req, res, next) => {
  try {
   
    const kit = await Kit.update({
      hospitalName:null,
      patientId:null,
      patientName:null,
      assignStatus:"UnAssigned"
    },
      {
      where: {
        id: req.body.olderKitId
        
      }
    }
    
  )

  await Kit.update({
    hospitalName:req.body.hospitalName,
      patientId:req.body.patientId,
      patientName:req.body.patientName,
      assignStatus:"Assigned",
      assignedDate:new Date(),
       lastModifiedBy:req.body.lastModifiedBy
  },
  {
  where: {
    id: req.body.kitId
    
  }
}
  )

  const  patient=await Patient.update({
    kitId:req.body.kitId,
    assignStatus:"Reassigned",
    modifiedBy:req.body.lastModifiedBy

  },
    {
    where: {
      id: req.body.patientId
      
    }
  })




    res.status(200).send(patient);
  
  } catch (error) {
    return next({ status: 404, message: error });
  
  }




    }
module.exports.deviceWorkingStatusUpdate = async (req, res, next) => {
  try{
const  deviceUpdate=await Device.update({
  deviceStatus:req.body.deviceStatus,
  comment:req.body.deviceStatusComment,
  statusCheck:"Completed",
  editedBy:req.body.editedBy,
  deviceStatusUpdateDate:new Date()
},
{
where:{
  deviceId:req.params.deviceId
}
}
)
const  KitUpdate=await KitAccessoryInfo.update({
  deviceStatus:req.body.deviceStatus,
  comment:req.body.deviceStatusComment,
  statusCheck:"Completed",
  editedBy:req.body.editedBy,
  deviceStatusUpdateDate:new Date() 
},
{
where:{
  KitAccessoryId:req.params.KitAccessoryId
}
}
)
const Kits = await KitAccessoryInfo.findAll({
  where: {

    kitId: req.body.kitId,
    statusCheck:{
      [Op.is]:null
    }
  }
 
});
console.log("kits",Kits,Kits?.length)

if(Kits?.length>0){
const  kitUpdate=await Kit.update({
  status:"In QC",

},
{
where:{
  id:req.body.kitId
}
}
)
console.log(Kits)
}
else{
const  CompletedCheck=await Kit.update({
  status:"Completed",

},
{
where:{
  id:req.body.kitId
}
}
)
console.log(CompletedCheck)
}
   
    res.status(200).send(deviceUpdate)
   

    
  }
      catch (error) {
        return next({ status: 404, message: error });
      
      } 
  
     
    }
    //update device received or not and comment for device refurbish
module.exports.deviceStatus = async (req, res, next) => {
//console.log(req.params.kitId,req.body.comment,req.body.receiveStatus,req.body)
console.log("device status req",req.body)
return Device.bulkCreate(
req.body ,
    {
     updateOnDuplicate:["comment","receiveStatus","editedBy"],
    }
  
   
    
  )
  .then((result) => {


    
    console.log("updated result",result)
    return KitAccessoryInfo.bulkCreate(
      req.body ,
          {
           updateOnDuplicate:["comment","receiveStatus","editedBy"],
          }
        
         
          
        )
      
      })
  .then((result) => {



    console.log("updated result",result)
    return Kit.update({deviceReceiveStatusCheck:true},
      {
      where:{
      id:req.params.kitId,
      }
    }
    
  )}).then((result) => {

    console.log("device assign  Status changed",result)

 res.status(200).send(result)
  })
  .catch((error) => {
    return next({ status: 404, message: error });
  });
    
    //const {rows,count}=device;
    //console.log(rows,count,deviceGroup)
    // const vendor =await  Vendor.findAll();

    // res.send(device);
     
    }
    module.exports.dispatchUpdateLogistics = async (req, res, next) => {
      try {
       
        const orderShipping=await Logistic.findAll({
          where: {
            kitId: req.params.kitId
            
          },
          raw:true
         
        })
        console.log("order Shipping",orderShipping,orderShipping.length)
         
        if(orderShipping.length !=0){
    console.log("length greater",orderShipping.length)
 const logistic=   await Logistic.update(req.body,
      {
      where:{
        kitId: req.params.kitId
      },
      raw:true
    }
    ) 
    
  await  Kit.update({
      shippingStatus:req.body.shippingStatus,
    
    },
    {
      where:{
        id: req.params.kitId
    
      }
    })
   
    res.status(200).send(logistic)
      }
      else{
      const logisticCreate=await Logistic.create({
          kitId: req.params.kitId,
          shippingStatus:req.body.shippingStatus,
          logisticName:req.body.logisticName,
          AWB:req.body.AWB,
          shippingDate:req.body.shippingDate,
          returnAWB:req.body.returnAWB,
         
          returnLogisticsName:req.body.returnLogisticsName
    
        })
        const kitUpdate=await Kit.update({
          shippingStatus:req.body.shippingStatus,
        
        },
        {
          where:{
            id: req.params.kitId
        
          }
        }
        )  
        res.send({kitUpdate,logisticCreate})
      }
       
      } catch (error) {
        return next({ status: 404, message: error });
        res.status(400).send(error);
        console.log(error);
      }
    };
// module.exports.dispatchUpdateLogistics = async (req, res, next) => {

//     return Patient.update({
//       logisticName:req.body.logisticName,
//       AWB:req.body.AWB,
//       shippingDate:req.body.shippingDate,
//       shippingStatus:req.body.shippingStatus,
//       returnAWB:req.body.returnAWB,
//       returnLogisticsName:req.body.returnLogisticsName
//     },
//       {
//       where: {
//         id: req.params.patientId
        
//       }
//     }
    
//   ).then((result)=>{
      

//         console.log("patient logistic changed",result)
   
//     res.status(200).send(result)
//       })
//       .catch((error) => {
//         return next({ status: 404, message: error });
//       });
    

    
     
//     }
  
module.exports.updateLogisticReturn = async (req, res, next) => {

    return Logistic.update({
      shippingStatus:req.body.shippingStatus,
      returnStatus:req.body.returnStatus,
      returnAWB:req.body.returnAWB,
     
      returnDate:req.body.returnDate,
      returnLogisticsName:req.body.returnLogisticsName,
      modifiedBy:req.body.modifiedBy
    },
      {
      where: {
        id: req.params.logisticId
        
      }
    }
    
  ).then((result)=>{
      

        console.log("patient logistic changed",result)
   
    res.status(200).send(result)
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
    

    
     
    }
    //updateKitReceiveStatus
  
module.exports.updateKitReceiveStatus = async (req, res, next) => {

    return Kit.update({
      kitReceived:req.body.kitReceived
    },
      {
      where: {
        id: req.params.kitId
        
      }
    }
    
  ).then((result)=>{
      

        console.log("Receive status changed",result)
   
    res.status(200).send(result)
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
    

    
     
    }
  