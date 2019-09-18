const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraPointsSchema = Schema({
   task: String,
   points: Number,
   createdBy: String
})

const ExtraPoints = mongoose.model('ExtraPoints', extraPointsSchema);

module.exports = ExtraPoints;
