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
  YTP_DIRECT: "MARA YTP",
  EDU: "MARA EDU",
};

const HOSTEL_COVERED = ["YTP_DIRECT", "KMKN"];

// ---------- State ----------
let state = {
  yearCategory: null,
  programme: null,
  maraType: "YTP_DIRECT",
  totalTuitionFee: null,
  yd: null,
  maraDuration: null,
  paymentsReceived: null,
};

// ---------- DOM References ----------
const yearSelect = document.getElementById("yearCategory");
const programmeList = document.getElementById("programmeList");
const feeSummary = document.getElementById("feeSummary");
const btnNext1 = document.getElementById("btn-next-1");
const btnNext3 = document.getElementById("btn-next-3");
const btnBack3 = document.getElementById("btn-back-3");
const btnBack4 = document.getElementById("btn-back-4");
const hostelNotice = document.getElementById("hostelNotice");
const totalTuitionInput = document.getElementById("totalTuitionInput");
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

    if (document.getElementById("panel-3").classList.contains("active")) {
      calculateResults();
    }
  });
});

// ---------- Step 2: Allocation Input ----------
function validateAllocation() {
  const totalTuition = parseFloat(totalTuitionInput.value);
  const val = parseFloat(ydInput.value);
  const startVal = maraStartDate.value;
  const endVal = maraEndDate.value;

  if (isNaN(totalTuition) || totalTuition <= 0 || isNaN(val) || val <= 0 || !startVal || !endVal) {
    allocationStatus.classList.add("hidden");
    btnNext3.disabled = true;
    return;
  }

  const start = new Date(startVal);
  const end = new Date(endVal);

  if (end <= start) {
    allocationStatus.innerHTML = '<div class="notice notice-error">End date must be after start date.</div>';
    allocationStatus.classList.remove("hidden");
    btnNext3.disabled = true;
    return;
  }

  // Calculate approximate months and round to nearest payment period (6 months = 1 payment)
  const exactMonths = (end - start) / (1000 * 60 * 60 * 24 * 30.436875);
  const expectedPayments = Math.round(exactMonths / 6);

  if (expectedPayments <= 0) {
    allocationStatus.innerHTML = '<div class="notice notice-error">Duration is too short to calculate payments.</div>';
    allocationStatus.classList.remove("hidden");
    btnNext3.disabled = true;
    return;
  }

  state.totalTuitionFee = totalTuition;
  state.yd = val;
  state.maraDuration = expectedPayments;

  const prog = getSelectedProgramme();
  if (!prog) return;

  allocationStatus.classList.remove("hidden");

  // Validate: Lampiran A total should not exceed UTP actual fee
  if (totalTuition > prog.totalFee) {
    allocationStatus.innerHTML =
      '<div class="notice notice-error">' +
      "<strong>Total Tuition Fee exceeds UTP's actual fee.</strong> " +
      "Your Lampiran A states " + formatRM(totalTuition) + ", but the actual UTP fee for " + prog.name + " is " + formatRM(prog.totalFee) + ". " +
      "Please verify your Lampiran A or programme selection." +
      "</div>";
    btnNext3.disabled = true;
    return;
  }

  const totalEstimatedAllocation = val * expectedPayments;

  const coversLampiranA = totalEstimatedAllocation >= totalTuition;
  const coversUTPActual = totalEstimatedAllocation >= prog.totalFee;
  const isPartial = totalTuition < prog.totalFee;

  if (coversLampiranA && coversUTPActual) {
    // Fully covers UTP actual fee
    allocationStatus.innerHTML =
      '<div class="notice notice-good">' +
      "<strong>MARA allocation is sufficient.</strong> " +
      "Your Total Tuition Fee and Amount Per Payment fully covers the study fees." +
      "</div>";
    validatePaymentInput();
  } else if (coversLampiranA && !coversUTPActual) {
    // Covers Lampiran A but Lampiran A < UTP actual (partial coverage / half studies)
    allocationStatus.innerHTML =
      '<div class="notice notice-warn">' +
      "<strong>Partial coverage.</strong> " +
      "Your MARA Lampiran A total (" + formatRM(totalTuition) + ") does not cover the full UTP tuition fee (" + formatRM(prog.totalFee) + ") for " + prog.name + "." +
      "</div>";
    paymentGroup.classList.remove("hidden");
    validatePaymentInput();
  } else {
    // Doesn't even cover Lampiran A total
    allocationStatus.innerHTML =
      '<div class="notice notice-error">' +
      "<strong>Allocation does not match Lampiran A.</strong> " +
      "Your total estimated allocation (" + formatRM(totalEstimatedAllocation) + ") is less than the Total Tuition Fee (" + formatRM(totalTuition) + ") from your Lampiran A.<br><br>" +
      "<em>Please verify your MARA offer letter duration and Amount Per Payment.</em>" +
      "</div>";
    paymentGroup.classList.remove("hidden");
    validatePaymentInput();
  }
}

totalTuitionInput.addEventListener("input", validateAllocation);
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
    goToStep(3);
  }
});

btnBack3.addEventListener("click", () => goToStep(1));

// ---------- Step 3: Results ----------
function calculateResults() {
  const prog = getSelectedProgramme();
  if (!prog) return;

  const yd = state.yd;
  const userTotalTuition = state.totalTuitionFee || prog.totalFee;
  const maraPayments = state.maraDuration;
  
  // DLYD = payments based on MARA offer duration (consistent source of truth)
  const dlyd = maraPayments;
  const pinjaman = yd * maraPayments; // Total sponsored amount by MARA
  const received = state.paymentsReceived;
  const balance = Math.max(0, dlyd - received);
  const hostelCovered = HOSTEL_COVERED.includes(state.maraType);

  // Out of Pocket: UTP actual fee minus what MARA sponsors
  const outOfPocketTotal = Math.max(0, prog.totalFee - pinjaman);

  // Fill results
  document.getElementById("resProgramme").textContent = prog.name;
  document.getElementById("resYear").textContent =
    state.yearCategory === "2022" ? "Year 2022 and below" : "Year 2023 onwards";
  document.getElementById("resScholarship").textContent =
    MARA_LABELS[state.maraType];
  document.getElementById("resHostel").textContent = hostelCovered
    ? "Covered"
    : "Not covered";
  document.getElementById("resProgrammeFee").textContent = formatRM(prog.totalFee);
  
  const resTuitionEl = document.getElementById("resTuition");
  resTuitionEl.textContent = formatRM(pinjaman);
  if (pinjaman >= prog.totalFee) {
    resTuitionEl.style.color = "var(--success)";
    resTuitionEl.style.fontWeight = "bold";
  } else {
    resTuitionEl.style.color = "var(--error)";
    resTuitionEl.style.fontWeight = "bold";
  }
  document.getElementById("resYD").textContent = formatRM(yd);
  document.getElementById("resMaraDuration").textContent = maraPayments + " payment" + (maraPayments !== 1 ? "s" : "") + " (from offer dates)";
  document.getElementById("resDLYD").textContent =
    dlyd + " payment" + (dlyd !== 1 ? "s" : "");
  document.getElementById("resReceived").textContent =
    received + " payment" + (received !== 1 ? "s" : "");
  document.getElementById("resBalance").textContent =
    balance + " payment" + (balance !== 1 ? "s" : "");

  const outOfPocketRow = document.getElementById("outOfPocketRow");
  outOfPocketRow.style.display = "flex";
  document.getElementById("resOutOfPocket").textContent = formatRM(outOfPocketTotal);
  if (outOfPocketTotal > 0) {
    outOfPocketRow.style.backgroundColor = "#fff0f0";
    outOfPocketRow.style.borderColor = "#ffcccc";
    outOfPocketRow.children[0].style.color = "#d93025";
    document.getElementById("resOutOfPocket").style.color = "#d93025";
  } else {
    outOfPocketRow.style.backgroundColor = "var(--success-bg)";
    outOfPocketRow.style.borderColor = "var(--success-border)";
    outOfPocketRow.children[0].style.color = "var(--success)";
    document.getElementById("resOutOfPocket").style.color = "var(--success)";
  }

  // Scenario box
  const scenarioBox = document.getElementById("scenarioBox");
  const isPartialCoverage = userTotalTuition < prog.totalFee;
  const coveragePercent = Math.round((userTotalTuition / prog.totalFee) * 100);
  const uncoveredFee = prog.totalFee - userTotalTuition;

  // Switch sidebar based on out-of-pocket
  const sidebarLeft = document.querySelector(".sidebar-left");
  if (outOfPocketTotal > 0) {
    sidebarLeft.innerHTML =
      '<h3 class="sidebar-title">Alternative for Insufficient Allocation:</h3>' +
      '<ul class="sidebar-links">' +
      '<li>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '<div>' +
      '<a href="https://tmspp.mara.gov.my/" target="_blank">Request additional allocation from MARA through TMS system</a>' +
      '<span class="sidebar-note">– subject to MARA\'s approval</span>' +
      '</div>' +
      '</li>' +
      '<li>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '<div>' +
      '<a href="https://www.kwsp.gov.my/ms/ahli/fasa-kehidupan/pengeluaran-pendidikan" target="_blank">EPF education withdrawal (Account 2)</a>' +
      '</div>' +
      '</li>' +
      '</ul>';
  }

  if (balance === 0 && outOfPocketTotal === 0) {
    // SCENARIO 1: All payments received, fully covered
    scenarioBox.className = "scenario-box scenario-settled";
    scenarioBox.innerHTML =
      "<h3>✅ Fully Covered — All Payments Received</h3>" +
      "<p>You have received all " + dlyd + " expected payments from MARA, " +
      "and your MARA sponsorship fully covers the UTP tuition fee (" + formatRM(prog.totalFee) + "). " +
      "No out-of-pocket payment is required.</p>";

  } else if (balance === 0 && outOfPocketTotal > 0 && isPartialCoverage) {
    // SCENARIO 2: All payments received, but MARA only covers part of studies (half coverage)
    scenarioBox.className = "scenario-box scenario-warn";
    scenarioBox.innerHTML =
      "<h3>⚠️ Partial Coverage — All MARA Payments Received</h3>" +
      "<p>You have received all " + dlyd + " payments from MARA. However, your MARA scholarship " +
      "only covers <strong>" + coveragePercent + "%</strong> of the programme " +
      "(Lampiran A: " + formatRM(userTotalTuition) + " out of UTP actual: " + formatRM(prog.totalFee) + ").</p>" +
      "<p style='margin-top:8px;'>You will need to settle the remaining <strong>" + formatRM(outOfPocketTotal) + "</strong> to UTP by yourself. " +
      "This is common for students who received MARA sponsorship starting mid-programme.</p>" +
      "<p style='margin-top:8px;font-size:0.85rem;'><em>Please refer to the sidebar for alternative options to cover the shortfall.</em></p>";

  } else if (balance === 0 && outOfPocketTotal > 0 && !isPartialCoverage) {
    // SCENARIO 3: All payments received, full coverage on Lampiran A but MARA duration shorter than expected
    scenarioBox.className = "scenario-box scenario-warn";
    scenarioBox.innerHTML =
      "<h3>⚠️ All MARA Payments Received — Outstanding Balance</h3>" +
      "<p>You have received all " + dlyd + " payments from MARA. " +
      "However, the total MARA sponsorship (" + formatRM(pinjaman) + ") is less than UTP's actual tuition fee (" + formatRM(prog.totalFee) + ").</p>" +
      "<p style='margin-top:8px;'>You will need to settle the remaining <strong>" + formatRM(outOfPocketTotal) + "</strong> to UTP.</p>" +
      "<p style='margin-top:8px;font-size:0.85rem;'><em>Please refer to the sidebar for alternative options to cover the shortfall.</em></p>";

  } else if (balance > 0 && isPartialCoverage) {
    // SCENARIO 4: Payments still pending, partial/half coverage
    scenarioBox.className = "scenario-box scenario-pending";
    scenarioBox.innerHTML =
      "<h3>🔄 Partial Coverage — Payments Pending</h3>" +
      "<p>Your MARA scholarship covers <strong>" + coveragePercent + "%</strong> of the programme " +
      "(Lampiran A: " + formatRM(userTotalTuition) + " out of UTP actual: " + formatRM(prog.totalFee) + ").</p>" +
      "<p style='margin-top:8px;'>You have <strong>" + balance + " remaining payment" + (balance !== 1 ? "s" : "") + "</strong> to receive from MARA.</p>" +
      (outOfPocketTotal > 0 ?
        "<p style='margin-top:8px;'>After all MARA payments are received, you will still need to settle <strong>" + formatRM(outOfPocketTotal) + "</strong> out-of-pocket to UTP.</p>" +
        "<p style='margin-top:8px;font-size:0.85rem;'><em>Please refer to the sidebar for alternative options to cover the shortfall.</em></p>" : "") +
      '<p style="margin-top:8px;font-size:0.82rem;font-style:italic;">*All MARA payments are subject to MARA approval</p>';

  } else if (balance > 0 && outOfPocketTotal === 0) {
    // SCENARIO 5: Payments pending, but will be fully covered once all received
    scenarioBox.className = "scenario-box scenario-pending";
    scenarioBox.innerHTML =
      "<h3>🔄 Payments Pending — On Track</h3>" +
      "<p>You have <strong>" + balance + " remaining payment" + (balance !== 1 ? "s" : "") + "</strong> to receive from MARA. " +
      "Once all " + dlyd + " payments are received, your tuition fee will be fully covered.</p>" +
      '<p style="margin-top:8px;font-size:0.82rem;font-style:italic;">*Subject to MARA approval</p>';

  } else {
    // SCENARIO 6: Payments pending, with out-of-pocket (full Lampiran A but short duration)
    scenarioBox.className = "scenario-box scenario-pending";
    scenarioBox.innerHTML =
      "<h3>🔄 Payments Pending — Outstanding Balance Expected</h3>" +
      "<p>You have <strong>" + balance + " remaining payment" + (balance !== 1 ? "s" : "") + "</strong> to receive from MARA.</p>" +
      "<p style='margin-top:8px;'>Even after all MARA payments are received, there will be an outstanding balance of <strong>" + formatRM(outOfPocketTotal) + "</strong> " +
      "that you will need to settle to UTP.</p>" +
      "<p style='margin-top:8px;font-size:0.85rem;'><em>Please refer to the sidebar for alternative options to cover the shortfall.</em></p>" +
      '<p style="margin-top:8px;font-size:0.82rem;font-style:italic;">*Subject to MARA approval</p>';
  }
}

// ---------- Start Over ----------
btnBack4.addEventListener("click", () => {
  // Reset state
  state = {
    yearCategory: null,
    programme: null,
    maraType: "YTP_DIRECT",
    totalTuitionFee: null,
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
    r.checked = r.value === "YTP_DIRECT";
  });
  
  // Restore sidebar to scholarship selector
  const sidebarLeft = document.querySelector(".sidebar-left");
  sidebarLeft.innerHTML =
    '<h3 class="sidebar-title">Select Your MARA Scholarship Type</h3>' +
    '<p style="font-size:0.9rem; margin-bottom:15px; color:var(--gray-600);">Choose the MARA scholarship you are enrolled under.</p>' +
    '<div class="scroll-list-box" id="maraListBox" style="max-height: none; background: transparent; padding: 0;">' +
    '<div class="radio-group" id="maraType" style="flex-direction: column;">' +
    '<label class="radio-card">' +
    '<input type="radio" name="maraScholarship" value="YTP_DIRECT" checked />' +
    '<div class="radio-content">' +
    '<span class="radio-title">MARA YTP (Direct Programme to UTP)</span>' +
    '</div>' +
    '</label>' +
    '<label class="radio-card">' +
    '<input type="radio" name="maraScholarship" value="EDU" />' +
    '<div class="radio-content">' +
    '<span class="radio-title">MARA EDU</span>' +
    '</div>' +
    '</label>' +
    '</div>' +
    '</div>' +
    '<div class="notice notice-good" id="hostelNotice" style="margin-top: 15px;">' +
    '<strong>Hostel fees are covered</strong> under your MARA scholarship. Your hostel accommodation charges will be included in the MARA disbursement.' +
    '</div>';

  // Re-attach radio listeners
  document.querySelectorAll('input[name="maraScholarship"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      state.maraType = radio.value;
      const covered = HOSTEL_COVERED.includes(state.maraType);
      const hostelNoticeEl = document.getElementById("hostelNotice");
      hostelNoticeEl.classList.remove("hidden", "notice-good", "notice-warn");
      if (covered) {
        hostelNoticeEl.className = "notice notice-good";
        hostelNoticeEl.style.marginTop = "15px";
        hostelNoticeEl.innerHTML =
          "<strong>Hostel fees are covered</strong> under your MARA scholarship. " +
          "Your hostel accommodation charges will be included in the MARA disbursement.";
      } else {
        hostelNoticeEl.className = "notice notice-warn";
        hostelNoticeEl.style.marginTop = "15px";
        hostelNoticeEl.innerHTML =
          "<strong>Hostel fees are not covered</strong> under your MARA scholarship. " +
          "You will need to settle hostel accommodation charges separately.";
      }
      if (document.getElementById("panel-3").classList.contains("active")) {
        calculateResults();
      }
    });
  });

  totalTuitionInput.value = "";
  ydInput.value = "";
  maraStartDate.value = "";
  maraEndDate.value = "";
  allocationStatus.classList.add("hidden");
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

// ---------- Lampiran A Overlay ----------
const btnLampiranInfo = document.getElementById("btnLampiranInfo");
const lampiranOverlay = document.getElementById("lampiranOverlay");
const btnCloseLampiran = document.getElementById("btnCloseLampiran");

if (btnLampiranInfo) {
  btnLampiranInfo.addEventListener("click", () => {
    lampiranOverlay.classList.remove("hidden");
  });
}

if (btnCloseLampiran) {
  btnCloseLampiran.addEventListener("click", () => {
    lampiranOverlay.classList.add("hidden");
  });
}

if (lampiranOverlay) {
  lampiranOverlay.addEventListener("click", (e) => {
    if (e.target === lampiranOverlay) {
      lampiranOverlay.classList.add("hidden");
    }
  });
}

// ---------- Lampiran A Total Fee Overlay ----------
const btnLampiranTotalFeeInfo = document.getElementById("btnLampiranTotalFeeInfo");
const lampiranTotalFeeOverlay = document.getElementById("lampiranTotalFeeOverlay");
const btnCloseLampiranTotalFee = document.getElementById("btnCloseLampiranTotalFee");

if (btnLampiranTotalFeeInfo) {
  btnLampiranTotalFeeInfo.addEventListener("click", () => {
    lampiranTotalFeeOverlay.classList.remove("hidden");
  });
}

if (btnCloseLampiranTotalFee) {
  btnCloseLampiranTotalFee.addEventListener("click", () => {
    lampiranTotalFeeOverlay.classList.add("hidden");
  });
}

if (lampiranTotalFeeOverlay) {
  lampiranTotalFeeOverlay.addEventListener("click", (e) => {
    if (e.target === lampiranTotalFeeOverlay) {
      lampiranTotalFeeOverlay.classList.add("hidden");
    }
  });
}
