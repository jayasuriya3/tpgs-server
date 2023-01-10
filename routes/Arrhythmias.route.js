const router = require("express").Router();
const ArrhythmiasController=require('../controllers/Arrhythmias.controller');

/*  POST  localhost:5000/arrhythmias .
It will post arrhythmias data to arrhythmias table .
arrhythmiasController is a controller function to post arrhythmias  data to DB.
*/
router.post('/',ArrhythmiasController.postArrhythmias);

router.get('/',ArrhythmiasController.getArrhythmias);
module.exports = router;