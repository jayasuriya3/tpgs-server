module.exports = app => {
     const vendors = require("../controllers/vendor.controller.js");
     var router = require("express").Router();
     router.get("/", vendors.get);
     router.get("/:id", vendors.getVendor);
     router.post("/create", vendors.create);
     router.post("/search", vendors.search);
     router.put("/updateVendor/:id", vendors.updateVendor);

     app.use("/api/practice/vendor", router);
};
