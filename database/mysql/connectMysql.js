const { Sequelize } = require("sequelize");
const { env } = require("../../config/env");

const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USERNAME,
  env.MYSQL_PASSWORD,
  {
    host: env.MYSQL_HOST,
    dialect: env.MYSQL_DIALECT,
  }
);

const connectMysql = async () => {
  await sequelize.sync({ logging: false });
  console.log("Mysql database have been connected");
};

module.exports = { connectMysql, sequelize };
