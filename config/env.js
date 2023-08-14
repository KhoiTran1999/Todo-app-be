exports.env = {
  PORT: process.env.PORT || 3200,

  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "todo-app",
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "khoitran990120",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_DIALECT: process.env.MYSQL_DIALECT || "mysql",

  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo-app",

  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "khoitran123",
  JWT_EXPIRED_IN: process.env.JWT_EXPIRED_IN || "1d",

  EMAIL_CLIENT_ID:
    process.env.EMAIL_CLIENT_ID ||
    "278761586723-2q5obdser5frfqlrfm9or912mapo002n.apps.googleusercontent.com",
  EMAIL_CLIENT_SECRET:
    process.env.EMAIL_CLIENT_SECRET || "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",
  EMAIL_REFRESH_TOKEN:
    process.env.EMAIL_REFRESH_TOKEN ||
    "1//04Stm96ITP0D_CgYIARAAGAQSNwF-L9Ir1HFd09Eom4Y6LU7eXgwfrdHQnYPnekF6pM7VeBNcfnfvaXKB3Sv-KZTbKA6RfpNpSls",
  EMAIL: process.env.EMAIL || "tranquockhoi1999@gmail.com",

  SERVER_URL: process.env.SERVER_URL || "http://localhost:3200",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
