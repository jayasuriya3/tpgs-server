//const Model = require("../../model/index");
const bcrypt = require("bcryptjs");
//const Validation = require("../validations/Technician");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Joi = require("joi");
const crypto = require("crypto");
//password reset with mail sending
const sendEmail = require("../../utils/sendMail");

module.exports.passwordReset= async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
  
        const user = await Model.User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
  
        let token = await Model.Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Model.Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }
  
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);
  
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
  };


 //password reset token  
  module.exports.passwordResetToken= async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        console.log(error)
        if (error) return res.status(400).send(error.details[0].message);
  
        const user = await Model.User.findById(req.params.userId);
        console.log(user)
        if (!user) return res.status(400).send("invalid link or expired");
  console.log("user_id",user._id,"token",req.params.token)
        const token =  Model.Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        console.log("token",token)
        if (!token) return res.status(400).send("Invalid link or expired");
        const salt = await bcrypt.genSalt(10);
        //console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        console.log(hashedPassword)
        await user.save();
        await token.delete();
  
        res.send("password reset sucessfully.");
    } catch (error) {
        console.log(error)
        res.send("An error occured");
        console.log(error);
    }
  };
  //get password reset and check url valid or not
  module.exports.passwordResetCheck= async (req, res) => {
	try {
    
		const user = await Model.User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Model.Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
};