



const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.AssetMasterRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
})


module.exports.AssetMasterLogin = Joi.object({

    email: Joi.string().required(),
    password: Joi.string().required()
  
})
module.exports.AddService = Joi.object({

    service: Joi.string().required(),
  
}).options({allowUnknown:true})

module.exports.AddAccessory = Joi.object({

   
    service: Joi.string().required(),
    accessoryType: Joi.string().required(),
    returnStatus: Joi.string().required(),
   // serviceId: Joi.string().required(),
    
  
}).options({allowUnknown:true})

module.exports.AddVendor = Joi.object({

    vendorName: Joi.string().required(),
    email:  Joi.string().required(),
    address: Joi.string().required(),
   
    zipCode: Joi.string().required(),
    primaryContactPerson:  Joi.string().required(),

    mobile: Joi.string().required(),
    secondaryContactPerson: Joi.string().required(),
    secondaryMobilePerson:  Joi.string().required(),
    
  
}).options({allowUnknown:true})
