/* ===================================================
   MARAcalc — Application Logic
   =================================================== */

// ---------- Programme Data ----------
const PROGRAMMES = [
  {
    no: 1,
    name: "Business Management",
    duration: "3 year 4 months",
    fee2022: 54988,
    payment2022: 7855.43,
    fee2023: 63012,
    payment2023: 9001.71,
  },
  {
    no: 2,
    name: "Applied Chemistry",
    duration: "3 year 4 months",
    fee2022: 62387,
    payment2022: 8912.43,
    fee2023: 67645,
    payment2023: 9663.57,
  },
  {
    no: 3,
    name: "Computer Science",
    duration: "3 year 4 months",
    fee2022: 65808,
    payment2022: 9401.14,
    fee2023: 71308,
    payment2023: 10186.86,
  },
  {
    no: 4,
    name: "Information Systems",
    duration: "3 year 4 months",
    fee2022: 65808,
    payment2022: 9401.14,
    fee2023: 71308,
    payment2023: 10186.86,
  },
  {
    no: 5,
    name: "Information Technology",
    duration: "3 year 4 months",
    fee2022: 65808,
    payment2022: 9401.14,
    fee2023: 71308,
    payment2023: 10186.86,
  },
  {
    no: 6,
    name: "Petroleum Geoscience",
    duration: "3 year 4 months",
    fee2022: 72000,
    payment2022: 9000.00,
    fee2023: 79306,
    payment2023: 9913.25,
  },
  {
    no: 7,
    name: "Chemical Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92410,
    payment2023: 11551.25,
  },
  {
    no: 8,
    name: "Civil Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92410,
    payment2023: 11551.25,
  },
  {
    no: 9,
    name: "Computer Engineering",
    duration: "4 years",
    fee2022: 84000,
    payment2022: 10500.00,
    fee2023: 92410,
    payment2023: 11551.25,
  },
  {
    no: 10,
    name: "Electrical & Electronics Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92410,
    payment2023: 11551.25,
  },
  {
    no: 11,
    name: "Materials Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92417,
    payment2023: 11552.13,
  },
  {
    no: 12,
    name: "Mechanical Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92410,
    payment2023: 11551.25,
  },
  {
    no: 13,
    name: "Petroleum Engineering",
    duration: "4 years",
    fee2022: 82980,
    payment2022: 10372.50,
    fee2023: 92410,
    payment2023: 11551.25,
  },
];

// MARA type labels
const MARA_LABELS = {
  YTP_DIRECT: "MARA YTP (Direct Programme to UTP)",
  KMKN: "MARA KMKN-UTP",
  EDU: "MARA EDU",
  YTP_REROUTE: "MARA YTP (Reroute from overseas / other programmes)",
  IESP: "MARA IESP",
  TESP: "MARA TESP",
};

const HOSTEL_COVERED = ["YTP_DIRECT", "KMKN"];

// ---------- State ----------
let state = {
  yearCategory: null,
  programme: null,
  maraType: null,
  yd: null,
  maraDuration: null,
  paymentsReceived: null,
};

// ---------- DOM References ----------
const yearSelect = document.getElementById("yearCategory");
const programmeList = document.getElementById("programmeList");
const feeSummary = document.getElementById("feeSummary");
const btnNext1 = document.getElementById("btn-next-1");
const btnNext2 = document.getElementById("btn-next-2");
const btnBack2 = document.getElementById("btn-back-2");
const btnNext3 = document.getElementById("btn-next-3");
const btnBack3 = document.getElementById("btn-back-3");
const btnBack4 = document.getElementById("btn-back-4");
const hostelNotice = document.getElementById("hostelNotice");
const ydInput = document.getElementById("ydInput");
const maraStartDate = document.getElementById("maraStartDate");
const maraEndDate = document.getElementById("maraEndDate");
const allocationStatus = document.getElementById("allocationStatus");
const paymentGroup = document.getElementById("paymentGroup");
const paymentReceived = document.getElementById("paymentReceived");
const panels = document.querySelectorAll(".step-panel");
const steps = document.querySelectorAll(".step");
const stepLines = document.querySelectorAll(".step-line");

// ---------- Helpers ----------
function formatRM(value) {
  return (
    "RM" +
    Number(value).toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function getSelectedProgramme() {
  if (!state.yearCategory || !state.programme) return null;
  const prog = PROGRAMMES.find((p) => p.name === state.programme);
  if (!prog) return null;
  const isOld = state.yearCategory === "2022";
  return {
    ...prog,
    totalFee: isOld ? prog.fee2022 : prog.fee2023,
    amountPerPayment: isOld ? prog.payment2022 : prog.payment2023,
  };
}

function goToStep(n) {
  panels.forEach((p) => p.classList.remove("active"));
  document.getElementById(`panel-${n}`).classList.add("active");

  steps.forEach((s, i) => {
    const stepNum = i + 1;
    s.classList.remove("active", "done");
    if (stepNum === n) s.classList.add("active");
    else if (stepNum < n) s.classList.add("done");
  });

  stepLines.forEach((line, i) => {
    const lineStep = i + 1;
    line.classList.toggle("done", lineStep < n);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Step 1: Year & Programme ----------
yearSelect.addEventListener("change", () => {
  state.yearCategory = yearSelect.value;

  // Build scrollable programme list
  programmeList.classList.remove("disabled");
  programmeList.innerHTML = "";

  PROGRAMMES.forEach((p) => {
    const isOld = state.yearCategory === "2022";
    const fee = isOld ? p.fee2022 : p.fee2023;

    const item = document.createElement("div");
    item.className = "scroll-list-item";
    item.dataset.name = p.name;
    item.innerHTML = "<span>" + p.name + "</span>";

    item.addEventListener("click", () => {
      // Deselect all
      programmeList.querySelectorAll(".scroll-list-item").forEach((el) => {
        el.classList.remove("selected");
      });
      item.classList.add("selected");

      state.programme = p.name;
      const prog = getSelectedProgramme();
      if (!prog) return;

      document.getElementById("sumProgramme").textContent = prog.name;
      document.getElementById("sumDuration").textContent = prog.duration;
      document.getElementById("sumTuition").textContent = formatRM(prog.totalFee);
      document.getElementById("sumPayment").textContent = formatRM(prog.amountPerPayment);

      feeSummary.classList.remove("hidden");
      btnNext1.disabled = false;
    });

    programmeList.appendChild(item);
  });

  // Reset programme state
  state.programme = null;
  feeSummary.classList.add("hidden");
  btnNext1.disabled = true;
});

btnNext1.addEventListener("click", () => {
  if (state.programme) goToStep(2);
});

// ---------- Step 2: MARA Scholarship ----------
document.querySelectorAll('input[name="maraScholarship"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    state.maraType = radio.value;
    btnNext2.disabled = false;

    // Show hostel notice
    const covered = HOSTEL_COVERED.includes(state.maraType);
    hostelNotice.classList.remove("hidden", "notice-good", "notice-warn");

    if (covered) {
      hostelNotice.className = "notice notice-good";
      hostelNotice.innerHTML =
        "<strong>Hostel fees are covered</strong> under your MARA scholarship. " +
        "Your hostel accommodation charges will be included in the MARA disbursement.";
    } else {
      hostelNotice.className = "notice notice-warn";
      hostelNotice.innerHTML =
        "<strong>Hostel fees are not covered</strong> under your MARA scholarship. " +
        "You will need to settle hostel accommodation charges separately.";
    }
  });
});

btnNext2.addEventListener("click", () => {
  if (state.maraType) goToStep(3);
});

btnBack2.addEventListener("click", () => goToStep(1));

// ---------- Step 3: YD Input ----------
function validateAllocation() {
  const val = parseFloat(ydInput.value);
  const startVal = maraStartDate.value;
  const endVal = maraEndDate.value;

  if (isNaN(val) || val <= 0 || !startVal || !endVal) {
    allocationStatus.classList.add("hidden");
    paymentGroup.classList.add("hidden");
    btnNext3.disabled = true;
    return;
  }

  const start = new Date(startVal);
  const end = new Date(endVal);

  if (end <= start) {
    allocationStatus.innerHTML = '<div class="notice notice-error">End date must be after start date.</div>';
    allocationStatus.classList.remove("hidden");
    paymentGroup.classList.add("hidden");
    btnNext3.disabled = true;
    return;
  }

  // Calculate approximate months and round to nearest semester (6 months)
  const exactMonths = (end - start) / (1000 * 60 * 60 * 24 * 30.436875);
  const semesters = Math.round(exactMonths / 6);

  if (semesters <= 0) {
    allocationStatus.innerHTML = '<div class="notice notice-error">Duration is too short to calculate payments.</div>';
    allocationStatus.classList.remove("hidden");
    paymentGroup.classList.add("hidden");
    btnNext3.disabled = true;
    return;
  }

  state.yd = val;
  state.maraDuration = semesters;

  const prog = getSelectedProgramme();
  if (!prog) return;

  allocationStatus.classList.remove("hidden");

  const totalEstimatedAllocation = val * semesters;
  const expectedTuitionForDuration = prog.amountPerPayment * semesters;

  const isYdPass = val >= prog.amountPerPayment;
  const isTotalPass = totalEstimatedAllocation >= expectedTuitionForDuration;

  if (isYdPass && isTotalPass) {
    allocationStatus.innerHTML =
      '<div class="notice notice-good">' +
      "<strong>MARA allocation is fully satisfied.</strong> " +
      "Your Yearly Disbursement (" + formatRM(val) + ") covers the Amount Per Payment (" + formatRM(prog.amountPerPayment) + "), " +
      "and your total estimated allocation (" + formatRM(totalEstimatedAllocation) + ") covers the Expected Tuition Fee for your offer duration (" + formatRM(expectedTuitionForDuration) + ")." +
      "</div>";
    paymentGroup.classList.remove("hidden");
    validatePaymentInput();
  } else if (isYdPass && !isTotalPass) {
    allocationStatus.innerHTML =
      '<div class="notice notice-warn">' +
      "<strong>Partial coverage warning.</strong> " +
      "Your Yearly Disbursement (" + formatRM(val) + ") is enough to cover the Amount Per Payment (" + formatRM(prog.amountPerPayment) + "), " +
      "but your total estimated allocation (" + formatRM(totalEstimatedAllocation) + ") is less than the Expected Tuition Fee for your offer duration (" + formatRM(expectedTuitionForDuration) + ").<br><br>" +
      "<em>Note: If you received this scholarship mid-programme (e.g., Year 2), this is expected. Otherwise, please verify your MARA offer letter duration.</em>" +
      "</div>";
    paymentGroup.classList.remove("hidden");
    validatePaymentInput();
  } else {
    allocationStatus.innerHTML =
      '<div class="notice notice-error">' +
      "<strong>MARA allocation not enough.</strong> " +
      "Your Yearly Disbursement (" + formatRM(val) + ") is less than the Amount Per Payment (" + formatRM(prog.amountPerPayment) + "). " +
      "Please verify your MARA offer letter." +
      "</div>";
    paymentGroup.classList.add("hidden");
    btnNext3.disabled = true;
  }
}

ydInput.addEventListener("input", validateAllocation);
maraStartDate.addEventListener("change", validateAllocation);
maraEndDate.addEventListener("change", validateAllocation);

function validatePaymentInput() {
  const pr = parseInt(paymentReceived.value, 10);
  if (!isNaN(pr) && pr >= 0 && state.yd > 0) {
    state.paymentsReceived = pr;
    btnNext3.disabled = false;
  } else {
    btnNext3.disabled = true;
  }
}

paymentReceived.addEventListener("input", validatePaymentInput);

btnNext3.addEventListener("click", () => {
  if (state.yd > 0 && state.paymentsReceived !== null) {
    calculateResults();
    goToStep(4);
  }
});

btnBack3.addEventListener("click", () => goToStep(2));

// ---------- Step 4: Results ----------
function calculateResults() {
  const prog = getSelectedProgramme();
  if (!prog) return;

  const yd = state.yd;
  const dlyd = state.maraDuration || Math.round(prog.totalFee / yd);
  const pinjaman = yd * dlyd; // Total sponsored amount by MARA
  const received = state.paymentsReceived;
  const balance = Math.max(0, dlyd - received);
  const hostelCovered = HOSTEL_COVERED.includes(state.maraType);

  // Fill results
  document.getElementById("resProgramme").textContent = prog.name;
  document.getElementById("resYear").textContent =
    state.yearCategory === "2022" ? "Year 2022 and below" : "Year 2023 onwards";
  document.getElementById("resScholarship").textContent =
    MARA_LABELS[state.maraType];
  document.getElementById("resHostel").textContent = hostelCovered
    ? "Covered"
    : "Not covered";
  document.getElementById("resTuition").textContent = formatRM(pinjaman);
  document.getElementById("resYD").textContent = formatRM(yd);
  document.getElementById("resDLYD").textContent =
    dlyd + " payment" + (dlyd !== 1 ? "s" : "");
  document.getElementById("resReceived").textContent =
    received + " payment" + (received !== 1 ? "s" : "");
  document.getElementById("resBalance").textContent =
    balance + " payment" + (balance !== 1 ? "s" : "");

  // Scenario box
  const scenarioBox = document.getElementById("scenarioBox");
  if (balance === 0) {
    scenarioBox.className = "scenario-box scenario-settled";
    scenarioBox.innerHTML =
      "<h3>All Payments Received</h3>" +
      "<p>You have received all " +
      dlyd +
      " expected payments from MARA. " +
      "If there is any outstanding balance in your student statement, " +
      "you will need to settle it by yourself.</p>";
  } else {
    scenarioBox.className = "scenario-box scenario-pending";
    scenarioBox.innerHTML =
      "<h3>Payments Pending</h3>" +
      "<p>You have " +
      balance +
      " remaining payment" +
      (balance !== 1 ? "s" : "") +
      " to receive from MARA. " +
      "Finance will request the balance of payment from MARA on your behalf.</p>" +
      '<p style="margin-top:8px;font-size:0.82rem;font-style:italic;">*Subject to MARA approval</p>';
  }
}

// ---------- Start Over ----------
btnBack4.addEventListener("click", () => {
  // Reset state
  state = {
    yearCategory: null,
    programme: null,
    maraType: null,
    yd: null,
    paymentsReceived: null,
  };

  // Reset forms
  yearSelect.value = "";
  programmeList.innerHTML =
    '<div class="scroll-list-placeholder">Select a year category first</div>';
  programmeList.classList.add("disabled");
  feeSummary.classList.add("hidden");
  btnNext1.disabled = true;

  document.querySelectorAll('input[name="maraScholarship"]').forEach((r) => {
    r.checked = false;
  });
  hostelNotice.classList.add("hidden");
  btnNext2.disabled = true;

  ydInput.value = "";
  allocationStatus.classList.add("hidden");
  paymentGroup.classList.add("hidden");
  paymentReceived.value = "";
  btnNext3.disabled = true;

  goToStep(1);
});

// ---------- Programme Info Overlay ----------
const infoOverlay = document.getElementById("infoOverlay");
const btnToggleInfo = document.getElementById("btnToggleInfo");
const btnCloseInfo = document.getElementById("btnCloseInfo");
const infoTableBody = document.getElementById("infoTableBody");
let infoYear = "2022";

function populateInfoTable(year) {
  infoTableBody.innerHTML = "";
  const isOld = year === "2022";

  PROGRAMMES.forEach((p) => {
    const fee = isOld ? p.fee2022 : p.fee2023;
    const payment = isOld ? p.payment2022 : p.payment2023;

    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + p.no + "</td>" +
      "<td>" + p.name + "</td>" +
      "<td>" + p.duration + "</td>" +
      "<td>" + formatRM(fee) + "</td>" +
      "<td>" + formatRM(payment) + "</td>";
    infoTableBody.appendChild(tr);
  });
}

btnToggleInfo.addEventListener("click", () => {
  populateInfoTable(infoYear);
  infoOverlay.classList.remove("hidden");
});

btnCloseInfo.addEventListener("click", () => {
  infoOverlay.classList.add("hidden");
});

// Close overlay when clicking backdrop
infoOverlay.addEventListener("click", (e) => {
  if (e.target === infoOverlay) {
    infoOverlay.classList.add("hidden");
  }
});

// Tab switching
document.querySelectorAll(".info-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".info-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    infoYear = tab.dataset.year;
    populateInfoTable(infoYear);
  });
});
