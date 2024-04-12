const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res, next) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    return res.status(404).json({ status: false, message: "No user found" });
  }
  res.status(201).json({ status: true, data: users });
};

const getUser = async (req, res, next) => {
  const id = req.params.id;
  const response = await User.findById(id);

  if (!response) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  res.status(200).json({ status: true, data: response });
};

const registerUser = async (req, res, next) => {
  let { name, email, password } = req.body;
  if (!name.trim() || !email.trim() || !password.trim()) {
    return res.status(400).send("Please add a name and password and email");
  }
  const userAvalible = await User.findOne({ email });
  if (userAvalible) {
    return res
      .status(409)
      .json({ status: false, message: "Email already in use" });
  }

  //Hash Password
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (!newUser) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error!" });
  }
  res.status(201).json({
    status: true,
    message: "User created successfully!",
    data: newUser,
  });
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedUser) {
    return res.status(404).json({
      status: false,
      message: "No user with this ID was found in the database.",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "The account has been updated",
      data: updatedUser,
    });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not Found" });
  }
  return res
    .status(200)
    .json({ status: true, message: "Deleted Successfully" });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide an email and a password",
    });
  }
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    console.log("User found:", user); 

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Email or Password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(200).json({ status: true, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const currentUser = async (req, res) => {
  res.status(200).send(req.user);
};

module.exports = {
  getAllUser,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  currentUser,
};
