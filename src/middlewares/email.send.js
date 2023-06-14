// "use strict";
// const nodemailer = require("nodemailer");

// async function sendConfirmationEmail(user) {

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.SEND_EMAIL,
//       pass: process.env.PASS_SEND_EMAIL,
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: process.env.SEND_EMAIL,
//     to: user.email, // list of receivers
//     subject: "geohabit ✔", // Subject line
//   });

//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }



// module.exports = { sendConfirmationEmail };

const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

// async function sendConfirmationEmail(user) {
//   const templatePath = path.join(__dirname, "templates/verificacionEmail.html");
//   const template = fs.readFileSync(templatePath, "utf-8");
//   const confirmationLink = process.env.URL_CONFIRMA_EMAIL;
//   const html = template.replace("{{nameUsu}}", user.nombres ? user.nombres : user.username).replace("{{urlConfirm}}", confirmationLink);

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.SEND_EMAIL,
//       pass: process.env.PASS_SEND_EMAIL,
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: process.env.SEND_EMAIL,
//     to: user.email,
//     subject: "Confirmación de Email",
//     html: html,
//   });

//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }

async function sendConfirmationEmail(user) {
  const templatePath = path.join(__dirname, "templates/verificacionEmail.html");
  const template = fs.readFileSync(templatePath, "utf-8");
  const confirmationLink = `${process.env.URL_CONFIRMA_EMAIL}/${user._id}`;
  const html = template.replace("{{nameUsu}}", user.nombres ? user.nombres : user.username).replace("{{urlConfirm}}", confirmationLink);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.PASS_SEND_EMAIL,
    },
  });

  const logoImagePath = path.join(__dirname, "templates/assets/images/logoPcGeo.png");

  // read the logo image file
  const logoImage = fs.readFileSync(logoImagePath, { encoding: "base64" });

  // add the logo image as an embedded image in the email
  const attachments = [
    {
      filename: "logoPcGeo.png",
      content: logoImage,
      encoding: "base64",
      cid: "logo@pcgeo.com",
    },
  ];

  // replace the image URL placeholder with the CID value
  const htmlWithImage = html.replace("{{URL_IMAGEN}}", "cid:logo@pcgeo.com");

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.SEND_EMAIL,
    to: user.email,
    subject: "Confirmación de Email",
    html: htmlWithImage,
    attachments: attachments,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


module.exports = { sendConfirmationEmail };

