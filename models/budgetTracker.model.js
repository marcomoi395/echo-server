const mongoose = require("mongoose");

const budgetTracker = new mongoose.Schema({
    userId: String,
    description: String,
    amount: Number,
    type: String,
    date: Date,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date
}, {
    timestamps: true,
},);

const BudgetTracker = mongoose.model("BudgetTracker", budgetTracker, "budget-tracker");

module.exports = BudgetTracker;
