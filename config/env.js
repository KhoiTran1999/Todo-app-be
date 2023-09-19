exports.env = {
  NODE_ENV: process.env.NODE_ENV || "dev",

  PORT: process.env.PORT || 3200,

  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "todo-app",
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "khoitran990120",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_DIALECT: process.env.MYSQL_DIALECT || "mysql",

  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo-app",

  JWT_ACCESSTOKEN_PRIVATE_KEY:
    process.env.JWT_ACCESSTOKEN_PRIVATE_KEY || "accessTokenKhoitran",
  JWT_REFRESHTOKEN_PRIVATE_KEY:
    process.env.JWT_REFRESHTOKEN_PRIVATE_KEY || "refreshTokenKhoitran",
  JWT_EXPIRED_IN_ACCESSTOKEN: process.env.JWT_EXPIRED_IN_ACCESSTOKEN || "1d",
  JWT_EXPIRED_IN_REFRESHTOKEN:
    process.env.JWT_EXPIRED_IN_REFRESHTOKEN || "365d",

  EMAIL_CLIENT_ID:
    process.env.EMAIL_CLIENT_ID ||
    "278761586723-2q5obdser5frfqlrfm9or912mapo002n.apps.googleusercontent.com",
  EMAIL_CLIENT_SECRET:
    process.env.EMAIL_CLIENT_SECRET || "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",
  EMAIL_REFRESH_TOKEN:
    process.env.EMAIL_REFRESH_TOKEN ||
    "1//04duHtsit9AnBCgYIARAAGAQSNwF-L9IrL_D2v72xU2By7KJqfjxld8iETsXdWhOA6MUvDNXTtsFJNpVHHr71gJ6XM20P7hkXVOI",
  EMAIL: process.env.EMAIL || "tranquockhoi1999@gmail.com",

  SERVER_URL: process.env.SERVER_URL || "http://localhost:3200",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
