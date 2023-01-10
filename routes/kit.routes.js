module.exports = app => {
     const kit = require("../controllers/kit.controller");
     var router = require("express").Router();

     router.get("/", kit.get);
     router.get("/:id", kit.getPatient);
     router.post("/create", kit.create);
     router.put("/update/:id", kit.update);
     
     app.use("/api/physician/kit", router);
};
