const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Payment = require("./models/payment.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


app.post("/api/payment", async(req,res)=> {
    const { departure, destination, date, flight, tickets, total } = req.body;

  try {
    const newPayment = await Payment.create({ departure, destination, date, flight, tickets, total });
    res.status(201).json({ message: 'Booking successful', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error });
  }
});


//test route


app.listen(process.env.PORT || 35070 , () => {
  console.log("payment microservice is running.");
});
app.get("/", (req, res) => {
      res.send("Hello World!");
    });
