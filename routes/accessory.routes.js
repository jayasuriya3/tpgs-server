module.exports = app => {
     const accessorys = require("../controllers/accessory.controller.js");
     var router = require("express").Router();
     router.get("/", accessorys.get);
     router.get("/:id", accessorys.getAccessory);
     router.post("/create", accessorys.create);
     router.post("/search", accessorys.search);
     router.put("/update/:id", accessorys.update);
     router.put("/updateAccessory/:id", accessorys.updateAccessory);

     app.use("/api/practice/accessory", router);
};
