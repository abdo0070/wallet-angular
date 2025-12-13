const asyncWrapper = require("../middleware/asyncWrapper");
const ExpenseModel = require("../models/ExpenseModel");
const mongoose = require("mongoose");

class ExpenseController {
  // Get all expenses for a user
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    console.log(`[ExpenseController] getAll called for userId: ${userId}`);
    try {
      const expenses = await ExpenseModel.find({
        user_id: userId,
      }).sort({ created_at: -1 }); // Sort by newest first
      console.log(`[ExpenseController] Found ${expenses.length} expenses`);

      res.json({
        msg: "SUCCESS",
        data: expenses,
      });
    } catch (error) {
      console.error("[ExpenseController] getAll error:", error);
      throw error;
    }
  });

  // Get single expense by ID
  static getExpense = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const expense = await ExpenseModel.findById(id);

    if (!expense) {
      return res.status(404).json({
        msg: "Expense not found",
      });
    }

    res.json({
      msg: "SUCCESS",
      data: expense,
    });
  });

  // Create new expense
  static create = asyncWrapper(async (req, res, next) => {
    const { user_id, name, category, amount } = req.body;
    console.log(`[ExpenseController] Content type is ${req.header('Content-Type')}`);
    console.log(`[ExpenseController] create called with body:`, req.body);

    try {
      const expense = await ExpenseModel.create({
        user_id,
        name,
        category,
        amount,
      });
      console.log(`[ExpenseController] Expense created:`, expense._id);

      res.status(201).json({
        msg: "Expense created successfully",
        data: expense,
      });
    } catch (error) {
      console.error("[ExpenseController] create error details:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ msg: error.message });
      }
      throw error;
    }
  });

  // Update expense
  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, amount } = req.body;

    const expense = await ExpenseModel.findByIdAndUpdate(
      id,
      { name, category, amount },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        msg: "Expense not found",
      });
    }

    res.json({
      msg: "Expense updated successfully",
      data: expense,
    });
  });

  // Delete expense
  static delete = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const expense = await ExpenseModel.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        msg: "Expense not found",
      });
    }

    res.status(200).json({
      msg: "Expense deleted successfully",
      data: expense,
    });
  });

  // Get total expenses for a user
  static getTotal = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    console.log(`[ExpenseController] getTotal called for userId: ${userId}`);

    try {
      const result = await ExpenseModel.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalExpense = result.length > 0 ? result[0].total : 0;
      console.log(`[ExpenseController] Total expense: ${totalExpense}`);

      res.json({
        msg: "SUCCESS",
        data: { totalExpense },
      });
    } catch (error) {
      console.error("[ExpenseController] getTotal error:", error);
      return res.status(500).json({ msg: "Failed to calculate total", error: error.message });
    }
  });
}

module.exports = ExpenseController;

