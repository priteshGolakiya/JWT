const express = require("express");
const router = express.Router();
const {
  getAllUser,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const asyncHandler = require("express-async-handler");
const validateToken = require("../middlewares/validateTokenMiddleware");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Internal Server Error" });
};

router.post("/login", asyncHandler(loginUser));
router.get("/current", validateToken, asyncHandler(currentUser));
router.get("/", asyncHandler(getAllUser));
router.post("/", asyncHandler(registerUser));
router.get("/getuser/:id", asyncHandler(getUser));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

router.use(errorHandler);

module.exports = router;
