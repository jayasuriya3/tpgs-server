module.exports = app => {
     const users = require("../controllers/user.controller.js");
     var router = require("express").Router();

     router.get("/", users.getAllData);
     router.get("/:id", users.getData);
     router.post("/create", users.create);
     router.post("/search", users.search);
     router.post("/validateUsernameContact", users.validateUsernameContact);
     router.post("/searchAccessLog", users.searchAccessLog);
     // router.post("/searchFilter", users.searchFilter);
     router.post("/getFilter", users.getFilter);
     router.get("/get/getAccessLog", users.getAccessLog);
     router.post("/filter", users.filter); 
     router.post("/assign", users.assign);
     router.put("/resetPassword/:id", users.resetPassword);
     router.put("/update/:id", users.update);
     router.post("/assign", users.assign);
     router.post("/getAssign", users.getAssign);
     router.post("/customer/assign", users.customerAssign);
     router.get("/assigned/physician", users.getPhysician);
     router.get("/customer/getAssign", users.getCustomerAssignedIds);
     router.post("/practiceGetAssign", users.practiceGetAssign);
     
     app.use("/api/practice/user", router);
};
