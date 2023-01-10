const { GeneralError, BadRequest, NotFound } = require("../utils/errors");
module.exports.handleErrors = async (err , req, res, next) => {
    console.log("handler", err.message)
  res.status(err.status || 500);
  res.json({ "err": true,"name":err.name, "message": err.message || "internal server err" });
//   if (err instanceof GeneralError) {
//       code = err.getCode();
//       return res.status(code).json({
//           "name": err.name, "message": err.message
//       });

//   }

//   let correlationId = req.headers['x-correlation-id'];
//   return res.status(500).json({
//       name: 'Internal Server err', message: err.message
//   });
};
