const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const cors = require('cors');
const { sendEmailReminder } = require('./emailService');
const { addBill, getBills, updateBill, getBillsDueThisWeek, markBillAsPaid, deleteBill, getOverdueBills } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/bills', async (req, res) => {
    const { name, category, amount_due, due_day } = req.body;
    try {
        const bill = await addBill(name, category, amount_due, due_day);
        res.status(201).send(bill);
    } catch (err) {
        res.status(500).send('Error adding bill');
    }
});

app.get('/bills', async (req, res) => {
  try {
      const bills = await getBills();
      res.status(200).json(bills);
  } catch (err) {
      console.error('Error fetching bills:', err);
      res.status(500).send(`Error fetching bills: ${err.message}`);
  }
});


app.post('/bills/:id/pay', async (req, res) => {
    const { id } = req.params;
    try {
        await markBillAsPaid(id);
        res.status(200).send('Bill marked as paid');
    } catch (err) {
        res.status(500).send('Error marking bill as paid');
    }
});

app.put('/bills/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, amount_due, due_day, is_paid } = req.body;
  try {
      await updateBill(id, { name, category, amount_due, due_day, is_paid });
      res.status(200).send('Bill updated successfully');
  } catch (err) {
      console.error('Error updating bill:', err);
      res.status(500).send(`Error updating bill: ${err.message}`);
  }
});

app.delete('/bills/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await deleteBill(id);
      res.status(200).send('Bill deleted successfully');
  } catch (err) {
      res.status(500).send('Error deleting bill');
  }
});

// Weekly reminders for upcoming bills
// cron.schedule('0 9 * * 1', async () => {
//     const bills = await getBillsDueThisWeek();
//     bills.forEach((bill) => sendEmailReminder(bill.email, bill));
// });

// // Hourly reminders for overdue bills
// cron.schedule('0 * * * *', async () => {
//     const overdueBills = await getOverdueBills();
//     overdueBills.forEach((bill) => sendEmailReminder(bill.email, bill, true));
// });

app.listen(3000, () => {
    console.log('Expense Tracker API running on port 3000');
});

