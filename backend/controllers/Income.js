const asyncWrapper = require("../middleware/asyncWrapper");
const IncomeModel = require("../models/IncomeModel");
const mongoose = require("mongoose");

class IncomeController {
  // Get all incomes for a user
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const incomes = await IncomeModel.find({
      user_id: userId,
    }).sort({ created_at: -1 }); // Sort by newest first
    
    res.json({
      msg: "SUCCESS",
      data: incomes,
    });
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
    
    const income = await IncomeModel.create({
      user_id,
      name,
      category,
      amount,
    });
    
    res.status(201).json({
      msg: "Income created successfully",
      data: income,
    });
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
    
    const result = await IncomeModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    
    const totalIncome = result.length > 0 ? result[0].total : 0;
    
    res.json({
      msg: "SUCCESS",
      data: { totalIncome },
    });
  });
}

module.exports = IncomeController;
