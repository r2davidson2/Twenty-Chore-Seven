const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = Schema({
   username: String,
   password: String,
   parent: String,
   chores: Array,
   points: Number,
   admin: Boolean
})

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
