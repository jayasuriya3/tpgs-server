const Controller = require("../controller");
const router = require("express").Router();
const Authenticate=require('../../common/Authenticate')

/*
Supervisor Register
*/
router.post("/register", Controller.DeviceLogistics.DeviceLogisticRegister);
/*
/* 
Supervisor login
*/
router.post("/login", Controller.DeviceLogistics.DeviceLogisticLogin);
//add deviceLogistic
// router.post("/LogisticHistory", Controller.DeviceLogistics.addLogisticHistory);
//add patient
router.post("/addPatient", Controller.DeviceLogistics.addPatient);
//get
router.get("/LogisticHistories/:startDate/:endDate", Controller.DeviceLogistics.logisticHistories);

//all service
router.get("/allService", Controller.AssetMaster.AllService);
//allDeviceKitSearch 
router.get("/allDeviceKitSearch/:serviceId/:accessoryId", Controller.DeviceLogistics.allDeviceKitSearch);
//get detail
router.get("/LogisticHistoryDetail/:_id", Controller.DeviceLogistics.getLogisticHistoryDetail);
//all patient Route
router.get("/allPatient", Controller.DeviceLogistics.AllPatient);
//get all kit
router.get("/allKit", Controller.DeviceLogistics.AllKit);
//all unassinged kit
router.get("/allUnassignedKit", Controller.DeviceLogistics.allUnassignedKit);
router.get("/kitDetails", Controller.DeviceLogistics.kitDetails);
//add kit
router.post("/addKit", Controller.DeviceLogistics.AddKit);
//add all searched accessory kit
router.patch("/AddAccessoryKit/:kitId", Controller.DeviceLogistics.AddAccessoryKit);
//kit accessory details
router.get("/viewKitAccessoryDetail/:kitId", Controller.DeviceLogistics.viewKitAccessoryDetail);
router.get("/viewKitAccessoryDetailCompleted/:kitId", Controller.DeviceLogistics.viewKitAccessoryDetailCompleted);
//update assign kit
router.post("/AssignKit", Controller.DeviceLogistics.AssignKit);
//Reassign Kit
router.post("/ReAssignKit", Controller.DeviceLogistics.ReAssignKit);
//get assigned kit
router.get("/AssignedKit/:assignStatus", Controller.DeviceLogistics.AssignedKit); 
//AssignedKitList
router.get("/AssignedKitList/:assignStatus", Controller.DeviceLogistics.AssignedKitList); 
router.get("/AssignedDispatchKit/:assignStatus", Controller.DeviceLogistics.AssignedDispatchKit); 
//viewKitAccessoriesDetail by kit id
router.get("/viewKitAccessoriesDetail/:id", Controller.DeviceLogistics.viewKitAccessoriesDetail);
//get patient by kit id
router.get("/viewPatientDetail/:id", Controller.DeviceLogistics.viewPatientDetail);
router.get("/getPatientDetails/:id", Controller.DeviceLogistics.getPatientDetails);
router.get("/getAssignedPatient/:startDate/:endDate", Controller.DeviceLogistics.getAssignedPatient);
//
router.get("/viewShippingDetail/:id", Controller.DeviceLogistics.viewShippingDetail);
//viewKitPatientDetail

//viewKitAccessoryDetailById 


router.get("/viewKitAccessoryDetailById/:kitId", Controller.DeviceLogistics.viewKitAccessoryDetailById);
//dispatchUpdateLogistics
router.patch("/dispatchUpdateLogistics/:kitId", Controller.DeviceLogistics.dispatchUpdateLogistics);
//deviceStatus
router.patch("/deviceStatus/:kitId", Controller.DeviceLogistics.deviceStatus);
//updateDeleteAccessoryKit
router.patch("/updateDeleteAccessoryKit/:kitId/:editedBy", Controller.DeviceLogistics.updateDeleteAccessoryKit);
//updateKitReceiveStatus
router.patch("/updateKitReceiveStatus/:kitId", Controller.DeviceLogistics.updateKitReceiveStatus);
//deviceWorkingStatusUpdate update device status from qc
router.patch("/deviceWorkingStatusUpdate/:deviceId", Controller.DeviceLogistics.deviceWorkingStatusUpdate);
//
//updateLogisticReturn
router.patch("/updateLogisticReturn/:logisticId", Controller.DeviceLogistics.updateLogisticReturn);
//get AssignedUnassignedPatient
router.get("/AssignedUnassignedPatient/:assignStatus", Controller.DeviceLogistics.AssignedUnassignedPatient);

router.get("/incompleteDeviceRefurnish/:kitReceived", Controller.DeviceLogistics.incompleteDeviceRefurnish);
//viewKitAccessoriesDeviceDetail
router.get("/viewKitAccessoriesDeviceDetail/:deviceId", Controller.DeviceLogistics.viewKitAccessoriesDeviceDetail);
//get kit by kit Id
router.get("/getKitById/:kitId", Controller.DeviceLogistics.getKitById);

router.get("/viewKitAccessoriesDeviceDetail/:deviceId", Controller.DeviceLogistics.viewKitAccessoriesDeviceDetail);
//shipped tracker
router.get("/shippedTracking/:shippingStatus", Controller.DeviceLogistics.shippedTracking);

router.get("/qualityCheckDevice/:receiveStatus", Controller.DeviceLogistics.qualityCheckDevice);
router.get("/getLogisticMinMaxYear", Controller.DeviceLogistics.getLogisticMinMaxYear);

router.get("/receiptEntryReturn/:shippingStatus/:returnStatus", Controller.DeviceLogistics.receiptEntryReturn);

router.get("/completedDevice/:startDate/:endDate", Controller.DeviceLogistics.completedDevice);
//logisticAnalysis
router.get("/logisticAnalysis/:startDate/:endDate", Controller.DeviceLogistics.logisticAnalysis);
//kit dashboard
router.get("/kitDashboard/:startDate/:endDate", Controller.DeviceLogistics.kitDashboard);
//complainSummary
router.get("/complainSummary/:startDate/:endDate", Controller.DeviceLogistics.complainSummary);
//kitAnalysis
router.get("/kitAnalysis/:startDate/:endDate", Controller.DeviceLogistics.kitAnalysis);
//kit summary
router.get("/kitSummary/:startDate/:endDate", Controller.DeviceLogistics.kitSummary);

//logisticSummary
router.get("/logisticSummary/:startDate/:endDate", Controller.DeviceLogistics.logisticSummary);
module.exports = router;
