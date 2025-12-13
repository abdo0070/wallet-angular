const AuthController = require("../controllers/Auth");
const TransactionController = require("../controllers/Transaction");
const UserController = require("../controllers/Users");

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

module.exports = router;
