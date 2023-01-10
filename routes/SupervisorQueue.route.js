const router = require("express").Router();
const SupervisorQueueController=require('../controllers/SupervisorQueue.Controller');

/*  POST  localhost:5000/supervisorQueue .
It will post patient data to SupervisorQueue table .
postSupervisorQueue is a controller function to post supervisorQueue  data to DB.
*/
router.post('/',SupervisorQueueController.postSupervisorQueue);
router.get('/',SupervisorQueueController.getSupervisorQueue);
router.get('/:fileReview',SupervisorQueueController.getQueueByFileType);

module.exports = router;