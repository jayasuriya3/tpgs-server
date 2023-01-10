const router = require("express").Router();
const EctopyController=require('../controllers/Ectopy.controller');

/*  POST  localhost:5000/arrhythmias .
It will post arrhythmias data to arrhythmias table .
arrhythmiasController is a controller function to post arrhythmias  data to DB.
*/
router.post('/',EctopyController.postEctopy);

router.get('/',EctopyController.getEctopy);
module.exports = router;