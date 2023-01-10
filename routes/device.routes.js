module.exports = app => {
     const devices = require("../controllers/device.controller.js");
     var router = require("express").Router();
     router.get("/", devices.get);
     router.get("/:id", devices.getDevice);
     router.post("/create", devices.create);
     router.put("/update/:id", devices.update);
     router.put("/updateService/:id", devices.updateService);

     app.use("/api/practice/device", router);
};
