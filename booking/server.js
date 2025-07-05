const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Booking = require("./models/booking.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/booking.html");
});

// Get all bookings
// app.get("/api/bookings", async (req, res) => {
//   const bookings = await Booking.find();
//   res.json(bookings);
// });

// Add new booking
app.post("/api/bookings", async (req, res) => {
  const { departure, destination, date } = req.body;
  const newBooking = new Booking({ departure, destination, date });
  await newBooking.save();
  res.json({ message: "Booking successful", booking: newBooking });
});
//test route 
app.get("/api/searchflights", async(req,res)=>{
  const {departure, destination} = req.query;
  if(!departure || !destination){
    return res.status(400).json({message: 'Please provide both departure and destination'});
  }

  try{
    const flights = await Booking.find({
      departure: {$regex: new RegExp(departure, 'i')},
      destination: {$regex: new RegExp(destination, 'i')},
    });

    if(flights.length === 0){
      return res.status(404).json({message: 'No flights found on this route '});
    }
    res.json(flights);
  }catch(err){
    res.status(500).json({message: "Server Error ", error: err.message});
  }
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Booking microservice is running.");
});
