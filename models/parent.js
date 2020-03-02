const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parentSchema = Schema({
   username: String,
   password: String,
   admin: Boolean
})

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
