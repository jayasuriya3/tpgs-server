module.exports = app => {
     const practices = require("../controllers/practice.controller.js");
     var router = require("express").Router();

     router.get("/practice", practices.getAllData);
     router.get("/practice/:id", practices.getData);
     router.post("/practice/create", practices.create);
     router.post("/practice/search", practices.search);
     router.post("/practice/filter", practices.filter);
     router.post("/practice/mis", practices.getMISReport);
     router.put("/practice/update/:id", practices.update);
     router.post("/practice/upload", practices.upload);

     router.get("/user/customer", practices.getCustomer);
     
     app.use("/api/customer", router);
};
