const nodemailer = require("nodemailer");

async function send_mail(to, subject, text) {
  // to ="hayelomkiros20@gmail.com";

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true, // port for secure SMTP
    auth: {
      user: "sp17bsed@gmail.com",
      pass: "9wISqdmrY0MLCFJT",
    },
  });

  const msg = {
    // from: config.email.from,
    from: "no-reply@confidantslounge.com",
    to,

    subject,
    html: `</br><p>${text} <p>`,
  };
  // console.log("====================================");
  console.log(msg);
  // console.log("====================================");

  transporter.sendMail(msg, function (error, result) {
    if (error) {
      console.log("error:", error);
    } else {
      // console.log("result:", result);
      console.log("email connected");
    }
    transporter.close();
  });
}
const sendActivationEmail = async (user, to, token) => {
  const subject = "Account verification ";
  const activationUrl = `${process.env.CLIENT_URL}/verification?token=${token}`;
  const text = `Dear ${user.firstName + " " + user.lastName},
  To activate your account, click on this <a href=${activationUrl} >link</a>
  If you did not request any create a new account, then ignore this email.`;

  await send_mail(to, subject, text);
};

const forgotEmail = async (user, to, token) => {
  const subject = "Password Reset ";
  const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const text = `Dear ${user.email},
  To reset your password, click on this <a href=${resetPasswordURL} >link</a> and fill the above code
  If you did not request any password resets, then ignore this email.`;
  await send_mail(to, subject, text);
};

module.exports = {
  // transport,
  sendActivationEmail,
  forgotEmail,
};
