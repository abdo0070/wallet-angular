const asyncWrapper = require("../middleware/asyncWrapper");
const IncomeModel = require("../models/IncomeModel");
const mongoose = require("mongoose");

class IncomeController {
  // Get all incomes for a user
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    console.log(`[IncomeController] getAll called for userId: ${userId}`);
    try {
      const incomes = await IncomeModel.find({
        user_id: userId,
      }).sort({ created_at: -1 }); // Sort by newest first
      console.log(`[IncomeController] Found ${incomes.length} incomes`);

      res.json({
        msg: "SUCCESS",
        data: incomes,
      });
    } catch (error) {
      console.error("[IncomeController] getAll error:", error);
      throw error;
    }
  });

  // Get single income by ID
  static getIncome = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const income = await IncomeModel.findById(id);

    if (!income) {
      return res.status(404).json({
        msg: "Income not found",
      });
    }

    res.json({
      msg: "SUCCESS",
      data: income,
    });
  });

  // Create new income
  static create = asyncWrapper(async (req, res, next) => {
    const { user_id, name, category, amount } = req.body;
    console.log(`[IncomeController] Content type is ${req.header('Content-Type')}`);
    console.log(`[IncomeController] create called with body:`, req.body);

    try {
      // Validate user_id format if possible, but mongoose will do it
      const income = await IncomeModel.create({
        user_id,
        name,
        category,
        amount,
      });
      console.log(`[IncomeController] Income created:`, income._id);

      res.status(201).json({
        msg: "Income created successfully",
        data: income,
      });
    } catch (error) {
      console.error("[IncomeController] create error details:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ msg: error.message });
      }
      throw error;
    }
  });

  // Update income
  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, amount } = req.body;

    const income = await IncomeModel.findByIdAndUpdate(
      id,
      { name, category, amount },
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({
        msg: "Income not found",
      });
    }

    res.json({
      msg: "Income updated successfully",
      data: income,
    });
  });

  // Delete income
  static delete = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const income = await IncomeModel.findByIdAndDelete(id);

    if (!income) {
      return res.status(404).json({
        msg: "Income not found",
      });
    }

    res.status(200).json({
      msg: "Income deleted successfully",
      data: income,
    });
  });

  // Get total income for a user
  static getTotal = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const mongoose = require("mongoose");
    console.log(`[IncomeController] getTotal called for userId: ${userId}`);

    try {
      const result = await IncomeModel.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalIncome = result.length > 0 ? result[0].total : 0;
      console.log(`[IncomeController] Total income: ${totalIncome}`);

      res.json({
        msg: "SUCCESS",
        data: { totalIncome },
      });
    } catch (error) {
      console.error("[IncomeController] getTotal error:", error);
      // Don't crash response, just return 0 or error
      return res.status(500).json({ msg: "Failed to calculate total", error: error.message });
    }
  });
}

module.exports = IncomeController;
