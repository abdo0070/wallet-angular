const errorHandler = require("./errorHandler");

const asyncWrapper = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  };
};

module.exports = asyncWrapper;
