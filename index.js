require("dotenv").config();
const express = require("express");
const app = express();
const { env } = require("./config/env");
const { connectMysql } = require("./database/mysql/connectMysql");
const morgan = require("morgan");
const authRouter = require("./router/auth");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectMongo = require("./database/mongo/connectMongo");

//Middleware
app.use(express.json());
app.use(morgan("short"));
app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.use(cookieParser());

//Connect Mysql database
connectMysql().catch((err) => console.log(err));

//Connect Mongo database
connectMongo()
  .then(() => console.log("Mongo have been connected"))
  .catch((err) => console.log(err));

//Auth API
app.use("/api/v1/auth", authRouter);

//Middleware
app.use(errorMiddleware);

app.listen(env.PORT, () =>
  console.log(`Server is running on https://localhost:${env.PORT}`)
);
