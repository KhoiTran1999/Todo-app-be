const { sequelize } = require('../../database/mysql/connectMysql');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT('long'),
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    pin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    reminder: {
      type: DataTypes.DATE,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: 'white',
      allowNull: false,
    },
    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { paranoid: true },
);

module.exports = Todo;
