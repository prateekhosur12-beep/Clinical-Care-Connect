require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ================= MODELS =================
const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  patientPhone: String,
  doctorName: String,
  date: String,
  time: String,
  reason: String,
  status: { type: String, default: "Pending" }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// ================= ROUTES =================

// Create appointment
app.post("/appointments", async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json({ message: "Appointment created" });
});

// Get all appointments
app.get("/appointments", async (req, res) => {
  const data = await Appointment.find();
  res.json(data);
});

// Update status
app.put("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.json({ message: "Updated" });
});

// Delete appointment
app.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ================= SERVER =================
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
