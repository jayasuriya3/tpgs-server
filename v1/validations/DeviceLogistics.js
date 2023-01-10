const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.DeviceLogisticRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
})


module.exports.DeviceLogisticLogin = Joi.object({

    email: Joi.string().required(),
    password: Joi.string().required()
  
})