const express = require('express');
const router = express.Router();
const { Bill, Payment } = require('../models');
const { Op } = require('sequelize');

// Create a new bill
router.post('/', async (req, res) => {
  const { name, amountDue, category, dueDay } = req.body;
  try {
    const bill = await Bill.create({ name, amountDue, category, dueDay });
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

// Get all bills (Only show unpaid or paid this month)
router.get('/', async (req, res) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  try {
    const bills = await Bill.findAll({
      include: {
        model: Payment,
        where: {
          [Op.or]: [
            { paymentDate: { [Op.between]: [startOfMonth, endOfMonth] } },
            { paymentDate: null }
          ]
        },
        required: false
      }
    });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bills' });
  }
});

// Update a bill
router.put('/:billId', async (req, res) => {
  const { billId } = req.params;
  const { name, amountDue, category, dueDay } = req.body;

  try {
    const bill = await Bill.findByPk(billId);
    if (bill) {
      bill.name = name || bill.name;
      bill.amountDue = amountDue || bill.amountDue;
      bill.category = category || bill.category;
      bill.dueDay = dueDay || bill.dueDay;

      await bill.save();
      res.status(200).json(bill);
    } else {
      res.status(404).json({ error: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bill' });
  }
});

// Add a payment to a bill
router.post('/:billId/payments', async (req, res) => {
  const { billId } = req.params;
  const { amountPaid, paymentDate } = req.body;
  try {
    const payment = await Payment.create({ amountPaid, paymentDate, billId });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Get payments for a bill
router.get('/:billId/payments', async (req, res) => {
  const { billId } = req.params;
  try {
    const payments = await Payment.findAll({ where: { billId } });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
});

// Mark a bill as paid
router.post('/:billId/pay', async (req, res) => {
  const { billId } = req.params;
  const { amountPaid, paymentDate } = req.body;

  try {
    // Find the bill
    const bill = await Bill.findByPk(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Create a new payment
    const payment = await Payment.create({
      amountPaid,
      paymentDate,
      billId
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a bill
router.delete('/:billId', async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findByPk(billId);
    if (bill) {
      await bill.destroy();
      res.status(200).json({ message: 'Bill deleted' });
    } else {
      res.status(404).json({ error: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

module.exports = router;
