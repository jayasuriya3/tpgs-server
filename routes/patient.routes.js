module.exports = app => {
     const patients = require("../controllers/patient.controller");
     var router = require("express").Router();

     router.get("/", patients.get);
     router.get("/:id", patients.getPatient);
     router.post("/create", patients.create);
     router.put("/update/:id", patients.update);
     router.post("/search", patients.search);
     
     app.use("/api/physician/patient", router);
};
