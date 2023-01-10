const router = require("express").Router();
const ReferingPhysicianController=require('../controllers/ReferingPhysician.controller');

/*  POST  localhost:5000/referingPhysician .
It will post patient data to referingPhysician table .
ReferingPhysicianController is a controller function to post referingPhysician  data to DB.
*/
router.post('/',ReferingPhysicianController.postReferingPhysician);
router.get('/',ReferingPhysicianController.getReferingPhysician);


module.exports = router;