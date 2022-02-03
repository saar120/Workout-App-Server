require("dotenv").config();

const PORT = process.env.PORT;

const mongoURL = process.env.MONGODB_URL;

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { PORT, mongoURL };
