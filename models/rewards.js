const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = Schema({
   reward: String,
   price: Number,
   createdBy: String
})

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
