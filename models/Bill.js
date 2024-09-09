const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bill = sequelize.define('Bill', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amountDue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bills',
  timestamps: true,
});

module.exports = Bill;
