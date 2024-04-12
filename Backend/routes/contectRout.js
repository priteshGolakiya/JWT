const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController.js");
const validateToken = require("../middlewares/validateTokenMiddleware.js");

const asyncHandler = require("express-async-handler");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Internal Server Error" });
};

router.use(validateToken);

router
  .route("/")
  .get(asyncHandler(getAllContacts))
  .post(asyncHandler(createContact));

router
  .route("/:id")
  .get(asyncHandler(getContact))
  .put(asyncHandler(updateContact))
  .delete(asyncHandler(deleteContact));

router.use(errorHandler);

module.exports = router;
