require("dotenv").config();
import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.js");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500; // google auth token is longer than 500 - our is less.

    let decodedData;
    if (token && isCustomAuth) {
      // if the token is ours
      decodedData = jwt.verify(token, JWT_SECRET);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (err) {
    console.error(err);
  }
};

export default auth;
