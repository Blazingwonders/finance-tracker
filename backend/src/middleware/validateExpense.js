// src/middleware/validateExpense.js
export const validateExpense = (req, res, next) => {
    const { category, price, date, description } = req.body;
    const errors = [];

    console.log(req.body);

    // Check required fields
    if (!price) errors.push('Amount is required');
    if (!category) errors.push('Category is required');
    if (!date) errors.push('Date is required');

    const amount = Number(price.split(' ')[0]);

    // Validate amount
    if (typeof amount !== 'number') {
        errors.push('Amount must be a number : ' + price + " | " + amount);
    } else if (amount <= 0) {
        errors.push('Amount must be greater than 0');
    }

    // Validate date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (date && !dateRegex.test(date)) {
        errors.push('Date must be in YYYY-MM-DD format');
    }

    // Validate category
    const validCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Clothing', 'Other'];
    if (category && !validCategories.includes(category)) {
        errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    // Check description length
    if (description && description.length > 200) {
        errors.push('Description must be less than 200 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};