// src/controllers/expenseController.js
import pool from '../config/db.js';

export const getAllExpenses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expotable');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createExpense = async (req, res) => {
    const { category, price, date, description } = req.body;

    const formattedDate = convertDate(date);
    const formattedPrice = Number(price.split(' ')[0]);

    try {
        const result = await pool.query(
            'INSERT INTO expotable (category, price, date, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [category, formattedPrice, formattedDate, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function convertDate(date) {
    let dateSplit = date.split("-");
    return dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
}

