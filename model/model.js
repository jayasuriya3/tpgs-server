const env = process.env.NODE_ENV || 'development';
const dbConfig = require(__dirname + '/../config/config.js')[env];
const config = require(__dirname + '/../config/config.js')[env];

const Sequelize = require("sequelize");
// const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
//   host: dbConfig.host,
//   dialect: dbConfig.dialect
// });
//const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log(sequelize)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);

}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("../models/tutorial.model.js")(sequelize, Sequelize);
db.users = require("../models/user.model.js")(sequelize, Sequelize);
db.customerAssign = require("../models/customerAssign.model")(sequelize, Sequelize);
db.assistantAssigns = require("../models/assistantAssign.model.js")(sequelize, Sequelize);
db.devices = require("../models/device.model.js")(sequelize, Sequelize);
db.deviceData = require("../models/deviceData.model.js")(sequelize, Sequelize);
db.deviceLists = require("../models/deviceList.model.js")(sequelize, Sequelize);
db.deviceDetails = require("../models/deviceDetail.model.js")(sequelize, Sequelize);
db.patient = require("../models/patient.model")(sequelize, Sequelize);
db.patientKitAssign = require("../models/patientKitAssign.model")(sequelize, Sequelize);
db.service = require("../models/service.model")(sequelize, Sequelize);
db.kit = require("../models/kit.model")(sequelize, Sequelize);
db.accessorys = require("../models/accessory.model.js")(sequelize, Sequelize);
db.vendors = require("../models/vendor.model.js")(sequelize, Sequelize);
db.practices = require("../models/practice.model.js")(sequelize, Sequelize);

module.exports = db;

