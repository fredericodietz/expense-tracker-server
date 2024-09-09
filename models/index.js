const Bill = require('./Bill');
const Payment = require('./Payment');

Bill.hasMany(Payment, { foreignKey: 'billId' });
Payment.belongsTo(Bill, { foreignKey: 'billId' });

module.exports = { Bill, Payment };
