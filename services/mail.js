const nodemailer = require("nodemailer");
const generateOAuth2AccessToken = require("../utiles/generateOAuth2AccessToken");
const { env } = require("../config/env");

class EmailService {
  constructor() {
    this.initTransporter();
  }
  initTransporter() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        clientId: env.EMAIL_CLIENT_ID,
        clientSecret: env.EMAIL_CLIENT_SECRET,
      },
    });
  }

  async sendMail({ to, subject, text, html }) {
    const accessToken = await generateOAuth2AccessToken();
    this.transporter.sendMail({
      from: "KhoiTran - TodoApp",
      to,
      subject,
      text,
      html,
      auth: {
        user: env.EMAIL,
        refreshToken: env.EMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });
  }
}

module.exports = new EmailService();
