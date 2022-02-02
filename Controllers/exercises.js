const Exercises = require("../Database/Models/exercisesModel.js");

const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercises.find({});
    res.status(200).json(exercises);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getAllExercises };
