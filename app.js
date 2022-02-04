const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/config.js");
const userRouter = require("./Routes/userRoutes.js");
const exercisesRouter = require("./Routes/exercisesRoutes.js");
const workoutRouter = require("./Routes/workoutRoutes.js");

const app = express();

require("./Database/Mongoose.js");

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/workouts", workoutRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
