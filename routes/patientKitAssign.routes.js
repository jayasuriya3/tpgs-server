module.exports = app => {
     const patientKitAssign = require("../controllers/patientKitAssign.controller");
     var router = require("express").Router();

     router.get("/", patientKitAssign.get);
     router.get("/:id", patientKitAssign.getPatient);
     router.post("/create", patientKitAssign.create);
     router.put("/update/:id", patientKitAssign.update);
     
     app.use("/api/physician/patientKitAssign", router);
};
