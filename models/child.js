const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = Schema({
   username: String,
   password: String,
   name: String,
   parent: String,
   chores: Array,
   points: Number,
   rewards: Array,
   admin: Boolean
})

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
