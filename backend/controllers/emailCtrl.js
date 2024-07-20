import nodemailer from "nodemailer";
import errorHandler from "express-async-handler";

export const sendEmail = errorHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MP,
    },
  });
  const info = await transporter.sendMail({
    // from: '"Hii 👻" <rasheedahsan786@gmail.com.com>', // sender address
    from: '"Hii 👻" <PakistanTopStore.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line    // from: '"Hii 👻" <rasheedahsan786@gmail.com.com>', // sender address

    text: data.text, // plain text body
    html: data.htm, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  console.log("Preview URL : %s", nodemailer.getTestMessageUrl(info));
});
