module.exports = app => {
    const deviceData = require("../controllers/deviceData.controller.js");
    var router = require("express").Router();
    router.get("/", deviceData.get);
    router.post("/addDevice", deviceData.AddDevice);
    router.post("/addGeneralDevice", deviceData.AddGeneralDevice);
    router.get("/getViewDevice/:vendor/:service/:accessory/:accessoryType/:serviceId/:accessoryId/:vendorId", deviceData.getViewDevice);
    router.post("/deviceDetailUpdate/:id", deviceData.deviceDetailUpdate);


    app.use("/api/practice/deviceData", router);
};
