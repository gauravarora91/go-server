// import sendgrid, { mail as helper } from 'sendgrid'
import nodemailer from "nodemailer";
import { sendgridKey, defaultEmail } from "../../config";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "govioletwhite123@gmail.com",
    pass: "govioletwhite"
  }
});

export const sendMail = ({ fromEmail = defaultEmail, toEmail, subject, content, contentType = "text/html" }) => {
  fromEmail = fromEmail;
  toEmail = toEmail;
  content = content;
  subject = subject;

  var mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: content
  };

  const request = transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
  });

  return request;
};
