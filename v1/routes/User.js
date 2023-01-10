const Controller = require("../controller");
const router = require("express").Router();
const Authenticate=require('../../common/Authenticate')

router.post("/password-reset", Controller.User.passwordReset);
router.get("/password-reset-check/:id/:token", Controller.User.passwordResetCheck);
router.post("/password-reset-token/:userId/:token", Controller.User.passwordResetToken);

module.exports = router;