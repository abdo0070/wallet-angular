const AuthController = require("../controllers/Auth");
const TransactionController = require("../controllers/Transaction");
const UserController = require("../controllers/Users");
const GoalController = require("../controllers/Goal");
const IncomeController = require("../controllers/Income");
const ExpenseController = require("../controllers/Expense");
const BudgetController = require("../controllers/Budget");

const router = require("express").Router();
const verifyJWT = require("../middleware/jwtVerify");

// Auth
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

// Users
router.get("/users", verifyJWT, UserController.getAll);
router.get("/users/:id", verifyJWT, UserController.singleUser);
router.put("/users", verifyJWT, UserController.update);

// Transactions
router.get("/transactions", verifyJWT, TransactionController.getAll);
router.get(
  "/transactions/:id",
  verifyJWT,
  TransactionController.getTransaction
);
router.post("/transactions", verifyJWT, TransactionController.create);
router.delete("/transactions/:Id", verifyJWT, TransactionController.delete);

// Goals
router.get("/goals/:userId", verifyJWT, GoalController.getAll);
router.get("/goals/single/:id", verifyJWT, GoalController.getGoal);
router.post("/goals", verifyJWT, GoalController.create);
router.put("/goals/:id", verifyJWT, GoalController.update);
router.delete("/goals/:id", verifyJWT, GoalController.delete);

// Incomes
router.get("/incomes/:userId", verifyJWT, IncomeController.getAll);
router.get("/incomes/single/:id", verifyJWT, IncomeController.getIncome);
router.get("/incomes/total/:userId", verifyJWT, IncomeController.getTotal);
router.post("/incomes", verifyJWT, IncomeController.create);
router.put("/incomes/:id", verifyJWT, IncomeController.update);
router.delete("/incomes/:id", verifyJWT, IncomeController.delete);

// Expenses
router.get("/expenses/:userId", verifyJWT, ExpenseController.getAll);
router.get("/expenses/single/:id", verifyJWT, ExpenseController.getExpense);
router.get("/expenses/total/:userId", verifyJWT, ExpenseController.getTotal);
router.post("/expenses", verifyJWT, ExpenseController.create);
router.put("/expenses/:id", verifyJWT, ExpenseController.update);
router.delete("/expenses/:id", verifyJWT, ExpenseController.delete);

// Budgets
router.get("/budgets/:userId", verifyJWT, BudgetController.getAll);
router.get("/budgets/single/:id", verifyJWT, BudgetController.getBudget);
router.get("/budgets/:userId/:month/:year", verifyJWT, BudgetController.getBudgetByMonth);
router.post("/budgets", verifyJWT, BudgetController.create);
router.put("/budgets/:id", verifyJWT, BudgetController.update);
router.delete("/budgets/:id", verifyJWT, BudgetController.delete);

module.exports = router;
