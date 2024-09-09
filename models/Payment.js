const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bill = require('./Bill');

const Payment = sequelize.define('Payment', {
  amountPaid: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  billId: {
    type: DataTypes.INTEGER,
    references: {
      model: Bill,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

Bill.hasMany(Payment, { foreignKey: 'billId' });
Payment.belongsTo(Bill, { foreignKey: 'billId' });

module.exports = Payment;
