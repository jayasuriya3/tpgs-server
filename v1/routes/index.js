const router = require("express").Router();
//const TechnicianRoutes = require("./Technician");
//const SupervisorRoutes = require("./Supervisor");
const DeviceLogisticRoutes = require("./DeviceLogistics");
const AssetMasterRoutes = require("./AssetMaster");
const superAdminRoutes = require("./SuperAdmin");
const UserRoutes = require("./User")
//router.use("/technician", TechnicianRoutes)
//router.use("/supervisor", SupervisorRoutes)
router.use("/user", UserRoutes)
router.use("/deviceLogistics", DeviceLogisticRoutes)
router.use("/assetMaster", AssetMasterRoutes)
router.use("/superAdmin", superAdminRoutes)

module.exports = router;