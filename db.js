const { Pool } = require('pg');
const pool = new Pool({
    user: 'youruser',
    host: 'db',
    database: 'expensetracker',
    password: 'yourpassword',
    port: 5432,
});

const addBill = async (name, category, amount_due, due_day) => {
    const query = `INSERT INTO bills (name, category, amount_due, due_day) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [name, category, amount_due, due_day];
    const result = await pool.query(query, values);

    return result.rows[0];
};

const getBills = async () => {
  try {
      const query = `SELECT * FROM bills ORDER BY due_day ASC`;
      const result = await pool.query(query);
      return result.rows;
  } catch (err) {
      console.error('Error querying bills:', err);  // Log the error for debugging
      throw err;  // Throw the error to ensure it's caught properly
  }
};

const getBillsDueThisWeek = async () => {
    const today = new Date().getDate();
    const query = `
        SELECT * FROM bills 
        WHERE due_day >= $1 
        AND due_day <= $2 
        AND is_paid = false
    `;
    const values = [today, today + 7];
    const result = await pool.query(query, values);
    return result.rows;
};

const markBillAsPaid = async (id) => {
    const query = `UPDATE bills SET is_paid = true WHERE id = $1`;
    await pool.query(query, [id]);
};

const getOverdueBills = async () => {
    const today = new Date().getDate();
    const query = `
        SELECT * FROM bills 
        WHERE due_day < $1 
        AND is_paid = false
    `;
    const result = await pool.query(query, [today]);
    return result.rows;
};

const updateBill = async (id, { name, category, amount_due, due_day, is_paid }) => {
  try {
    const query = `
    UPDATE bills 
    SET name = $1, category = $2, amount_due = $3, due_day = $4, is_paid = $5 
    WHERE id = $6
    `;
    const values = [name, category, amount_due, due_day, is_paid, id];
    const result = await pool.query(query, values);
  } catch (err) {
    console.error('Error updating bill:', err);  // Log the error for debugging
    throw err;  // Throw the error to ensure it's caught properly
}
};

const deleteBill = async (id) => {
    const query = `DELETE FROM bills WHERE id = $1`;
    await pool.query(query, [id]);
};

module.exports = { addBill, getBills, getBillsDueThisWeek, markBillAsPaid, getOverdueBills, updateBill, deleteBill };
