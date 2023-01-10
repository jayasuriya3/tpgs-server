const router = require("express").Router();
//const InterimReport = require("../models/InterimReport");
const InterimReportController=require('../controllers/InterimReport.controller')


/*  GET  localhost:5000/InterimReport .It will get InterimReport data from InterimReport
table .getInterimReport is a controller function to get data from DB.
*/
router.get('/',InterimReportController.getInterimReport);
/*
get a InterimReport details by eventID.
GET  localhost:5000/InterimReport/eventID

*/

/*  POST  localhost:5000/InterimReport .
It will post InterimReport data to InterimReport table .
postInterimReport is a controller function to post InterimReport  data to DB.
*/
router.post('/',InterimReportController.postInterimReport);



module.exports = router;
