const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Expense name is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["food", "transport", "shopping", "bills", "entertainment", "other"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);

