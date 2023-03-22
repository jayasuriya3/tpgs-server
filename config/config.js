require('dotenv').config();
{
  module.exports = {

  "development": {
    "username": process.env.DB_DEV_USERNAME,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV_DATABASE,
    "port":process.env.DB_DEV_PORT,
    "host": process.env.DB_DEV_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
       "ssl": {
         "require": true,
         "rejectUnauthorized": false
       }
     }
   }
}
}