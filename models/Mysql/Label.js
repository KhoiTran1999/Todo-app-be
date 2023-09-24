const { sequelize } = require('../../database/mysql/connectMysql');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Label = sequelize.define('Label', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Label;
