const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  month: {
    type: String,
    required: [true, "Month is required"],
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
  },
  categories: [
    {
      name: {
        type: String,
        required: [true, "Category name is required"],
      },
      limit: {
        type: Number,
        required: [true, "Category limit is required"],
        min: [0, "Limit must be positive"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount must be positive"],
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
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Index to ensure one budget per user per month/year
BudgetSchema.index({ user_id: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);

