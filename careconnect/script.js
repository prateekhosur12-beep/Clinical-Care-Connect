let currentUser = null;

// Force-hide dashboard buttons on load
document.addEventListener("DOMContentLoaded", () => {
  topToggle.style.display = "none";
});

// ================= AUTH =================
function signup() {
  const name = authName.value;
  const phone = authPhone.value;

  if (!name || !phone) {
    authMsg.textContent = "Please fill all fields";
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, phone }));
  authMsg.textContent = "Signup successful. Please login.";
}

function login() {
  const stored = JSON.parse(localStorage.getItem("user"));
  if (!stored) {
    alert("Please signup first");
    return;
  }

  currentUser = stored;
  authView.classList.add("hidden");
  topToggle.style.display = "flex";
  showPatient();
}

function logout() {
  topToggle.style.display = "none";
  authView.classList.remove("hidden");
  patientView.classList.add("hidden");
  doctorView.classList.add("hidden");
}

// ================= NAV =================
function showPatient() {
  patientView.classList.remove("hidden");
  doctorView.classList.add("hidden");
  renderPatientAppointments();
}

function showDoctor() {
  doctorView.classList.remove("hidden");
  patientView.classList.add("hidden");
  renderDoctorAppointments();
}

// ================= BOOKING =================
bookingForm.addEventListener("submit", e => {
  e.preventDefault();

  const booking = {
    patientName: patientName.value,
    patientPhone: patientPhone.value,
    doctorName: doctorSelect.value,
    date: appointmentDate.value,
    time: appointmentTime.value,
    reason: visitReason.value,
    status: "Pending"
  };

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(booking);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  bookingForm.reset();
  formMessage.textContent = "Appointment booked!";
  renderPatientAppointments();
});

// ================= PATIENT VIEW =================
function renderPatientAppointments() {
  const list = JSON.parse(localStorage.getItem("appointments")) || [];
  appointmentsList.innerHTML = "";

  list.forEach(a => {
    const div = document.createElement("div");
    div.className = "appointment-card";
    div.innerHTML = `
      <b>${a.doctorName}</b><br>
      ${a.date} at ${a.time}<br>
      Status: ${a.status}
    `;
    appointmentsList.appendChild(div);
  });
}

// ================= DOCTOR VIEW =================
function renderDoctorAppointments() {
  const list = JSON.parse(localStorage.getItem("appointments")) || [];
  doctorAppointments.innerHTML = "";

  list.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = "appointment-card";
    div.innerHTML = `
      <b>${a.patientName}</b> (${a.patientPhone})<br>
      ${a.doctorName}<br>
      ${a.date} at ${a.time}<br>
      Reason: ${a.reason}<br>
      Status: ${a.status}<br><br>

      <button class="confirm" onclick="updateStatus(${i}, 'Confirmed')">Confirm</button>
      <button class="cancel" onclick="updateStatus(${i}, 'Cancelled')">Cancel</button>
      <button class="cancel" onclick="deleteAppointment(${i})">Delete</button>
    `;
    doctorAppointments.appendChild(div);
  });
}

function updateStatus(index, status) {
  const list = JSON.parse(localStorage.getItem("appointments"));
  list[index].status = status;
  localStorage.setItem("appointments", JSON.stringify(list));
  renderDoctorAppointments();
}

function deleteAppointment(index) {
  const list = JSON.parse(localStorage.getItem("appointments"));
  list.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(list));
  renderDoctorAppointments();
}

// ================= EXPORT CSV =================
function exportBookings() {
  const bookings = JSON.parse(localStorage.getItem("appointments")) || [];
  if (bookings.length === 0) {
    alert("No booking data to export");
    return;
  }

  let csv = "Patient Name,Phone,Doctor,Date,Time,Reason,Status\n";
  bookings.forEach(b => {
    csv += `"${b.patientName}","${b.patientPhone}","${b.doctorName}","${b.date}","${b.time}","${b.reason}","${b.status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "clinic_bookings.csv";
  link.click();
}
