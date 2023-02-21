'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
console.log("env variable",config.use_env_variable,config)
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log(sequelize)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);

}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log("model",model)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log("db",db)
db.sequelize = sequelize;
   db.Device.belongsTo(db.Service, { foreignKey: 'serviceId' })
   db.KitAccessoryInfo.belongsTo(db.Service, { foreignKey: 'serviceId' })
  db.AccessoryOrder.belongsTo(db.Service, { foreignKey: 'serviceId' })
   db.Accessory.belongsTo(db.Service, { foreignKey: 'serviceId' })
   db.Service.hasMany(db.Accessory, { foreignKey: 'serviceId' })
   db.Service.hasMany(db.Device, { foreignKey: 'serviceId' })
   db.Service.hasMany(db.KitAccessoryInfo, { foreignKey: 'serviceId' })
   db.Service.hasMany(db.AccessoryOrder, { foreignKey: 'serviceId' })
      db.Device.belongsTo(db.Accessory, { foreignKey: 'accessoryId' })
      db.KitAccessoryInfo.belongsTo(db.Accessory, { foreignKey: 'accessoryId' })
      db.AccessoryOrder.belongsTo(db.Accessory, { foreignKey: 'accessoryId' })
      db.Accessory.hasMany(db.Device, { foreignKey: 'accessoryId' })
      db.Accessory.hasMany(db.KitAccessoryInfo, { foreignKey: 'accessoryId' })
      db.AccessoryOrder.hasMany(db.Device, { foreignKey: 'accessoryId' })
      db.Device.belongsTo(db.Vendor, { foreignKey: 'vendorId' })
      db.Vendor.hasMany(db.Device, { foreignKey: 'vendorId' })
      db.AccessoryOrder.belongsTo(db.Vendor, { foreignKey: 'vendorId' })
      db.Vendor.hasMany(db.AccessoryOrder, { foreignKey: 'vendorId' })
      db.KitAccessoryInfo.belongsTo(db.Vendor, { foreignKey: 'vendorId' })
      db.Vendor.hasMany(db.KitAccessoryInfo, { foreignKey: 'vendorId' })
      db.Device.belongsTo(db.Order, { foreignKey: 'orderId' })
    //  db.AccessoryOrder.belongsTo(db.Order, { foreignKey: 'orderId' })
      db.Accessory.belongsTo(db.Service, { foreignKey: 'serviceId' })
      db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' })
      db.Device.belongsTo(db.Customer, { foreignKey: 'customerId' })
      db.AccessoryInfo.belongsTo(db.OrderShipping, { foreignKey: 'shippingId' })
      db.Device.belongsTo(db.OrderShipping, { foreignKey: 'shippingId' })
      db.Order.belongsTo(db.OrderShipping, { foreignKey: 'shippingId' })
      db.OrderShipping.belongsTo(db.Order, { foreignKey: 'orderId' })
      db.KitAccessoryInfo.belongsTo(db.Kit, { foreignKey: 'kitId' })
      db.KitAccessory.belongsTo(db.Kit, { foreignKey: 'kitId' })
      db.Device.belongsTo(db.Kit, { foreignKey: 'kitId' })
      db.Kit.belongsTo(db.Patient, { foreignKey: 'patientId' })
      db.Patient.belongsTo(db.Kit, { foreignKey: 'kitId' }),
      db.Kit.hasMany(db.Patient, { foreignKey: 'kitId' }),
      db.Kit.hasMany(db.Device, { foreignKey: 'kitId' }),
      db.Kit.hasMany(db.KitAccessoryInfo, { foreignKey: 'kitId' }),
      db.Logistic.belongsTo(db.Kit, { foreignKey: 'kitId' }),
      db.Kit.hasOne(db.Logistic, { foreignKey: 'kitId' }),

  //
  // db.Service.hasMany(db.Device)  g
    //  db.Accessory.hasMany(db.Device)

    db.sequelize.sync({
          alter:true,
        force:false}).catch(err=>{
          console.log(err)
          console.error(err)
        })
//db.Sequelize = Sequelize;

module.exports = db;
