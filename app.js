const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/config.js");

const app = express();

require("./Database/Mongoose.js");

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
