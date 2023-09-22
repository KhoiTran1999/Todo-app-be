require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
require("./model/Mysql/relationship");
const express = require("express");
const app = express();
const { env } = require("./config/env");
const { connectMysql } = require("./database/mysql/connectMysql");
const morgan = require("morgan");
const authRouter = require("./router/auth");
const todoRouter = require("./router/todo");
const labelRouter = require("./router/label");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectMongo = require("./database/mongo/connectMongo");
const jwtAuth = require("./middleware/jwtAuth");

//Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      env.NODE_ENV === "production"
        ? "https://fastnote.click"
        : "http://localhost:3000",
    methods: ["GET", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
//Connect Mysql database
connectMysql().catch((err) => console.log(err));

//Connect Mongo database
connectMongo()
  .then(() => console.log("Mongo have been connected"))
  .catch((err) => console.log(err));

//Auth API
app.use("/api/v1/auth", morgan("short"), authRouter);

//Todo API
app.use("/api/v1/todo", jwtAuth, todoRouter);

//Label API
app.use("/api/v1/label", jwtAuth, labelRouter);

//Middleware
app.use(errorMiddleware);

app.listen(env.PORT, () =>
  console.log(`Server is running on https://localhost:${env.PORT}`)
);
