import nodemailer from "nodemailer";

export const sendApprovalEmail = async (email: string, type: string) => {
  const link =
    type === "property"
      ? "http://localhost:3000/rentals"
      : type === "airline"
      ? "http://localhost:3000/myairlines"
      : "http://localhost:3000/mytours";

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Admin" <admin@yourdomain.com>`, // Change to your domain
      to: email,
      subject: "Your Registration is Approved",
      html: `<p>Congratulations! Your ${type} registration has been successfully approved.</p>
             <p>You can manage your listing <a href="${link}">here</a>.</p>`,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
