const Model = require("../../model/index");
const User = require("../../models").user;
const Service = require("../../models").Service;
const Accessory = require("../../models").Accessory;
const Device = require("../../models").Device;
const Vendor = require("../../models").Vendor;
const GeneralDevice = require("../../models").GeneralDevice;
const Customer = require("../../models").Customer;
const Order = require("../../models").Order;
const AccessoryInfo = require("../../models").AccessoryInfo;
const OrderShipping = require("../../models").OrderShipping;
const AccessoryOrder = require("../../models").AccessoryOrder;

const bcrypt = require("bcryptjs");
const Validation = require("../validations/AssetMaster");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../../models").sequelize;

module.exports.AssetMasterRegister = async (req, res) => {
  try {
    await Validation.AssetMasterRegister.validateAsync(req.body);
    const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(
      req.body
    );
    const result = await user.save();
    const { password, ...data } = await user.toJSON();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//login of technician
module.exports.AssetMasterLogin = async (req, res) => {
  try {
    await Validation.AssetMasterLogin.validateAsync(req.body);
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
    const { role,name } = user;
    console.log(role);
    // })
    res.send({
      token,
      role,
      name
    });
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
    console.log(error);
  }
};
//add service
module.exports.AddService = async (req, res,next) => {
  try {
    await Validation.AddService.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    //console.log(req.body)
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const existingDevice = await Service.findAll({ where: { 
      
      service:{
        [Op.iLike]: '%'+req.body.service+'%'
      }
     
    }
     });
    console.log(existingDevice);
console.log(existingDevice.length)
    if (existingDevice.length) {
      
      return res.status(400).send({
        message: "User Already Exist",
      });
    }
   

    const service = await Service.create({
      service: req.body.service,
      createdBy: req.body.createdBy,
      creatorPhoto: req.body.creatorPhoto,
    });
    const result = await service.save();
    console.log("results", result);
    //  const { password, ...data } = await user.toJSON();
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AllService = async (req, res) => {
  try {
    const service = await Service.findAll({
      where:{
      disable:false
    }});

    res.send(service);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AllServiceList = async (req, res) => {
  try {
    const service = await Service.findAll({
      order: [['createdAt', 'DESC']]
  
    },
  
    );

    res.send(service);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AllCustomer = async (req, res) => {
  try {
    const customer = await Customer.findAll();

    res.send(customer);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//add accessory

module.exports.AddAccessory = async (req, res) => {
  try {
    await Validation.AddAccessory.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
//     const service=await Service.findOne({
//       where:{
//         service:req.body.service
//       }
//     })
//     console.log(service)
//     const serviceAccessory=await Service.findAll({
// include:[{
//   model:Accessory,
//   as:'Accessories'
 
// }],
// where: {
//   [Op.and]: [
//       { 'service': { [Op.like]:'%'+req.body.service+'%'} },
//       { '$Accessories.accessory$': { [Op.like]: '%'+req.body.accessory+'%'} }
//   ]
// }

//     })
const serviceAccessory = await Service.findAll({
  include: [{
    model: Accessory,
    as: 'Accessories'
  }],
  where: {
    [Op.and]: [
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('Service.service')),
        Sequelize.fn('lower', req.body.service)
      ),
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('Accessories.accessory')),
        Sequelize.fn('lower', req.body.accessory)
      )
    ]
  }
});
    
    //console.log(req.body)
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    console.log(serviceAccessory);
console.log(serviceAccessory.length)
    if (serviceAccessory.length>0) {
      
      return res.status(403).send({
        message: "Accessory Already Exist",
      });
    }
   
    const accessory = await Accessory.create({
      service: req.body.service,
      accessory: req.body.accessory,
      accessoryType: req.body.accessoryType,
      returnStatus: req.body.returnStatus,
      createBy: req.body.createBy,
      creatorPhoto: req.body.creatorPhoto,
      serviceId: req.body.serviceId,
    });
    //const result = await accessory.save();
    console.log("results", accessory);
    //  const { password, ...data } = await user.toJSON();
    res.send(accessory);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//all accessory
module.exports.AllAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.findAll({
      where:{
      disable:false,
     // order: [['createdAt', 'DESC']]

    },
    include:[{
      model:Service
    }],
    order: [['createdAt', 'DESC']]
  });

    res.send(accessory);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AllAccessoryList = async (req, res) => {
  try {
    const accessory = await Accessory.findAll({
      include:[{
        model:Service
      }],
      order: [['createdAt', 'DESC']]

    },
   
    );

    res.send(accessory);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
// module.exports.deleteAccessory = async (req, res) => {
//   try {
//     const accessory = await Device.destroy({
//     });

// // const accessoryDel = await Vendor.destroy({
// // where:{},
// //     });
// // const customer = await Customer.destroy({
// // where:{},
// //     });
// // const order = await Order.destroy({
// // where:{},
// //     });
// // const orderShipping = await OrderShipping.destroy({
// // where:{},
// //     });
//     res.json({msg:"Deleted"});
//   } catch (error) {
//     res.status(400).send(error);
//     console.log(error);
//   }
// };

//add general device
module.exports.AddGeneralDevice = async (req, res) => {
  try {
    const existingDevice = await Device.findAll({ where: { 
      deviceId:req.body.deviceId
      
   
     // deviceId:req.body.deviceId
    }
     });
     console.log("existing device",existingDevice)
     if (existingDevice.length) {
      
      return res.status(403).send({
        message: "Device Already Exist",
      });
    }
   

   
    const device = await Device.create({
      accessory: req.body.accessory,
      service: req.body.service,
      vendor: req.body.vendorName,
      vendorId: req.body.vendorId,
      deviceModel: req.body.deviceModel,
      deviceId:req.body.deviceId,
      purchaseDate: req.body.purchaseDate,
      expiryDate: req.body.expiryDate,
      warranty: req.body.warranty,
      additionalInfo: req.body.additionalText,

      mobileManufactureName: req.body.mobileManufactureName,
      mobileModel: req.body.mobileModel,
      mobileSerialNo: req.body.mobileSerialNo,
      mobilePurchaseDate: req.body.mobilePurchaseDate,
      mobileWarranty: req.body.mobileWarranty,
      mobileNo: req.body.mobileNo,
      simSerialNo: req.body.simSerialNo,
      serviceProvider: req.body.serviceProvider,
      serviceType: req.body.serviceType,
      servicePlan: req.body.servicePlan,
      serviceId: req.body.serviceId,
      accessoryId: req.body.accessoryId,
      accessoryType:req.body.accessoryType,
      warrantyTime:req.body.warrantyTime
    });

  
    res.send(device);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//add general device

module.exports.AddDevice = async (req, res) => {
  try {
    const existingDevice = await Device.findAll({ where: { 
      serviceId:req.body.serviceId,
      accessoryId:req.body.accessoryId,
      vendorId:req.body.vendorId,

      // serviceId:{
      //   [Op.iLike]: '%'+req.params.serviceId+'%'
      // },
      // accessoryId:{
      //   [Op.iLike]: '%'+req.params.accessoryId+'%'

      // },
      // vendorId:{
      //   [Op.iLike]: '%'+req.params.vendorId+'%'

      // },
      
    deviceId:req.body.deviceId
    }
     });
     console.log("existing device",existingDevice)
     if (existingDevice.length) {
      
      return res.status(403).send({
        message: "Device Already Exist",
      });
    }
   

   
    const device = await Device.create({
      accessory: req.body.accessory,
      service: req.body.service,
      vendor: req.body.vendorName,
      vendorId: req.body.vendorId,
      deviceModel: req.body.deviceModel,
      deviceId:req.body.deviceId,
      purchaseDate: req.body.purchaseDate,
      expiryDate: req.body.expiryDate,
      warranty: req.body.warranty,
      additionalInfo: req.body.additionalText,

      mobileManufactureName: req.body.mobileManufactureName,
      mobileModel: req.body.mobileModel,
      mobileSerialNo: req.body.mobileSerialNo,
      mobilePurchaseDate: req.body.mobilePurchaseDate,
      mobileWarranty: req.body.mobileWarranty,
      mobileNo: req.body.mobileNo,
      simSerialNo: req.body.simSerialNo,
      serviceProvider: req.body.serviceProvider,
      serviceType: req.body.serviceType,
      servicePlan: req.body.servicePlan,
      serviceId: req.body.serviceId,
      accessoryId: req.body.accessoryId,
      accessoryType:req.body.accessoryType,
      warrantyTime:req.body.warrantyTime
    });
    //const result = await accessory.save();
    console.log("results", device);
    //  const { password, ...data } = await user.toJSON();
    res.send(device);
  } catch (error) {   
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.AddAccessoryList = async (req, res,next) => {
  try {
    //for future when device added assign change
    console.log("req.body",req.body)
    const accessoryDevice=await AccessoryOrder.bulkCreate(req.body);
    console.log("accessoryDevice",accessoryDevice)

    const deviceId=req.body.map(device=>device.deviceId);
    const deviceUpdate=await Device.update({
  customerId:req.params.customerId,
  ordersId:req.params.ordersId
  },
    {
      where:{
        deviceId:deviceId
      }
    }
    )
  //   const accessoryDeviceUpdate=await AccessoryOrder.update({
  // customerId:req.params.customerId,
  // ordersId:req.params.ordersId
  // },
  //   {
  //     where:{
  //       deviceId:deviceId
  //     }
  //   }
  //   )
    console.log("device id",deviceId)

  //   req.body.forEach(object => {
  //     delete object['id'];
  //   });
  //   console.log("add accessory",req.body)
  //   //res.send(req.body)
  // const accessoryInfo=await  AccessoryInfo.bulkCreate(req.body)

 // res.send({accessoryInfo,deviceUpdate});
  res.send({deviceUpdate});
   
  } catch (error) {
    console.log("error",error)
    return next({ status: 404, message: error });

  }
};
module.exports.AddExcelGeneralDevice = async (req, res,next) => {
  try {
    
    const deviceId=req.body.map(device=>String(device.deviceId));

    const existingDevice = await Device.findAll({ where: { 
      deviceId:deviceId
    
        }
     });
     console.log("existing device",existingDevice)
     if (existingDevice.length) {
      
      return res.status(403).send({
        message: "Device Already Exist",
      });
    }
   

   
    //res.send(req.body)
  const devices=await  Device.bulkCreate(req.body)
    
   

   
    res.send(devices);
  } catch (error) {
    return next({ status: 404, message: error });

  }
};
module.exports.AddExcelServiceDevice = async (req, res,next) => {
  try {
    const deviceId=req.body.map(device=>String(device.deviceId));
    console.log("deviceId",deviceId)
    const existingDevice = await Device.findAll({ where: { 
      serviceId:req.params.serviceId,
      accessoryId:req.params.accessoryId,
      vendorId:req.params.vendorId,

      // serviceId:{
      //   [Op.iLike]: '%'+req.params.serviceId+'%'
      // },
      // accessoryId:{
      //   [Op.iLike]: '%'+req.params.accessoryId+'%'

      // },
      // vendorId:{
      //   [Op.iLike]: '%'+req.params.vendorId+'%'

      // },
      
    deviceId:deviceId
    }
     });
     console.log("existing device",existingDevice)
     if (existingDevice.length) {
      
      return res.status(403).send({
        message: "Device Already Exist",
      });
    }
   

   
    //res.send(req.body)
  const devices=await  Device.bulkCreate(req.body)
    
   

   
    res.send(devices);
  } catch (error) {
    return next({ status: 404, message: error });

  }
};
//add vendor
module.exports.AddVendor = async (req, res) => {
  try {
    await Validation.AddVendor.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    const existingVendor = await Vendor.findAll({
     
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('vendorName')),
            Sequelize.fn('lower', req.body.vendorName)
          ),
         
        ]
      }
    });
    console.log("exisitng Vendor",existingVendor)
    if (existingVendor.length>0) {
        
      return res.status(409).send({
        message: "Vendor Already Exist",
      });
    }
    
 
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const vendor = await Vendor.create({
      vendorName: req.body.vendorName,
      vendorid:req.body.vendorid,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipCode: req.body.zipCode,
      primaryContactPerson: req.body.primaryContactPerson,

      mobile: req.body.mobile,
      secondaryContactPerson: req.body.secondaryContactPerson,
      secondaryMobilePerson: req.body.secondaryMobilePerson,
      primaryExtension: req.body.primaryExtension,
      secondaryExtension: req.body.secondaryExtension,
      modifiedBy: req.body.modifiedBy,
    });
    //const result = await accessory.save();
    //  const { password, ...data } = await user.toJSON();
    console.log(vendor)
    res.send(vendor);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};
//get all vendor
module.exports.AllVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findAll({

      order: [['createdAt', 'DESC']]

    });

    res.send(vendor);
  } catch (error) {
    res.status(400).send(error);
  }
};
//All Order
module.exports.AllOrder = async (req, res,next) => {
  try {
    const order =  await Order.findAll({
      include:[{
        model:Customer
      }],
      where:{
        shippingStatus:{[Op.or]:['Ready To Ship','Shipped','In Transit',null]}

      },
      order: [['createdAt', 'DESC']]
    }) 
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.CloseOrder = async (req, res) => {
  try {
    const order =  Order.findAll({
    
      include:[{
        model:OrderShipping,
    
        where:{
          shippingStatus:{[Op.or]:['Received By Customer','Returned','Partially Returned','Received By Organization']}
        }
      },
      {
    model:Customer
  }
    ],
    order: [['updatedAt', 'DESC']]


    })  .then((result) => {
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
//get single vendor details
module.exports.getOneVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { id: req.params.id } });
    // const vendor =await  Vendor.findAll();

    res.send(vendor);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//get single device details
module.exports.getOneDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ where: { id: req.params.id } });
    // const vendor =await  Vendor.findAll();

    res.send(device);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getViewAccessory = async (req, res) => {
  try {
    const device = await Device.findOne({ where: { deviceId: req.params.deviceId } });

    res.send(device);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//get single accessory details
module.exports.getOneAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.findOne({ where: { id: req.params.id } });
    // const vendor =await  Vendor.findAll();

    res.send(accessory);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.serviceDetail = async (req, res) => {
  try {
    const serviceDetails = await Service.findOne({ where: { id: req.params.id } });
    // const vendor =await  Vendor.findAll();

    res.send(serviceDetails);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//get customer id
module.exports.orderCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findOne({
         
      where: { id: req.params.customerId } 
   
   })
   
console.log("customer",customer)

   res.send(customer);

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.deleteDeviceAccessory = async (req, res) => {
  try {
   // console.log(req.body)
   // const deviceId=req.body.map(device=>device.deviceId);
const deviceUpdate=await Device.update({deviceStatus:null,
  ordersId:null,
  customerId:null,
  orderId:null,

},
{
  where:{
    id:req.params.id
  }
}
)
const orderAccessory=await AccessoryOrder.update({deviceStatus:null,
  ordersId:null,
  customerId:null,
  orderId:null,

},
{
  where:{
    ordersId:req.params.ordersId,
    deviceId:req.params.deviceId
  }
}
)
console.log("deleted Accessoory ",orderAccessory)   
// const kit=await AccessoryInfo.destroy({
//   where:{id:req.params.id}
// })

// console.log("customer",kit)

  // res.status(200).json({kit,deviceUpdate});
   res.status(200).json({deviceUpdate});

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.countDevice = async (req, res) => {


  try {
    console.time("blocking")
  const kits=  Device.findAll({
      attributes: { 
          include: [[Sequelize.fn("COUNT", Sequelize.col("Accessory.id")), "sensorCount"]] 
      },
      include: [{
          model: Accessory, attributes: [],
          where:{
            accessoryType:"Sensor",
            createdAt: {
                    [Op.gte]: new Date(req.params.startDate),
                    [Op.lt]: new Date(req.params.endDate)
                  } ,
          }
      }],
      group: ['Accessory.id',"Device.id"]
    });
// const kit=await Device.count({
 
//   where: {
//     createdAt: {
//       [Op.gte]: new Date(req.params.startDate),
//       [Op.lt]: new Date(req.params.endDate)
//     }       }

// })
   
//console.log("customer",kit)
const vendor=Vendor.count({
  where: {
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }       }

})
const allOrder= Order.count({
  where: {
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }       }

})
const ClosedOrderCount =  Order.count({
     
  include:[{
    model:OrderShipping,

    where:{
      shippingStatus:{[Op.or]:['Received By Customer','Returned','Partially Returned','Received By Organization']},
        createdAt: {
          [Op.gte]: new Date(req.params.startDate),
          [Op.lt]: new Date(req.params.endDate)
        }       
    
    }
  }],

}) 
const OpenOrder = Order.count({

  where:{
    shippingStatus:{[Op.or]:['Ready To Ship','Shipped','In Transit',null]},
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }       


  }
}) 
const [promiseResult1, promiseResult2, promiseResult3,promise4,promise5] = await Promise.all([kits, vendor, allOrder,OpenOrder,
  ClosedOrderCount
]);
console.timeEnd('blocking');

res.status(200).json({deviceCount:promiseResult1.length,vendorCount:promiseResult2,allOrder:promiseResult3,OpenOrder:promise4,ClosedOrderCount:promise5})
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.countVendor = async (req, res) => {
  try {
    
const vendor=await Vendor.count({

})
   
//console.log("vendor",vendor)

res.status(200).json({vendorCount:vendor})
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.ClosedOrderCount = async (req, res) => {
  try {
    console.time('non blocking');

    const order =  Order.count({
     
      include:[{
        model:OrderShipping,
    
        where:{
          shippingStatus:{[Op.or]:['Received By Customer','Returned','Partially Returned','Received By Organization']}
        }
      }],

    })  .then((result) => {
   //   console.log("result  from order", result);
   console.timeEnd('non blocking');

      res.json({closedCount:result});
    })
    .catch((error) => {
      return next({ status: 404, message: error });
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.OrderSummary = async (req, res,next) => {
  try {
    const order =  Order.findAll({
     
      include:[{
        model:OrderShipping,
    

      }],
    

      
        where: {
          createdAt: {
            [Op.gte]: new Date(req.params.startDate),
            [Op.lt]: new Date(req.params.endDate)
          }       }
      
    })  .then((result) => {
 //     console.log("result  from order", result);
      res.json(result);
    })
    .catch((error) => {
      return next({ status: 404, message: error });
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.orderTrend = async (req,res,next) => {
 if(req.params.currentMonth==0){
  const orderTrend= await Order.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'amount'],
      [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'createdOn'],
      [Sequelize.fn('TO_CHAR', Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'Month'), 'month_name'],
    ],
    where: { 
      createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
      }   
    },
    order: [[Sequelize.literal('"createdOn"'), 'ASC']],
    group: 'createdOn'
  })
 // console.log('order trend',orderTrend)
  res.send(orderTrend)
 }
else{
  const orderTrend= await Order.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'amount'],
      [Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')), 'createdOn'],
    ],
    where: { 
      createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
      }   
    },
    order: [[Sequelize.literal('"createdOn"'), 'ASC']],
    group: 'createdOn'
  })
 // console.log('order trend',orderTrend)
  res.send(orderTrend)
}
}
module.exports.deviceAnalysis = async (req,res,next) => {
  try {
    console.time('blocking of deviceAnalysis');
  //  deviceAnalysis api
     console.log("device Analysis params",req.params.startDate,req.params.endDate)
  const deviceAnalysis=  Device.findAll({
    group:["Service.service","serviceId","Service.id"],
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('serviceId')), 'deviceCount'],
    ],
    where: { 
      createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
      }   
    },
    include:[{
      model:Service,
      attributes:['service']
    }]
  })

  
  console.log('order trend',deviceAnalysis)
 // deviceStatusAnalysis api
  const device =  Device.count({
    where: {
    
      deviceStatus:{[Op.or]:[null,"Working"]},
      // createdAt: {
      //    [Op.gte]: new Date(req.params.startDate),
      // [Op.lt]: new Date(req.params.endDate)
      // }


    },
  });
 
  const assignedDevice =  Device.count({
    where: {
    
      deviceStatus:"Assigned",
      createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
      }

    },
  });
 
  const defective =  Device.count({
    where: {
    
      deviceStatus:{[Op.or]:["Defective","Missing","Damaged"]},
      
      createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
      }

    },
  });


 // res.status(200).json({availableCount:device,assignedCount:assignedDevice,defective:defective});


  //res.send(deviceAnalysis)
// count device api
const kits=  Device.findAll({
  attributes: { 
      include: [[Sequelize.fn("COUNT", Sequelize.col("Accessory.id")), "sensorCount"]] 
  },
  include: [{
      model: Accessory, attributes: [],
      where:{
        accessoryType:"Sensor",
        createdAt: {
                [Op.gte]: new Date(req.params.startDate),
                [Op.lt]: new Date(req.params.endDate)
              } ,
      }
  }],
  group: ['Accessory.id',"Device.id"]
});
// const kit=await Device.count({

//   where: {
//     createdAt: {
//       [Op.gte]: new Date(req.params.startDate),
//       [Op.lt]: new Date(req.params.endDate)
//     }       }

// })

//console.log("customer",kit)
const vendor=Vendor.count({
where: {
createdAt: {
  [Op.gte]: new Date(req.params.startDate),
  [Op.lt]: new Date(req.params.endDate)
}       }

})
const allOrder= Order.count({
where: {
createdAt: {
  [Op.gte]: new Date(req.params.startDate),
  [Op.lt]: new Date(req.params.endDate)
}       }

})
const ClosedOrderCount =  Order.count({
 
include:[{
model:OrderShipping,

where:{
  shippingStatus:{[Op.or]:['Received By Customer','Returned','Partially Returned','Received By Organization']},
    createdAt: {
      [Op.gte]: new Date(req.params.startDate),
      [Op.lt]: new Date(req.params.endDate)
    }       

}
}],

}) 
const OpenOrder = Order.count({

where:{
shippingStatus:{[Op.or]:['Ready To Ship','Shipped','In Transit',null]},
createdAt: {
  [Op.gte]: new Date(req.params.startDate),
  [Op.lt]: new Date(req.params.endDate)
}       


}
}) 

// order summary  api
//promise done
const orderSummary =  Order.findAll({
     
  include:[{
    model:OrderShipping,


  }],


  
    where: {
      createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
      }       }
  
})  

const [promiseResult1, promiseResult2, promiseResult3,promise4,promise5,orderSummarypromise,devicePromise,assignedDevicePromise,defectivePromise,
deviceAnalysisPromise
] = await Promise.all([kits, vendor, allOrder,OpenOrder,
  ClosedOrderCount,orderSummary,device,assignedDevice,
  defective,
  deviceAnalysis
  ]);
  console.timeEnd('blocking');
  
  res.status(200).json({deviceCount:promiseResult1.length,vendorCount:promiseResult2,allOrder:promiseResult3,OpenOrder:promise4,ClosedOrderCount:promise5,orderSummary:orderSummarypromise,device:devicePromise,assignedDevice:assignedDevicePromise,defective:defectivePromise,deviceAnalysis:deviceAnalysisPromise
  
  })

//order trend api
console.timeEnd("blocking of deviceAnalysis")


} catch (error) {
  return next({ status: 404, message: error });
  console.log(error);
}
}
module.exports.orderDetails = async (req, res,next) => {
  try {
    
    // const vendor =await  Vendor.findAll();
  return AccessoryOrder.findAll({

      group: ["AccessoryOrder.serviceId","Service.id", "AccessoryOrder.vendorId","Vendor.id","Accessory.id","AccessoryOrder.accessoryId",
     "vendor" ,"AccessoryOrder.orderId"],
      attributes: [
        "vendorId",
         "vendor",
        "serviceId",
        "accessoryId",
       
        "orderId",
        [sequelize.fn("COUNT", sequelize.col("deviceId")), "count"],
        [sequelize.fn("MIN", sequelize.col("AccessoryOrder.accessory")), "accessory"],
     
        [sequelize.fn("MIN", sequelize.col("AccessoryOrder.accessoryType")), "accessoryType"],
      ],
      where:{orderId:req.body.id},
      order: [[Sequelize.literal("count"), "DESC"]],
      include:[{
        model:Service
      },{
    model:Accessory
    },
  {
    model:Vendor
  }
  ] 
    })
      .then((result) => {
        console.log("result", result);
       res.send(result)
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
    //order summary
    
    

  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.editVendor = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    
    const VendorEdit=await Vendor.findOne({where:{
      id:req.body.id
    }})
   
    if(String(VendorEdit.vendorName).toLowerCase()!=String(req.body.vendorName).toLowerCase()){
    const existingVendor = await Vendor.findAll({
     
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('vendorName')),
            Sequelize.fn('lower', req.body.vendorName)
          ),
         
        ]
      }
    });
    console.log("existingVendor",existingVendor)
    if (existingVendor.length>0) {
        
      return res.status(409).send({
        message: "Vendor Already Exist",
      });
    }
  }
    
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const vendor = await Vendor.update(
      {
        vendorName: req.body.vendorName,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zipCode: req.body.zipCode,
        primaryContactPerson: req.body.primaryContactPerson,

        mobile: req.body.mobile,
        secondaryContactPerson: req.body.secondaryContactPerson,
        secondaryMobilePerson: req.body.secondaryMobilePerson,
        modifiedBy: req.body.modifiedBy,
      },
      { where: { id: req.params.id } }
    );
    //const result = await accessory.save();
    console.log("results", vendor);
    //  const { password, ...data } = await user.toJSON();
    res.send(vendor);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//asset master role api
module.exports.assetMasterRole = async (req, res) => {
  try {
    const requesterMail = req.decoded.email;
    const requesterRole = req.decoded.role;
    const user = await User.findOne({
      where: { email: requesterMail },

      attributes: { exclude: ["password"] ,
      
    }
    
    ,
    });
    console.log("user",user)

    // if (requesterAccount.role === "supervisor") {

    res.send(user);
    //}
  } catch (error) {
    res.status(403).send({ message: error });
  }
};
//edit accessory
module.exports.editAccessory = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    const service=await Service.findOne({
      where:{
        service:req.body.service
      }
    })
    console.log(service)
//     const serviceAccessory=await Service.findAll({
// include:[{
//   model:Accessory,
//   as:'Accessories'
 
// }],
// where: {
//   [Op.and]: [
//       { 'service': { [Op.iLike]:'%'+req.body.service+'%'} },
//       Sequelize.where(
//         Sequelize.fn('similarity', Sequelize.col('service'), req.body.service),
//         { [Op.gte]: 0.5 }
//       ),
//       { '$Accessories.accessory$': { [Op.iLike]: '%'+req.body.accessory+'%'} },
      
//   ]
// }

//     })
// const serviceAccessory = await Service.findAll({
//   include: [{
//     model: Accessory,
//     as: 'Accessories'
//   }],
//   where: {
//     [Op.and]: [
//       Sequelize.where(
//         Sequelize.fn('similarity', Sequelize.col('Service.service'), req.body.service),
//         { [Op.gte]: 0.5 }
//       ),
//       Sequelize.where(
//         Sequelize.fn('similarity', Sequelize.col('$Accessories.accessory$'), req.body.accessory),
//         { [Op.gte]: 0.5 }
//       )
//     ]
//   }
// });

 const accessoryEdit=await Accessory.findOne({where:{
      id:req.body.id
    }})
    if(String(accessoryEdit.accessory).toLowerCase()!=String(req.body.accessory).toLowerCase()){
      const serviceAccessory = await Service.findAll({
        include: [{
          model: Accessory,
          as: 'Accessories'
        }],
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('Service.service')),
              Sequelize.fn('lower', req.body.service)
            ),
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('Accessories.accessory')),
              Sequelize.fn('lower', req.body.accessory)
            )
          ]
        }
      });
   
      if (serviceAccessory.length) {
        
        return res.status(409).send({
          message: "Accessory Already Exist",
        });
      }
    }
// const serviceAccessory = await Service.findAll({
//   include: [{
//     model: Accessory,
//     as: 'Accessories'
//   }],
//   where: {
//     [Op.and]: [
//       Sequelize.where(
//         Sequelize.fn('lower', Sequelize.col('Service.service')),
//         Sequelize.fn('lower', req.body.service)
//       ),
//       Sequelize.where(
//         Sequelize.fn('lower', Sequelize.col('Accessories.accessory')),
//         Sequelize.fn('lower', req.body.accessory)
//       )
//     ]
//   }
// });

//     console.log("serviceAccessory exist",serviceAccessory.length)
//     // const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     const existingDevice = await Accessory.findAll({ 
      
      
//       where: { 
//      service:service.service,
//      accessory:{
//       [Op.iLike]: '%'+req.body.accessory+'%'
//     }
//      }
//      });
//     console.log(serviceAccessory);
// console.log(serviceAccessory.length>0)
//     if (serviceAccessory.length>0) {
      
//       return res.status(409).send({
//         message: "Accessory Already Exist",
//       });
//     }
   
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const accessory = await Accessory.update(
      {
        service: req.body.service,
        serviceId: req.body.serviceId,
        accessory: req.body.accessory,
        accessoryType: req.body.accessoryType,
        returnStatus: req.body.returnStatus,
        modifiedBy: req.body.modifiedBy,
      },
      { where: { id: req.params.id } }
    );
    //const result = await accessory.save();
    console.log("results", accessory);
    //  const { password, ...data } = await user.toJSON();
    res.send({ msg: "Accessory Edited Successful", success: true });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.editService = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    console.log('id',req.params.id)
    const serviceEdit=await Service.findByPk(req.params.id)
   
    if(String(serviceEdit.service).toLowerCase()!=String(req.body.service).toLowerCase()){
    const existingService = await Service.findAll({
     
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('service')),
            Sequelize.fn('lower', req.body.service)
          ),
         
        ]
      }
    });
    console.log("existingVendor",existingService)
    if (existingService.length>0) {
        
      return res.status(409).send({
        message: "Vendor Already Exist",
      });
    }
  }

    // if(serviceEdit.service!=req.body.service){
    //   const existingVendor = await Service.findAll({ where: { 
      
       
    //     service:{ 
    //       [Op.iLike]: '%'+req.body.service+'%'
  
    //     },
    
    //    }
    //    });
   
    //   if (existingVendor.length) {
        
    //     return res.status(409).send({
    //       message: "Vendor Already Exist",
    //     });
    //   }
    // }
    
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const service = await Service.update(
      {
        service: req.body.service,
        editedBy: req.body.editedBy

      },
    
      { where: { id: req.params.id },
      plain:true,
      raw:true,
      returning:true
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
module.exports.editDisableEnableService = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const service = await Service.update(
      {
        disable: !req.body.disable,
        editedBy: req.body.editedBy

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
module.exports.editDisableEnableAccessory = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const accessory = await Accessory.update(
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
    console.log("results", accessory);
    //  const { password, ...data } = await user.toJSON();
    res.send(accessory);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.deviceDetailUpdate = async (req, res) => {
  try {
    //await Validation.AssetMasterRegister.validateAsync(req.body);
    // const salt = await bcrypt.genSalt(10);
   console.log(req.body);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const device = await Device.update(
      {
        deviceModel: req.body.deviceModel,
        expiryDate: req.body.expiryDate,
        warranty: req.body.warranty,
        deviceId: req.body.deviceId,
        returnStatus: req.body.returnStatus,
        deviceStatus:req.body.deviceStatus,
        additionalInfo: req.body.additionalInfo,
        deviceStatusComment: req.body.deviceStatusComment,
        mobileNo: req.body.mobileNo ,
        vendor:req.body.vendor,
purchaseDate:req.body.purchaseDate ,
warrantyTime:req.body.warrantyTime,
simSerialNo: req.body.simSerialNo,
servicePlan: req.body.servicePlan,
  serviceProvider: req.body.serviceProvider,
  serviceType:req.body.serviceType,
        editedBy:req.body.editedBy
        
      },
      { where: { id: req.params.id } }
    );
    //const result = await accessory.save();
    console.log("device edited results", device);
    //  const { password, ...data } = await user.toJSON();
    res.send({ msg: "Accessory Edited Successful", success: true });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//get customer
module.exports.getContactByName = async (req, res, next) => {
  try {
    //  vendor =await  Vendor.findAll();
    let term = req.params.term;

    // Make lowercase
    term = term.toLowerCase();

    const customer = await Customer.findAll({
      where: {
        customerName: { [Op.iLike]: `%${term}%` },
      },
    });

    //     const customer= Customer.findAll({ where: { customerName: { [Op.like]: '%' + term + '%' } } })
    //  console.log(customer)
    res.send(customer);
  } catch (error) {
    return next({ status: 404, message: error });
  }
};

//findAndCountAll

module.exports.getCountDevice = async (req, res, next) => {
  try {
   if(req.body.accessory=="Mobile"){
    const device = await Device.findAll({
      where: {
        vendor:req.body.vendor,
        accessory: req.body.accessory,
        deviceStatus:{[Op.or]:[null,"Working"]}

      },
    });

    res.send(device);
  }
  else{
  const device = await Device.findAll({
    where: {
      serviceId: req.body.serviceId,
      accessoryId: req.body.accessoryId,
      vendorId: req.body.vendorId,
      deviceStatus:{[Op.or]:[null,"Working"]}

    },
  });
 
  res.send(device);
}
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getDeviceStatusAnalysis = async (req, res, next) => {


  try {
   
    const device = await Device.count({
      where: {
      
        deviceStatus:{[Op.or]:[null,"Working"]},
        // createdAt: {
        //    [Op.gte]: new Date(req.params.startDate),
        // [Op.lt]: new Date(req.params.endDate)
        // }


      },
    });
   
    const assignedDevice = await Device.count({
      where: {
      
        deviceStatus:"Assigned",
        createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
        }

      },
    });
   
    const defective = await Device.count({
      where: {
      
        deviceStatus:{[Op.or]:["Defective","Missing","Damaged"]},
        
        createdAt: {
        [Op.gte]: new Date(req.params.startDate),
        [Op.lt]: new Date(req.params.endDate)
        }

      },
    });


    res.status(200).json({availableCount:device,assignedCount:assignedDevice,defective:defective});
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.allDeviceSearch = async (req, res, next) => {
  try {
   if(req.params.accessory=="Mobile"){
    const device = await Device.findAll({
      where: {
        accessory: req.params.accessory,
        deviceStatus:{[Op.or]:[null,"Working"]}

       
      },
  
    });
   
    res.send(device);
   }
   else{
    const device = await Device.findAll({
      where: {
        serviceId: req.params.serviceId,
        accessoryId: req.params.accessoryId,
        deviceStatus:{[Op.or]:[null,"Working"]}

       
      },
      include:[{
        model:Service
      },{
    model:Accessory
    }
    ,{
      model:Vendor
      }
  ] 
    
    });
    
    res.send(device);
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getAccessoryInfoDevice = async (req, res, next) => {
  try {
    console.log("req.body",req.body)
   if(req.body.accessory=="Mobile"){
    const device = await AccessoryOrder.findAll({
      where: {
        accessory: req.body.accessory,
        vendor: req.body.vendor,
        customerId:req.body.customerId,
        ordersId:req.body.ordersId,
      },
    });
 
    res.send(device);
  }
  else{
    const device = await AccessoryOrder.findAll({
      where: {
        serviceId: req.body.serviceId,
        accessoryId: req.body.accessoryId,
        vendorId: req.body.vendorId,
        customerId:req.body.customerId,
        ordersId:req.body.ordersId,
      },
     
    });
  
    res.send(device);
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 405, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
// module.exports.getAssignAccessoryInfoDevice = async (req, res, next) => {
//   try {
  
//     const device = await Device.findAll({
//       where: {
    
//         customerId:req.params.customerId,
//         ordersId:req.params.ordersId,
//       },
//     });
 
//     res.send(device);
  
  
  
//     // const vendor =await  Vendor.findAll();

//     // res.send(device);
//   } catch (error) {
//     return next({ status: 405, message: error });
//     res.status(400).send(error);
//     console.log(error);
//   }
// };
module.exports.assignedDevice = async (req, res, next) => {
  try {
    if(req.params.accessory=="Mobile"){
    const device = await Device.findAll({
      where: {
      //  service: req.body.service,
        accessory: req.params.accessory,
        vendor: req.params.vendor,
       // accessoryType:req.body.accessoryType,
        deviceStatus:"Assigned"
        
      },
      include:[{
        model:Customer
      }]
    });

    res.send(device);
  }
  else{
    const device = await Device.findAll({
      where: {
      //  service: req.body.service,
      //   accessory: req.body.accessory,
      //   vendor: req.body.vendor,
      serviceId:req.params.serviceId,
      accessoryId:req.params.accessoryId,
      vendorId:req.params.vendorId,
       // accessoryType:req.body.accessoryType,
        deviceStatus:"Assigned"
        
      },
      include:[{
        model:Customer
      }]
    });

    res.send(device);
  }
    // const vendor =await  Vendor.findAll();
  
    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.shippingDetail = async (req, res, next) => {
  try {
    const shipping = await OrderShipping.findOne({
      where: {
       orderId:req.params.shippingOrderId
        
      },
    });
console.log("shipping detail",shipping)

    res.json(shipping);
    // const vendor =await  Vendor.findAll();
  
    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getOrderInfoDevice = async (req, res, next) => {
  try {
    if(req.body.accessory=="Mobile"){
    const device = await  Device.findAll({
      where: {

        vendor:req.body.vendor,
        accessory:req.body.accessory,
        orderId:req.body.orderId
      
      },
    });
   
    res.send(device);
  }
  else{
    const device = await  Device.findAll({
      where: {
        serviceId: req.body.serviceId,
        accessoryId: req.body.accessoryId,
        vendor:req.body.vendor,
        accessory:req.body.accessory,
        vendorId: req.body.vendorId,
        orderId:req.body.orderId,
        accessoryType:req.body.accessoryType
      },
    });
   
    res.send(device);
  }
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getOrderAccessoryInfoDevice = async (req, res, next) => {
  try {
    console.log("orderid runnded",req.params.id)
    const device = await  AccessoryOrder.findAll({
      where: {

        ordersId:req.params.id,
      
      },
    });
    console.log("Device runn",device)
   
    res.send(device);
 
  
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 405, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getAssignAccessoryInfoDevice = async (req, res, next) => {
  try {
    const device = await  Device.findAll({
      where: {

        ordersId:req.params.ordersId,
      
      },
    });
   
    res.send(device);
 
  
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 405, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};


module.exports.getViewDevice = async (req, res, next) => {
  try {
    console.log("req,body",req.body)
    
   if(req.params.accessory=="Mobile"){
    const device = await Device.findAll({
      where: {
        vendor: req.params.vendor,
      // service: req.params.service,
        accessory: req.params.accessory,
      // accessoryType: req.params.accessoryType,
        deviceStatus:{[Op.or]:["Working",null]}
      },
      order: [['deviceId', 'ASC']]

    });
    console.log("device",device)
    res.send(device);

  }
  else{
    const device = await Device.findAll({
      where: {
        vendorId: req.params.vendorId,
       serviceId: req.params.serviceId,
        accessoryId: req.params.accessoryId,
    //   accessoryType: req.params.accessoryType,
        deviceStatus:{[Op.or]:["Working",null]}
      },
      order: [['deviceId', 'ASC']]

    });
    console.log("device",device)

    res.send(device);

  }

  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports.getAllViewDevice = async (req, res, next) => {
  try {
    console.log("req,body",req.body)
    
   if(req.params.accessory=="Mobile"){
    const device = await Device.findAll({
      where: {
      //  vendor: req.params.vendor,
      // service: req.params.service,
        accessory: req.params.accessory,
      // accessoryType: req.params.accessoryType,
        deviceStatus:{[Op.or]:["Working",null]}
      },
      order: [['deviceId', 'ASC']]

    });
    console.log("device",device)
 return   res.send(device);

  }
  else{
    const device = await Device.findAll({
      where: {
    //    vendorId: req.params.vendorId,
       serviceId: req.params.serviceId,
        accessoryId: req.params.accessoryId,
    //   accessoryType: req.params.accessoryType,
        deviceStatus:{[Op.or]:["Working",null]}
      },
      include:[
        {
 model:Service,
// attribute:['service']
        },
        {
          model:Vendor,
      //    attribute:['vendorName']

        },
        {
          model:Accessory,
         // attribute
        }
      ],
      order: [['deviceId', 'ASC']]

    });
    console.log("device",device)

  return  res.send(device);

  }

  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getMinMaxYear = async (req, res, next) => {
  try {
    const minYear = await Order.min('createdAt');
    const maxYear = await Order.max('updatedAt');
    console.log("minYear,maxYear",minYear,maxYear)
    res.json({minYear:minYear,maxYear:maxYear});

  }

   catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.getDefectiveDevice = async (req, res, next) => {
  try {
    if(req.params.accessory=="Mobile"){
      const device = await Device.findAll({
        where: {
          vendor: req.params.vendor,
        // service: req.params.service,
          accessory: req.params.accessory,
        // accessoryType: req.params.accessoryType,
        deviceStatus:{[Op.or]:["Defective","Damaged","Missing"]}
        },
      });
      res.send(device);
  
    }
    else{
      const device = await Device.findAll({
        where: {
          serviceId:req.params.serviceId,
          accessoryId:req.params.accessoryId,
          vendorId:req.params.vendorId,
        //   vendor: req.body.vendor,
        //  service: req.body.service,
        //   accessory: req.body.accessory,
        // accessoryType: req.body.accessoryType,
         deviceStatus:{[Op.or]:["Defective","Damaged","Missing"]}
        },
      });
      res.send(device);
  
    }
  
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.postOrders = async (req, res, next) => {
  try {
   const accessory=await Device.findAll({
      where: {
        ordersId: req.body.ordersId
        
      }
    })
   
   const returnedAccessory=await Device.findAll({
      where: {
        ordersId: req.body.ordersId,
        returnStatus:"Returned"
        
      }
    })
// if(returnedAccessory.length>=1){
//   const orderId=returnedAccessory.map(device=>device.orderId);

//     const orderIds=await Order.findOne({
//       where: {
//         id: orderId,
//     //    returnStatus:"Returned",
//        // ordersId:req.body.ordersId
        
//       }
//     })
//     const Quantity=parseInt(orderIds.quantity)-parseInt(returnedAccessory.length)

//  const orderPromise = await Order.update(
//       {
    
//         quantity: Quantity,
    
//       },
//       {
//         where: {
//           id: orderId
//         }
//       }
//     );
//     console.log("orderPromise",orderPromise)

//   }
   
 const order= await  Order.create({
      id:req.body.ordersId,
      orderId:req.body.orderId,
      quantity:accessory.length,
      customerId:req.body.customerId,
      customerName:req.body.customerName,
      device:req.body.device

    })
  
    const deviceId=accessory.map(device=>device.deviceId);
    await    Device.update({deviceStatus:'Assigned',
        customerId:req.body.customerId,
        customerName:req.body.customerName,
        orderId:req.body.ordersId,
        editedBy:req.body.editedBy,
        returnStatus:null
      
      },
        
          {
          where:{
            ordersId:req.body.ordersId
          }
        }
        )
    await    AccessoryOrder.update({deviceStatus:'Assigned',
        customerId:req.body.customerId,
        customerName:req.body.customerName,
        orderId:req.body.ordersId,
        editedBy:req.body.editedBy,
        returnStatus:null
      
      },
        
          {
          where:{
            ordersId:req.body.ordersId
          }
        }
        )
    res.status(200).send({message:"Order Created Successfully"})
 
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
module.exports.updateOrder = async (req, res, next) => {
  try {
    const accessory = await Device.findAll({
      where: {
        ordersId: req.body.ordersId
      }
    });

    const orderPromise = Order.update(
      {
        // id:req.body.ordersId,
        // orderId:req.body.orderId,
        quantity: accessory.length,
        // customerId:req.body.customerId,
        // customerName:req.body.customerName,
        device: req.body.device
      },
      {
        where: {
          id: req.body.ordersId
        }
      }
    );

    const deviceId = accessory.map(device => device.deviceId);
    const devicePromise = Device.update(
      {
        deviceStatus: 'Assigned',
        customerId: req.body.customerId,
        //  customerName:req.body.customerName,
        orderId: req.body.ordersId,
        editedBy: req.body.editedBy
      },
      {
        where: {
          ordersId: req.body.ordersId
        }
      }
    );
    const accessoryDevice = AccessoryOrder.update(
      {
        deviceStatus: 'Assigned',
        customerId: req.body.customerId,
        //  customerName:req.body.customerName,
        orderId: req.body.ordersId,
        editedBy: req.body.editedBy
      },
      {
        where: {
          ordersId: req.body.ordersId
        }
      }
    );

    // Wait for both updates to complete
    await Promise.all([orderPromise, devicePromise,accessoryDevice]);

    res.status(200).send({ message: "Order Updated Successfully" });
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//post shipping
module.exports.postShipping = async (req, res, next) => {
  try {
   console.log("post ship",req.body)
    const orderShipping=await OrderShipping.findAll({
      where: {
        orderId: req.body.orderId
        
      },
      raw:true
     
    })
    console.log("order Shipping",orderShipping,orderShipping.length)
     
    if(orderShipping.length !=0){
console.log("length greater",orderShipping.length)
return OrderShipping.update(
  {
  updatedAt:new Date(),
  orderId: req.body.orderId,
  logisticsName: req.body.logisticsName,
  AWB:req.body.AWB,
  shippingDate: req.body.shippingDate,
  shippingStatus: req.body.shippingStatus,
  insurance: req.body.insurance,
  updatedAt:new Date()

  },
  {
  where:{
    orderId:req.body.orderId
  },
  raw:true
}
) 
     .then((result)=>{
        
        console.log("order shipping executed with updated Status ",result)
        return Order.update({shippingStatus:req.body.shippingStatus,
          updatedAt:new Date()
        
        },
          {
          where:{
            id:req.body.orderId
          },
          returning:true,
          plain:true

        }
        
        ) .then((result)=>{
   console.log("result of order",result)
          return  res.status(200).send(result)
  
       // const data=updateResult[1][0].get()
       // console.log('updated accessory info',updateResult);
        
      })  .catch((error) => {
        return next({ status: 404, message: error });
      });
        
      //  const deviceId=result.map(device=>device.deviceId);
        //console.log("deviceID",deviceId)
        
      })

  // return OrderShipping.update(req.body,
  //       {
  //       where:{
  //         orderId:req.body.orderId
  //       },
  //       raw:true
  //     }
  //     ) .then((result)=>{

  //       return  res.status(200).send(result)

  //    // const data=updateResult[1][0].get()
  //    // console.log('updated accessory info',updateResult);
      
  //   })  .catch((error) => {
  //     return next({ status: 404, message: error });
  //   });
  }
    return OrderShipping.create({
      orderId: req.body.orderId,
      AWB: req.body.AWB,
      shippingDate: req.body.shippingDate,
      shippingStatus:req.body.shippingStatus,
      logisticsName:req.body.logisticsName,
      insurance:req.body.insurance

    })
    //  .then((result)=>{

      
    //   console.log("order shipping",result)
    //   return Order.update({shippingStatus:req.body.shippingStatus},
    //     {
    //     where:{
    //       orderId:req.body.orderId
    //     },
    //     raw:true
    //   }
    //   ) 
    // //  const deviceId=result.map(device=>device.deviceId);
    //   //console.log("deviceID",deviceId)
      
   
    // })
     .then((result)=>{

      
      console.log("order shipping",result)
      return OrderShipping.findAll({
        
          where:{
            orderId:req.body.orderId
          },
          raw:true
        
      })
      
    //  const deviceId=result.map(device=>device.deviceId);
      //console.log("deviceID",deviceId)
      
    })
    .then((result) => {
      console.log("result of find all",result)
    const id=result.map(device=>device.id);
console.log("id extracted ship",id)
const shippingId=parseInt(id)
console.log("shipping id",shippingId)
      const OrderUpdate= Order.update({shippingId:shippingId,shippingStatus:req.body.shippingStatus,
        updatedAt:new Date()

      },
        {
          where:{
            id:req.body.orderId
          }
        }
        )
      const AccessoryInfoUpdate= Device.update({shippingId:shippingId}
        ,
        {
          where:{
            orderId:req.body.orderId
          }
        }
        )
      Promise.all([OrderUpdate,AccessoryInfoUpdate]).then(response=>{
        console.log(response[0],response[1])
        
      })

    
    }).then((result) => {

    const shippingOrder=  OrderShipping.findOne({
        
        where:{
          orderId:req.body.orderId
        }
      
    })
    res.status(200).send(shippingOrder);
    
    })
    .catch((error) => {
      return next({ status: 404, message: error });
    });
  
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};

//update return in closed order
module.exports.ClosedReturnUpdate = async (req, res, next) => {
  //console.log(req.params.kitId,req.body.comment,req.body.receiveStatus,req.body)
  //console.log(req.body)
  try{
  const DeviceUpdate=await Device.bulkCreate(
    req.body ,
        {
         updateOnDuplicate:["returnStatus","deviceStatus","deviceStatusComment"],
        }
      
       
        
      );
  const AccessoryOrders=await AccessoryOrder.bulkCreate(
  req.body ,
      {
       updateOnDuplicate:["returnStatus","deviceStatus","deviceStatusComment"],
      }
    
     
      
    );
   const orderUpdate= Order.update({
      updatedAt:new Date()

    },
      {
        where:{
          id:req.params.shippingOrderId
        }
      }
      )
    
      res.status(200).send(orderUpdate)

  
    }
    catch (error) {
      return next({ status: 404, message: error });
      res.status(400).send(error);
    }
  }  
//get deviceGroup updated
module.exports.DeviceGroup = async (req, res, next) => {
  try {
if(req.params.accessory=="Mobile"){
  const device=await Device.findAll({
    where: {
      accessory: req.params.accessory,
      deviceStatus:{[Op.or]:[null,"Working"]}

    },
    group: ["vendor"],
    attributes: [
      "vendor",
      [sequelize.fn("COUNT", sequelize.col("vendor")), "count"],
      
    ],
    order: [[Sequelize.literal("count"), "DESC"]],
    raw: true,
  })
  
  console.log("device group", device);
  
  res.send( device );
}
else{
const device=await Device.findAll({
  include:[{
//     model:Service
//   },
// {
//   model:Accessory
// },

// {
model:Vendor,
attributes:['id','vendorName']

}
] ,
      where: {
        serviceId: req.params.serviceId,
        accessoryId: req.params.accessoryId,
        deviceStatus:{[Op.or]:[null,"Working"]}

      },
      group: ["vendor", "vendorId","Vendor.id"],
      attributes: [
        "vendorId",
      //  "serviceId",
        [sequelize.fn("COUNT", sequelize.col("vendorId")), "count"],
        [  sequelize.fn("MIN", sequelize.fn("COALESCE", sequelize.col("Device.vendor"), sequelize.col("Vendor.vendorName"))),
        "vendor"
      ],
      ],
     
      order: [[Sequelize.literal("count"), "DESC"]],
    })
    
    console.log("device",device)
    res.send( device );
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  }
}
  catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
  }

}


module.exports.DeviceGroupList = async (req, res, next) => {
  try {
    return Device.findAll({
     
    
      order: [['updatedAt', 'DESC']],

      group: ["Device.serviceId","Service.id", "Device.vendorId","Vendor.id","Accessory.id","Device.accessoryId","vendor"],
      attributes: [
        "vendorId",
      //  "vendor",
     
        "serviceId",
        "accessoryId",
      //   [sequelize.fn("COALESCE", [sequelize.fn("MIN", sequelize.col("Device.accessory")), "accessory"],
      //   [sequelize.fn("MIN", sequelize.col("Accessory.accessory")), "accessory"]),
      //   "accessory"
      // ],
   //    [sequelize.fn("MIN", sequelize.col("Device.accessory")), "MobileAccessory"],
    //   [sequelize.fn("MIN", sequelize.col("Accessory.accessory")), "ServiceAccessory"],
     
        [sequelize.fn("MIN", sequelize.col("Service.service")), "service"],
 //       [sequelize.fn("MIN", sequelize.col("Device.accessoryType")), "accessoryType"],

        [sequelize.fn("COUNT", sequelize.col("deviceId")), "count"],
      //   [Sequelize.fn(
      //     'CASE',
      //     Sequelize.literal('WHEN "Device.accessory" = \'XYZ\' THEN \'Returned\''),
      //     Sequelize.literal('ELSE \'Not Returned\'')
      //   ), 'status']
      // ],
    
        // [sequelize.literal(`(select COUNT("vendorId") from "Devices" where "deviceStatus" = 'Working' OR "deviceStatus" IS NULL)`), 'testSum'],
        [
          // Note the wrapping parentheses in the call below!
          sequelize.literal(`(
               COUNT("deviceId") FILTER ( WHERE
                "deviceStatus" = 'Working'
                OR
                "deviceStatus"  IS NULL) 
                 )`),
          'available'
      ],
      [sequelize.fn("MAX",sequelize.col('Device.editedBy')),'editedBy'],
      [sequelize.fn("MAX",sequelize.col('Device.updatedAt')),'updatedAt'],
      [sequelize.fn("MAX",sequelize.col('Accessory.id')),'updatedId'],
    [  sequelize.fn("MIN", sequelize.fn("COALESCE", sequelize.col("Device.accessory"), sequelize.col("Accessory.accessory"))),
      "accessory"
    ],
    [  sequelize.fn("MIN", sequelize.fn("COALESCE", sequelize.col("Device.accessoryType"), sequelize.col("Accessory.accessoryType"))),
      "accessoryType"
    ],
    [  sequelize.fn("MIN", sequelize.fn("COALESCE", sequelize.col("Device.vendor"), sequelize.col("Vendor.vendorName"))),
      "vendor"
    ],
      
     
      ],
    //  raw:true,


      // order: [[Sequelize.literal("count"), "DESC"]],  
      include:[{
        model:Service,
        
      },{
    model:Accessory
    }
    ,{
      model:Vendor
      }
  ] ,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
    console.log("device group", deviceGroup);
   
    res.send({ deviceGroup });
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
//get accessoryInfo group  by vendor,service,accessory
module.exports.accessoryInfoGroup = async (req, res, next) => {
  try {
    return Device.findAll({
      where: {
        customerId: req.params.customerId,
        ordersId:req.params.ordersId
       
      },
      group: ["Device.serviceId","Service.id","Accessory.id","Vendor.id", "vendorId","accessoryId","Device.service","Device.accessory","Device.vendor","ordersId","customerId"],
      attributes: [
        "vendorId",
     
        "serviceId",
        "accessoryId",
        "vendor",

      
        "service",
      
        "accessory",
        "ordersId",
        "customerId",
      
        [sequelize.fn("COUNT", sequelize.col("deviceId")), "count"],
      ],
     // order: [[Sequelize.literal("count"), "DESC"]],
      include:[{
        model:Service
      },{
model:Accessory

      },
    {
      model:Vendor
    }]
      //raw: true,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        return next({ status: 404, message: error });
      });
   
    res.send({ deviceGroup });
    // const vendor =await  Vendor.findAll();

    // res.send(device);
  } catch (error) {
    return next({ status: 404, message: error });
    res.status(400).send(error);
    console.log(error);
  }
};
