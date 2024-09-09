const { Bill, Payment } = require('../models');
const sequelize = require('../config/database');

const seedDatabase = async () => {
  let attempt = 0;
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  while (attempt < MAX_RETRIES) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true }); // Recreate tables

      // Create some initial bills
      const bills = await Bill.bulkCreate([
        { name: 'Electricity', amountDue: 120.0, category: 'Utilities', dueDay: 15 },
        { name: 'Water', amountDue: 65.0, category: 'Utilities', dueDay: 10 }, // Paid this month
        { name: 'Internet', amountDue: 80.0, category: 'Communication', dueDay: 20 },
        { name: 'Rent', amountDue: 1200.0, category: 'Housing', dueDay: 1 },
        { name: 'Car Insurance', amountDue: 300.0, category: 'Insurance', dueDay: 5 }, // Paid last month
        { name: 'Phone Bill', amountDue: 50.0, category: 'Communication', dueDay: 25 },
        { name: 'Gym Membership', amountDue: 45.0, category: 'Fitness', dueDay: 10 } // Paid 2 months ago
      ]);

      // Create payments for some bills
      await Payment.bulkCreate([
        { amountPaid: 65.0, paymentDate: new Date('2024-09-02'), billId: bills[1].id }, // Paid this month
        { amountPaid: 300.0, paymentDate: new Date('2024-08-15'), billId: bills[4].id }, // Paid last month
        { amountPaid: 45.0, paymentDate: new Date('2024-07-10'), billId: bills[6].id }, // Paid 2 months ago
      ]);

      console.log('Seed data inserted successfully');
      break; // Exit loop if successful
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
      } else {
        console.error('Failed to seed database after several attempts');
      }
    }
  }
  await sequelize.close(); // Ensure database connection is closed
};

seedDatabase();
