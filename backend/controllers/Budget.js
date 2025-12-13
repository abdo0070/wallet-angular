const asyncWrapper = require("../middleware/asyncWrapper");
const BudgetModel = require("../models/BudgetModel");
const mongoose = require("mongoose");

class BudgetController {
  // Get all budgets for a user
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    console.log(`[BudgetController] getAll called for userId: ${userId}`);
    try {
      const budgets = await BudgetModel.find({
        user_id: userId,
      }).sort({ year: -1, created_at: -1 }); // Sort by newest first
      console.log(`[BudgetController] Found ${budgets.length} budgets`);

      res.json({
        msg: "SUCCESS",
        data: budgets,
      });
    } catch (error) {
      console.error("[BudgetController] getAll error:", error);
      throw error;
    }
  });

  // Get single budget by ID
  static getBudget = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const budget = await BudgetModel.findById(id);

    if (!budget) {
      return res.status(404).json({
        msg: "Budget not found",
      });
    }

    res.json({
      msg: "SUCCESS",
      data: budget,
    });
  });

  // Get budget by month and year for a user
  static getBudgetByMonth = asyncWrapper(async (req, res, next) => {
    const { userId, month, year } = req.params;
    console.log(`[BudgetController] getBudgetByMonth called for userId: ${userId}, month: ${month}, year: ${year}`);

    try {
      const budget = await BudgetModel.findOne({
        user_id: userId,
        month: month,
        year: parseInt(year),
      });

      if (!budget) {
        return res.status(404).json({
          msg: "Budget not found for this month",
          data: null,
        });
      }

      res.json({
        msg: "SUCCESS",
        data: budget,
      });
    } catch (error) {
      console.error("[BudgetController] getBudgetByMonth error:", error);
      throw error;
    }
  });

  // Create new budget
  static create = asyncWrapper(async (req, res, next) => {
    const { user_id, month, year, categories, totalAmount } = req.body;
    console.log(`[BudgetController] Content type is ${req.header('Content-Type')}`);
    console.log(`[BudgetController] create called with body:`, req.body);

    try {
      // Check if budget already exists for this month/year
      const existingBudget = await BudgetModel.findOne({
        user_id: user_id,
        month: month,
        year: year,
      });

      if (existingBudget) {
        return res.status(400).json({
          msg: "Budget already exists for this month. Please update the existing budget instead.",
        });
      }

      const budget = await BudgetModel.create({
        user_id,
        month,
        year: year || new Date().getFullYear(),
        categories,
        totalAmount,
      });
      console.log(`[BudgetController] Budget created:`, budget._id);

      res.status(201).json({
        msg: "Budget created successfully",
        data: budget,
      });
    } catch (error) {
      console.error("[BudgetController] create error details:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ msg: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({ msg: "Budget already exists for this month and year" });
      }
      throw error;
    }
  });

  // Update budget
  static update = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { month, year, categories, totalAmount } = req.body;

    const budget = await BudgetModel.findByIdAndUpdate(
      id,
      { 
        month, 
        year, 
        categories, 
        totalAmount,
        updated_at: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        msg: "Budget not found",
      });
    }

    res.json({
      msg: "Budget updated successfully",
      data: budget,
    });
  });

  // Delete budget
  static delete = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const budget = await BudgetModel.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({
        msg: "Budget not found",
      });
    }

    res.status(200).json({
      msg: "Budget deleted successfully",
      data: budget,
    });
  });
}

module.exports = BudgetController;

