const { google } = require("googleapis");
const { env } = require("../config/env");

const generateOAuth2AccessToken = async () => {
  const OAuth2 = google.auth.OAuth2;

  const OAuth2_client = new OAuth2(
    env.EMAIL_CLIENT_ID,
    env.EMAIL_CLIENT_SECRET
  );

  OAuth2_client.setCredentials({ refresh_token: env.EMAIL_REFRESH_TOKEN });

  const accessToken = await OAuth2_client.getAccessToken();

  return accessToken;
};

module.exports = generateOAuth2AccessToken;
