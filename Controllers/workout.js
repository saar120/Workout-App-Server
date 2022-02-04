const UserWorkout = require("../Database/Models/userWorkouts.js");

const addWorkout = async (req, res) => {
  try {
    const { creatorID, title, exercises } = req.body;
    const workout = { title, exercises };
    const existingUserWorkouts = await UserWorkout.findOneAndUpdate(
      { creatorID: creatorID },
      { $push: { workouts: workout } },
      { returnOriginal: false }
    );
    if (!existingUserWorkouts) {
      const newUserWorkouts = await UserWorkout.create({ creatorID, workouts: [workout] });
      res.status(200).json(newUserWorkouts);
    } else {
      res.status(200).json(existingUserWorkouts);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addWorkout };
