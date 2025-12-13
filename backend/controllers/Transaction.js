const asyncWrapper = require("../middleware/asyncWrapper");
const TransactionModel = require("../models/TransactionModel");
const UserModel = require("../models/UserModel");

class TransactionController {
  static getAll = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const transactions = await TransactionModel.find({
      user_id: userId,
    });
    res.json({
      data: transactions,
    });
  });
  static getTransaction = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const transaction = await TransactionModel.findById(id);

    res.json({
      data: transaction,
    });
  });
  static create = asyncWrapper(async (req, res, next) => {
    const { user_id, balance, description } = req.body;
    const transaction = await TransactionModel.create({
      user_id,
      balance,
      description,
    });
    // INCREAMENT THE JOB APPLIED NUMBER
    res.json({
      msg: "SUCCESS",
      data: transaction,
    });
  });
  static update = asyncWrapper(async (req, res, next) => {
    res.send("update");
  });
  static delete = asyncWrapper(async (req, res, next) => {
    const { Id } = req.params;
    const transaction = await TransactionModel.findByIdAndDelete(Id);
    res.status(202).json({
      data: transaction,
    });
  });
}

module.exports = TransactionController;
