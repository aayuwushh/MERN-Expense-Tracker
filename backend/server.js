const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allowing React

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/expense_tracker')
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ DB Error:", err));

// 2. Schema (Table Design)
const expenseSchema = new mongoose.Schema({
    date: String,
    category: String,
    amount: Number,
    description: String
});

const Expense = mongoose.model('Expense', expenseSchema);

// 3. API Routes

// Add Expense
app.post('/add', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        await newExpense.save();
        res.json({ message: "Saved" });
    } catch (e) {
        console.log("❌ Error Saving Data:", e.message); 
        res.status(500).json({ error: e.message });
    }
});

// Get All Expenses
app.get('/get', async (req, res) => {
    const expenses = await Expense.find().sort({ _id: -1 });
    res.json(expenses);
});

// Delete Expense
app.delete('/delete/:id', async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on Port 5000");
});
