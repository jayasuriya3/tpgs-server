module.exports = app => {
     const deviceList = require("../controllers/deviceList.controller.js");
     var router = require("express").Router();
     router.get("/", deviceList.getDeviceList);
     router.get("/getById", deviceList.getDeviceListById);
     router.post("/getItem", deviceList.getDeviceDetail);
     router.get("/general", deviceList.getGeneral);
     router.delete("/general/:id", deviceList.deleteGeneral);
     router.get("/getList", deviceList.getList);
     router.post("/add-1", deviceList.addDeviceBased);
     router.post("/add-2", deviceList.addDeviceGeneral);
     router.post("/upload", deviceList.upload);
     router.put("/update/:id", deviceList.update);
     // router.put("/updateService/:id", deviceList.updateService);

     app.use("/api/practice/deviceList", router);
};
