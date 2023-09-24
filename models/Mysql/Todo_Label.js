const { sequelize } = require('../../database/mysql/connectMysql');
const { DataTypes } = require('sequelize');
const Todo = require('./Todo');
const Label = require('./Label');
const User = require('./User');

const Todo_Label = sequelize.define(
  'Todo_Label',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    todoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Todo,
        key: 'id',
      },
    },
    labelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Label,
        key: 'id',
      },
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
  {
    indexes: [{ unique: true, fields: ['todoId', 'labelId', 'userId'] }],
  },
);

module.exports = Todo_Label;
