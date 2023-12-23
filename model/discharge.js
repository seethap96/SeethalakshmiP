 const mongoose=require('mongoose');


const dischargeSchema = new mongoose.Schema({
  
  patientId: String,
  dischargeDate: String,
  dischargeTime: String,
  mortalityRate: {
    type: Number,
  },
  wardId: {
    type: String,
    required: true,
  },
  bedNumber: {
    type: String,
  },
  
  dischargeReasons: [
    {
      type: String,
      required: true,
    },
  ],
 
  
  
});

const Discharged = mongoose.model('Discharge', dischargeSchema);
module.exports = Discharged;
