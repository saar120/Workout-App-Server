require("dotenv").config();

const PORT = process.env.PORT;

const mongoURL = process.env.MONGODB_URL;

module.exports = { PORT, mongoURL };
