const { env } = require('./env');

module.exports = {
  development: {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: env.MYSQL_DIALECT,
  },
  test: {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect: env.MYSQL_DIALECT,
  },
  production: {
    username: 'root',
    password: 'khoitran990120',
    database: 'mysql',
    host: 'mysql',
    dialect: 'mysql',
  },
};
