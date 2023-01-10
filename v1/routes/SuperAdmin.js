const Controller = require("../controller");
const router = require("express").Router();
const Authenticate = require("../../common/Authenticate");



router.post("/register", Controller.SuperAdmin.SuperAdminRegister);
/*
/* 
Supervisor login
*/
router.post("/login", Controller.SuperAdmin.SuperAdminLogin);

router.post("/logout", Controller.SuperAdmin.logout);

router.post("/AddCustomer", Controller.SuperAdmin.AddCustomer);
//add userAccount
router.post("/AddUserAccount", Controller.SuperAdmin.AddUser);
//all customer
router.get("/AllCustomer", Controller.SuperAdmin.AllCustomer);
//all user account
router.get("/AllUser", Controller.SuperAdmin.AllUser);
//AllAccessLog
router.get("/AllAccessLog", Controller.SuperAdmin.AllAccessLog);

//view customer by id
router.get("/viewCustomerById/:id", Controller.SuperAdmin.viewCustomerById);
//update password
router.patch("/updatePassword/:id", Controller.SuperAdmin.updatePassword);
//view user by id
router.get("/viewUserById/:id", Controller.SuperAdmin.viewUserById);

router.patch("/editDisableEnableUser/:id", Controller.SuperAdmin.editDisableEnableUser);



















module.exports = router;