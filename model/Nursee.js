const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
  nurseId:{
    type:String,
   unique:true
  },
  nursename:{
    type:String,
    require:true
  }
});

const nurse = mongoose.model('nursed', nurseSchema);

module.exports = nurse;

