const { Sequelize } = require('sequelize');
const { env } = require('../../config/env');

const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USERNAME,
  env.MYSQL_PASSWORD,
  {
    port: 3306,
    host: env.MYSQL_HOST,
    dialect: env.MYSQL_DIALECT,
    logging: false,
  },
);

module.exports = { sequelize };
