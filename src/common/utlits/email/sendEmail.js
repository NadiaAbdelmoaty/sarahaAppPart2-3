import nodemailer from "nodemailer";
import { EMAIL_ADDRESS, PASSWORD } from "../../../../config/config.service.js";

export const sendingEmail = async ({
  from,
  to,
  subject,
  html,
  attachments,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `nadia <${EMAIL_ADDRESS}>`,
    to: to || "nadiameshaal@gmail.com",
    subject: subject || "Hello ✔",
    html: html || "<b>Hello world bagarabbbbbbb </b>",
    attachments: attachments || [],
  });
  console.log("Message sent:", info.messageId);
  return info.accepted.length > 0 ? true : false;
};

export const generateotp = async () => {
  return Math.floor(100000 + Math.random() * 900000);
};
