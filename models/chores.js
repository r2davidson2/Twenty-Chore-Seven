const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const choresSchema = Schema({
   task: String,
   points: Number,
   monday: Boolean,
   tuesday: Boolean,
   wednesday: Boolean,
   thursday: Boolean,
   friday: Boolean,
   satday: Boolean,
   sunday: Boolean,
   createdBy: String
})

const Chores = mongoose.model('Chores', choresSchema);

module.exports = Chores;
