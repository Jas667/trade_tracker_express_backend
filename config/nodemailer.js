const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  // async..await is not allowed in global scope, must use a wrapper
  async passwordResetEmail(email, resetToken) {
    try {
      const info = await transporter.sendMail({
        from: {
          name: "Trade Tracker",
          address: process.env.EMAIL_USER,
        },
        to: email, // list of receivers
        subject: "Password Reset", // Subject line
        text: "Password reset code for Trade Tracker", // plain text body
        html: `<p>Below is the requested code to change your password. It will be active for 15 minutes.</br></br><b>${resetToken}</b>`,
      });
      if (info.accepted.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
