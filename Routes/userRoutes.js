const express = require("express");
const { signIn, signUp } = require("../Controllers/user.js");

const userRouter = express.Router();

userRouter.post("/signIn", signIn);
userRouter.post("/signUp", signUp);

module.exports = userRouter;
