const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const choresSchema = Schema({
   task: String,
   points: Number,
   monday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   tuesday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   wednesday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   thursday: { type: [{
               toDo: Boolean,
                  completed: Boolean
               }]
            },
   friday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   saturday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   sunday: { type: [{
                  toDo: Boolean,
                  completed: Boolean
               }]
            },
   createdBy: String
})

const Chores = mongoose.model('Chores', choresSchema);

module.exports = Chores;
