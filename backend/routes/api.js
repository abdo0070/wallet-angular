const AuthController = require("../controllers/Auth");
const TransactionController = require("../controllers/Transaction");
const UserController = require("../controllers/Users");
const GoalController = require("../controllers/Goal");

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

module.exports = router;
