module.exports = app => {
     const users = require("../controllers/user.controller.js");
     var router = require("express").Router();

     router.post("/login", users.login);
     router.post("/totp/generate", users.generateTOTPQR);
     router.post("/totp/verify", users.verifyTOTPCode);
     router.put("/logout", users.logout);
     app.use("/api", router);
};
