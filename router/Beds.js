
//Import for both patient and bed in router
const express = require('express');
//const app = express();
const router = express.Router();
//const moment = require('moment');

const Bed =  require('../model/Beda');
const Patient = require('../model/Patient');
const Transfer=require('../model/transfer');
const Discharged=require('../model/discharge');
const doctors = require('../model/Doct');
const nus = require('../model/Nursee');
const task = require('../model/Task')

// POST to add beds to an existing ward
router.post('/adbeds1', async (req, res) => {
  try {
    const { wardName, wardId, wardType, Bednumber } = req.body;

    // Find the existing ward by its wardId and wardType
    let existingWard = await Bed.findOne({
      'wards.wardName': wardName,
      'wards.wardId': wardId,
      'wards.wardType': wardType,
    });

    // If the ward doesn't exist, create a new one
    if (!existingWard) {
      existingWard = new Bed({
        wards: [
          {
            wardName,
            wardId,
            wardType,
            beds: [],
          },
        ],
      });
    }

    // Get the current bed count in the ward
    const currentBeds = existingWard.wards[0].beds || [];

    if (Bednumber >= 0) {
      // Get the starting bed number
      const startingBedNumber =
        currentBeds.length > 0
          ? parseInt(currentBeds[currentBeds.length - 1].bedNumber.split('_')[1]) + 1
          : 1;

      // Add the specified number of beds to the existing or new ward
      for (let i = 1; i <= Bednumber; i++) {
        const newBedNumber = startingBedNumber + i - 1;
        const newBed = {
          bedNumber: `bed_${newBedNumber}`,
          status: 'available',
        };
        currentBeds.push(newBed);
      }

      // Update the beds array in the existing or newly created ward
      existingWard.wards[0].beds = currentBeds;

      // Save the updated or newly created ward
      await existingWard.save();

      res.status(200).json({ message: `Added ${Bednumber} beds to the specified ward successfully` });
    } else {
      return res.status(400).json({ error: 'Invalid bed count' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add beds to the ward' });
  }
});
//get method of bed availability:
router.get('/bedGet', async (req, res) => {
  try {
    const availableBeds = await Bed.find();
    res.json(availableBeds);
  } catch (error) {
    res.json(error);
  }
});

//Admitting doctors:
// Function to generate a random alphanumeric string of a given length
const generateString = (length) => {
  const characters = '2412';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate a unique doctor ID using only a short random string
const generateDoctorID = () => `Doc-${generateString(4)}`; // Adjust the length as needed

router.post('/addDo', async (req, res) => {
  const { admittingDoctors } = req.body;

  // Automatically generate a unique doctor ID
  const doctorId = generateDoctorID();

  try {
    const existingUser = await doctors.findOne({ doctorId });

    if (existingUser) {
      return res.status(400).json({ message: 'Doctor Id already exists' });
    }

    const newDoctor = new doctors({ doctorId, admittingDoctors });
    const savedDoctor = await newDoctor.save();

    res.json(savedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server Error' });
  }
});

  // Function to generate a random alphanumeric string of a given length
const generatenurseString = (length) => {
  const characters = '4321';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate a unique patient ID using only a short random string
const generatenurseID = () => `Nur-${generatenurseString(4)}`; // Adjust the length as needed



router.post('/anurs', async (req, res) => {
  const { nursename } = req.body;

  // Automatically generate a unique nurse ID
  const nurseId = generatenurseID();

  try {
    // Check if a nurse with the generated ID already exists
    const existingNurse = await nus.findOne({ nurseId });
    if (existingNurse) {
      return res.status(400).json({ message: 'NurseId already exists' });
    }

    // If the nurse with the ID doesn't exist, create a new nurse
    const newNurse = new nus({ nurseId, nursename });
    const savedNurse = await newNurse.save();

    res.json(savedNurse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//get doctor:


  router.get('/getDoctorNames', async (req, res) => {
    try {
      const doctors11 = await doctors.find({},'-_id admittingDoctors');
      res.json(doctors11);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
//get nursename:
  router.get('/getNurseNames', async (req, res) => {
    try {
      const nurses12 = await nus.find({},'-_id nursename');
      res.json(nurses12);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//Add task
  router.post('/addtask', async (req, res) => {
    const { taskType,description } = req.body;
  
    try {
      const existingtask = await task.findOne({ taskType, description });
      if (existingtask) {
        return res.status(400).json({ message: 'NurseId already exists' });
      }
  
      const newtask = new task({taskType,description});
      const savedtask = await newtask.save();
  
      res.json(savedtask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server Error' });
    }
  });

router.get('/gettask',async(req,res)=>{

    try{
      const tasks = await task.find({},'-_id taskType')
      res.json(tasks)
    }
    catch(error){
      res.status(500).json({message:'Error Occuring while getting patient'})
    }  
  })


  router.get('/getdescription',async(req,res)=>{
    try{
      const desc = await task.find({},'-_id description')
      res.json(desc)
    }
    catch(error){
      res.status(500).json({message:'Error Occuring while getting patient'})
    }
  })
  
//Admit Patient:
// Function to generate a random alphanumeric string of a given length
const generateRandomString = (length) => {
  const characters = 'ABCDEF1234';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate a unique patient ID using only a short random string
const generatePatientID = () => `PAT-${generateRandomString(4)}`; // Adjust the length as needed

// POST endpoint to admit a patient
router.post('/admitpt', async (req, res) => {
  try {
    const {
      patientName, age, gender, contactno, wardId, wardName, bedNumber, medicalAcuity,
      admittingDoctors, admissionDate, admissionTime, assignedNurse, tasks,
      address, abhaNo,
    } = req.body;

    // Automatically generate a unique patient ID
    const patientId = generatePatientID();

    // Ensure admissionDate is today or in the future
    const now = new Date();
    const selectedDate = new Date(admissionDate);

    // Compare only the date part
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      return res.status(400).json({ error: 'Admission date must be today or a future date.' });
    }

    // Create a new Patient document
    const newPatient = new Patient({
      patientName, age, gender, contactno, wardId, patientId, wardName, bedNumber,
      medicalAcuity, admittingDoctors, admissionDate, admissionTime,
      assignedNurse, abhaNo, address, tasks,
    });

    // Check if the specified ward and bed exist
    const bed = await Bed.findOne({
      'wards.wardId': wardId,
      'wards.beds.bedNumber': bedNumber
    });

    if (!bed) {
      return res.status(400).json({ error: 'Ward or bed does not exist.' });
    }

    // Check if the bed is available
    const selectedBed = bed.wards.find(wardItem => wardItem.wardId === wardId).beds.find(bedItem => bedItem.bedNumber === bedNumber);

    if (selectedBed.status === 'occupied') {
      return res.status(400).json({ error: 'Selected bed is already occupied.' });
    }

    // Save the patient
    const savedPatient = await newPatient.save();

    // Mark the bed as occupied in the bed collection
    selectedBed.status = 'occupied';
    selectedBed.patientId = patientId;

    // Save changes to the bed data
    await bed.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// get admit:


router.get('/patientGet', async (req, res) => {
  try {
    const pat1 = await Patient.find();
    res.json(pat1);
  } catch (error) {
    res.json(error);
  }
});

////transfer:

// Function to generate a random alphanumeric string of a given length
const generateRandomStrings = (length) => {
  const characters = 'TRA1234';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate a unique patient ID using only a short random string
const generatetranID = () => `TAT-${generateRandomStrings(4)}`; // Adjust the length as needed


router.post('/tpsss', async (req, res) => {
  const {
    currentWardId,
    currentBedNumber,
    patientName,
    age,
    gender,
    contactno,
    patientId,
    transferWardId,
    transferBedNumber,
    medicalAcuity,
    transferReasons,
    extraTransferReason,
  } = req.body;

    // Automatically generate a unique patient ID
    const transferId = generatetranID();
  try {
    // Find the current bed within the current ward
    const currentBed = await Bed.findOne({
      'wards.wardId': currentWardId,
      'wards.beds.bedNumber': currentBedNumber,
    });

    if (!currentBed) {
      return res.status(400).json({ error: 'Current bed does not exist in the selected ward.' });
    }

    // Check if the current bed is occupied
    const currentBedIndex = currentBed.wards[0].beds.findIndex(
      (bed) => bed.bedNumber === currentBedNumber && bed.status === 'occupied'
    );

    if (currentBedIndex === -1) {
      return res.json({ message: 'Current bed is already available.' });
    }

    // Find the transfer bed within the transfer ward
    const transferBed = await Bed.findOne({
      'wards.wardId': transferWardId,
      'wards.beds.bedNumber': transferBedNumber,
      'wards.beds.status': 'available',
    });

    if (!transferBed) {
      return res.status(400).json({ error: 'Transfer bed not found or not available.' });
    }

    // Update the current bed to available
    currentBed.wards[0].beds[currentBedIndex].status = 'available';
    currentBed.wards[0].beds[currentBedIndex].patientId = '';

    // Find the index of the transfer bed within the transfer ward
    const transferBedIndex = transferBed.wards[0].beds.findIndex(
      (bed) => bed.bedNumber === transferBedNumber && bed.status === 'available'
    );

    if (transferBedIndex === -1) {
      return res.status(400).json({ error: 'Transfer bed is not available.' });
    }

    // Update the transfer bed to occupied with patient information
    transferBed.wards[0].beds[transferBedIndex].status = 'occupied';
    transferBed.wards[0].beds[transferBedIndex].patientId = patientId;

    // Save changes to the database
    await currentBed.save();
    await transferBed.save();

    // Save transfer information to Transfer collection
    const transfer = new Transfer({
      patientName,
      age,
      gender,
      patientId,
      transferId,
      contactno,
      currentWardId: currentBed.wards[0]._id,
      currentBedNumber,
      transferWardId: transferBed.wards[0]._id,
      transferBedNumber,
      medicalAcuity,
      transferReasons,
      extraTransferReason,
    });

    await transfer.save();

    res.json({ message: 'Patient transfer successful. Transfer bed marked as occupied.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error performing bed action.' });
  }
});
//Transfer Get:
router.get('/transferGet', async (req, res) => {
  try {
    const TransferBeds = await Transfer.find();
    res.json(TransferBeds);
  } catch (error) {
    res.json(error);
  }
});


//discharge of patient:1:{latest}:




router.post('/distaa', async (req, res) => {
  try {
    const {
      patientId,
    
      wardId,
      bedNumber,
      dischargeReasons,
      dischargeDate,
      dischargeTime    } = req.body;

    // Find the bed within the ward
    const bedData = await Bed.findOne({ 'wards.wardId': wardId });

    if (!bedData) {
      return res.status(404).json({ error: 'Ward not found.' });
    }

    // Find the specific bed within the ward
    const selectedBed = bedData.wards
      .find((w) => w.wardId === wardId)
      .beds.find((b) => b.bedNumber === bedNumber);

    // Logging for debugging
    console.log('Bed Data:', bedData);
    console.log('Selected Bed:', selectedBed);

    // Check if patient is occupying the bed and is not already discharged
    if (selectedBed && selectedBed.status === 'occupied' && selectedBed.patientId === patientId) {
      // Check if patient is already discharged
      const isAlreadyDischarged = await Discharged.exists({ patientId });

      if (isAlreadyDischarged) {
        return res.status(400).json({ error: 'Patient is already discharged.' });
      }

      // Update bed record
      selectedBed.status = 'available';
      selectedBed.patientId = '';

      // Save the updated bed record
      await bedData.save();

      // Calculate mortality rate (example calculation, adjust as needed)
      const totalBedsInWard = bedData.wards.reduce((total, ward) => total + ward.beds.length, 0);
      const dischargedRecords = await Discharged.find({ 'dischargeReasons': 'died' });
      const totalDiedCases = dischargedRecords.length;
      const mortalityRate = (totalDiedCases / totalBedsInWard) * 100;

      // Log the calculated mortality rate
      console.log('Calculated Mortality Rate:', mortalityRate);

      // Create a discharged record with all the data fields
      const discharged = new Discharged({
        patientId,
        wardId,
        bedNumber,
        dischargeReasons,
        dischargeDate,
        dischargeTime,
        mortalityRate,
      });

      // Save the discharged record
      await discharged.save();

      res.json({ message: 'Patient discharged and bed record updated successfully.', mortalityRate });
    } else {
      res.status(400).json({ error: 'Patient discharged.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error discharging patient and updating bed record.' });
  }
});


module.exports = router;



//get discharge method:
router.get('/Disget',async(req,res)=>{
  try{
    const h1 = await Discharged.find()
    res.json(h1)
    console.log(h1);
  }
  catch(error){
      res.json(error)
  }
})

module.exports=router;



