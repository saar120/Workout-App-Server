const express = require("express");
const { signIn, signUp } = require("../Controllers/user.js");

const userRouter = express.Router();

userRouter.post("/signIn");
userRouter.post("/signUp");

module.exports = userRouter;
