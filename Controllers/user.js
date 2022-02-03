require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.js");
const User = require("../Database/Models/userModel.js");

const signUp = async (req, res) => {
  try {
    const { name, email, password: passwordRaw, confirmPassword, birthDate } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.code = 400;
      throw error;
    }
    if (passwordRaw !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.code = 400;
      throw error;
    }
    const password = await bcrypt.hash(passwordRaw, 12);

    const result = await User.create({ name, email, password, birthDate });

    const token = jwt.sign({ email: result.email, id: result._id }, JWT_SECRET, { expiresIn: "1h" });

    delete result.password;

    res.status(200).json({ result, token });
  } catch (err) {
    res.status(err.code || 500).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("User not found");
      error.code = 404;
      throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      const error = new Error("Invalid credentials");
      error.code = 400;
      throw error;
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: "1h" });

    delete existingUser.password;

    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(err.code || 500).json({ message: err.message });
  }
};

module.exports = { signUp, signIn };
