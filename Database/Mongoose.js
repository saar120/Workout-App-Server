const mongoose = require("mongoose");
const { mongoURL } = require("../config/config.js");

mongoose
  .connect(mongoURL)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.error(e));
