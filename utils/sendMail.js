import config from "../config.js";
import nodemailer from 'nodemailer';

export default function sendMail(to, subject, text) {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "kelectroduino@gmail.com",
          pass: config.GMAIL_CODE,
        },
    });
    const mailOptions = {
        from: "kelectroduino@gmail.com",
        to: to,
        subject: subject,
        text: text,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {

          console.log("Email sent: ", info.response);
        }
      });
    
}