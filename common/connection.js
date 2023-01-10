const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;
require("dotenv").config();
module.exports.mongodb = async () => {
 
  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.myrxm.mongodb.net:27017,cluster0-shard-00-01.myrxm.mongodb.net:27017,cluster0-shard-00-02.myrxm.mongodb.net:27017/?ssl=true&replicaSet=atlas-3a1elw-shard-0&authSource=admin&retryWrites=true&w=majority`,
    {
        useUnifiedTopology: true,
       
            useNewUrlParser: true,
    },
    (error, result) => {
      error ? console.error("Mongo Error",error) : console.log("Mongo Connected");
    }
  );
};

const { Sequelize } = require('sequelize');
if(process.env.NODE_ENV==='development'){
const sequelize = new Sequelize('pulse-gate-suite', 'postgres', 'password', {
  host: '127.0.0.1',
  dialect: 'postgres'/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
try {
   sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
if(process.env.NODE_ENV==='production'){
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  host: process.env.DB_HOST_PROD,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  dialect: 'postgres'/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
try {
   sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
