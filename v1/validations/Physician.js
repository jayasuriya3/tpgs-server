const Joi = require("joi").defaults((schema) => {
  switch (schema.type) {
    case "string":
      return schema.replace(/\s+/, " ");
    default:
      return schema;
  }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.technicianRegister = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  eventType: Joi.string().required(),
  eventID: Joi.string().required(),
  studyID: Joi.string().required(),
  studyType: Joi.string().required(),
  facility: Joi.string().required(),
  maxHR: Joi.string().required(),
  patientName: Joi.string().required(),
  age: Joi.string().required(),
  gender: Joi.string().required(),
  primaryContact: Joi.string().required(),
  secondaryContact: Joi.string().required(),
  address: Joi.string().required(),
  implantDevice: Joi.string().required(),
  criteria: Joi.array().required(),
  heartRateData: Joi.array().required(),
  VE: Joi.array().required(),
  SVE: Joi.array().required(),
  event: Joi.array().required(),
  heartRateVariablity: Joi.array().required(),
  burdenPulseIndication: Joi.array().required(),
  stMVCH1: Joi.array().required(),
  stMVCH2: Joi.array().required(),
  stMVCH3: Joi.array().required(),
  others: Joi.array().required(),
  serviceManagement: Joi.array().required(),
  studySetting: Joi.array().required(),
  diagnosisInformation: Joi.array().required(),
  studyLogs: Joi.string().required(),
  studyNotes: Joi.string().required(),
  physicianAmendmentNote: Joi.string().required(),
  deviceNotificationHistory: Joi.string().required(),
  studyHistory: Joi.string().required(),
  comment: Joi.string().required(),
  physicianComment: Joi.string().required(),
  interpretingPhysicianID: Joi.string().required(),
  referingPhysicianID: Joi.string().required(),
});
