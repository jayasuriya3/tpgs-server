const Controller = require("../controller");
const router = require("express").Router();
const Authenticate = require("../../common/Authenticate");

/*
Supervisor Register
*/
//get assetmaster role
router.get(
  "/assetMasterRole",
  Authenticate.verifyJWT,
  Controller.AssetMaster.assetMasterRole
);

router.post("/register", Controller.AssetMaster.AssetMasterRegister);
/*
/* 
Supervisor login
*/
router.post("/login", Controller.AssetMaster.AssetMasterLogin);
//add service
router.post("/addService", Authenticate.verifyJWT,Controller.AssetMaster.AddService);
router.get("/allService", Controller.AssetMaster.AllService);
//count device
router.get("/countDevice/:startDate/:endDate",Controller.AssetMaster.countDevice);
//vendor count
router.get("/countVendor", Controller.AssetMaster.countVendor);

router.get("/OrderSummary/:startDate/:endDate",Controller.AssetMaster.OrderSummary);
//orderTrend
router.get("/orderTrend/:startDate/:endDate/:currentMonth", Controller.AssetMaster.orderTrend);
//device analysis
router.get("/deviceAnalysis/:startDate/:endDate",Controller.AssetMaster.deviceAnalysis);
//ClosedOrderCount
router.get("/ClosedOrderCount",Authenticate.verifyJWT, Authenticate.verifyAssetMaster,Controller.AssetMaster.ClosedOrderCount);
//getDeviceStatusAnalysis available device count
router.get("/getDeviceStatusAnalysis/:startDate/:endDate",Authenticate.verifyJWT, Authenticate.verifyAssetMaster,Controller.AssetMaster.getDeviceStatusAnalysis);
//add accessory
router.post("/addAccessory",Authenticate.verifyJWT, Controller.AssetMaster.AddAccessory);
//add general device

router.post("/addGeneralDevice", Authenticate.verifyJWT,Controller.AssetMaster.AddGeneralDevice);
//router.get("/deleteAccessory",Controller.AssetMaster.deleteAccessory);
//add device by asset master
router.post("/addDevice",Authenticate.verifyJWT, Controller.AssetMaster.AddDevice);
//AddExcelDevice
router.post("/AddExcelGeneralDevice",Authenticate.verifyJWT, Controller.AssetMaster.AddExcelGeneralDevice);
router.patch("/AddExcelServiceDevice/:serviceId/:accessoryId/:vendorId",Authenticate.verifyJWT, Controller.AssetMaster.AddExcelServiceDevice);
router.post("/addVendor",Authenticate.verifyJWT, Controller.AssetMaster.AddVendor);
//view device by device vendor
router.get("/getViewDevice/:vendor/:service/:accessory/:accessoryType/:serviceId/:accessoryId/:vendorId",Authenticate.verifyJWT, Controller.AssetMaster.getViewDevice);
//get defective device
router.get("/getDefectiveDevice/:vendor/:service/:accessory/:accessoryType/:serviceId/:accessoryId/:vendorId",Authenticate.verifyJWT, Controller.AssetMaster.getDefectiveDevice);
//getallVendor
router.get("/allVendor", Controller.AssetMaster.AllVendor);
//all accessory
router.get("/allAccessory",Controller.AssetMaster.AllAccessory);
//all service list
router.get("/AllServiceList", Controller.AssetMaster.AllServiceList);
//all accessory list in accessory page
router.get("/AllAccessoryList", Controller.AssetMaster.AllAccessoryList);
//all customer
router.get("/allCustomer", Controller.AssetMaster.AllCustomer);
//get count device
router.post("/getCountDevice", Controller.AssetMaster.getCountDevice);
//post device count
router.get("/DeviceGroup/:serviceId/:accessoryId/:accessory", Authenticate.verifyJWT,Controller.AssetMaster.DeviceGroup);
//get all devices list
router.get("/DeviceGroupListAll", Controller.AssetMaster.DeviceGroupList);
//get one  vendor
router.get("/vendorDetail/:id",Authenticate.verifyJWT, Controller.AssetMaster.getOneVendor);
//get one accessory detail
router.get("/accessoryDetail/:id",Authenticate.verifyJWT, Controller.AssetMaster.getOneAccessory);
//service detail
router.get("/serviceDetail/:id", Authenticate.verifyJWT,Controller.AssetMaster.serviceDetail);
//edit a single vendor
router.patch("/editVendor/:id",Authenticate.verifyJWT, Controller.AssetMaster.editVendor);

router.patch("/deleteDeviceAccessory/:id/:deviceId/:ordersId", Authenticate.verifyJWT,Controller.AssetMaster.deleteDeviceAccessory);

router.patch("/deviceDetailUpdate/:id",Authenticate.verifyJWT, Controller.AssetMaster.deviceDetailUpdate);
//edit accessory done
router.patch("/editAccessory/:id",Authenticate.verifyJWT, Controller.AssetMaster.editAccessory);
//edit disable service
router.patch("/editDisableEnableService/:id",Authenticate.verifyJWT, Controller.AssetMaster.editDisableEnableService);
//edit enable disable accessory
router.patch("/editDisableEnableAccessory/:id",Authenticate.verifyJWT, Controller.AssetMaster.editDisableEnableAccessory);
//edit service
router.patch("/editService/:id",Authenticate.verifyJWT, Controller.AssetMaster.editService);

router.get("/getContactByName/:term", Authenticate.verifyJWT,Controller.AssetMaster.getContactByName);
//get one device details by id
router.get("/getOneDeviceDetails/:id",Authenticate.verifyJWT, Controller.AssetMaster.getOneDevice);
router.get("/getViewAccessory/:deviceId",Authenticate.verifyJWT, Controller.AssetMaster.getViewAccessory);
router.patch("/AddAccessoryList/:customerId/:ordersId", Authenticate.verifyJWT,Controller.AssetMaster.AddAccessoryList);
//accessory info group by vendor
router.get("/accessoryInfoGroup/:customerId/:ordersId",Authenticate.verifyJWT, Controller.AssetMaster.accessoryInfoGroup);
//accessory info device on dropdown click
router.post("/getAccessoryInfoDevice",Authenticate.verifyJWT, Controller.AssetMaster.getAccessoryInfoDevice);
//get order info device
router.post("/getOrderInfoDevice",Authenticate.verifyJWT, Controller.AssetMaster.getOrderInfoDevice);
//order page
router.get("/getAccessoryInfoDevice/:id",Authenticate.verifyJWT, Controller.AssetMaster.getOrderAccessoryInfoDevice);
//router.get("/getAssignAccessoryInfoDevice/:customerId/:ordersId",Authenticate.verifyJWT, Controller.AssetMaster.getAssignAccessoryInfoDevice);
//assign device
router.get("/getAssignAccessoryInfoDevice/:ordersId",Authenticate.verifyJWT, Controller.AssetMaster.getAssignAccessoryInfoDevice);
//post orders
router.post("/postOrders",Authenticate.verifyJWT, Authenticate.verifyJWT,Controller.AssetMaster.postOrders);
router.post("/updateOrder",Authenticate.verifyJWT, Authenticate.verifyJWT,Controller.AssetMaster.updateOrder);
//all order
router.get("/AllOrder", Controller.AssetMaster.AllOrder);
//getMinMaxYear
router.get("/getMinMaxYear",Authenticate.verifyJWT, Controller.AssetMaster.getMinMaxYear);
//ClosedReturnUpdate
router.patch("/ClosedReturnUpdate/:shippingOrderId",Authenticate.verifyJWT, Controller.AssetMaster.ClosedReturnUpdate);
//get customer and accessory info by orderId
router.post("/orderDetails",Authenticate.verifyJWT, Controller.AssetMaster.orderDetails);
//allDeviceSearch
router.get("/allDeviceSearch/:serviceId/:accessoryId/:accessory",Authenticate.verifyJWT, Controller.AssetMaster.allDeviceSearch);
//get customer detail by order
router.get("/orderCustomerDetails/:customerId",Authenticate.verifyJWT, Controller.AssetMaster.orderCustomerDetails);
//get assigned device

router.get("/assignedDevice/:vendor/:service/:accessory/:accessoryType/:serviceId/:accessoryId/:vendorId",Authenticate.verifyJWT, Controller.AssetMaster.assignedDevice);
//postShipping
router.post("/postShipping",Authenticate.verifyJWT, Controller.AssetMaster.postShipping);
//close order
router.get("/CloseOrder", Controller.AssetMaster.CloseOrder);
//get shipping detail
router.get("/shippingDetail/:shippingOrderId",Authenticate.verifyJWT, Controller.AssetMaster.shippingDetail);
//all patient get route

module.exports = router;
