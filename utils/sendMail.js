const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    
    
    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
          
            port: 587,
           
            auth: {
                user: "fmfahim1202@gmail.com",
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: 'fmfahim1202@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;