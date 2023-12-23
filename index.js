
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const url = "mongodb://127.0.0.1:27017/BestHospital";
mongoose.connect(url );

const con = mongoose.connection;
con.on('open', () => {
  console.log("db is connected");
});







app.use(express.json());

// Import and use your router files
const alienrouter = require('./router/Beds');
app.use('/', alienrouter);

app.listen(7000, () => {
  console.log('Server is running on port 7000'); // Confirm that the server is running
});
