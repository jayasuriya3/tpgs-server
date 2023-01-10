module.exports = app => {
     const service = require("../controllers/service.controller");
     var router = require("express").Router();

     router.get("/", service.get);
     router.get("/:id", service.getPatient);
     router.post("/create", service.create);
     router.put("/update/:id", service.update);
     
     app.use("/api/physician/service", router);
};

