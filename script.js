// =========================================================
// FoodGuard - Food Safety & Restaurant Inspection Portal
// Course Alignment: CSE326 - Semantic HTML, CSS & JavaScript
// =========================================================

// 1. Authorized Food Safety Inspectors
var inspectors = {
  "Manohar Krishna": "converter",
  "Mani Kumar": "gangstar",
  "sharan teja": "gurram",
  "Ankita Jaiswal": "cse326"
};

// Titles of the 5 inspection stages
var stageTitles = [
  "Restaurant Info",
  "Food Quality & Storage",
  "Kitchen Cleanliness & Hygiene",
  "Dining Ambiance & Environment",
  "Staff Health & Personal Hygiene",
  "Water Quality & Waste Management"
];

var currentInspector = "";
var today = new Date().toISOString().split("T")[0];

// 2. Preloaded Verified Reports for Public View
var defaultReports = [
  {
    id: "REP-101",
    restName: "Green Leaf Bistro",
    license: "11521034000892",
    date: "2026-11-10",
    estType: "Dine-in Restaurant",
    location: "Shop 14, Food Court, Grand Mall",
    inspector: "Manohar Krishna",
    scores: [19, 18, 19, 20, 18],
    grandTotal: 94,
    overallGrade: "A"
  },
  {
    id: "REP-102",
    restName: "Royal Spice Biryani",
    license: "11520012004551",
    date: "2026-11-08",
    estType: "Dine-in Restaurant",
    location: "42 MG Road, City Center",
    inspector: "Mani Kumar",
    scores: [17, 16, 15, 17, 16],
    grandTotal: 81,
    overallGrade: "B"
  },
  {
    id: "REP-103",
    restName: "Golden Spoon Cafe",
    license: "11522045001198",
    date: "2026-11-05",
    estType: "Cafe & Bakery",
    location: "Plot 9, IT Tech Park Avenue",
    inspector: "sharan teja",
    scores: [15, 14, 13, 14, 15],
    grandTotal: 71,
    overallGrade: "C"
  },
  {
    id: "REP-104",
    restName: "Highway Fast Food Corner",
    license: "11519023000412",
    date: "2026-11-02",
    estType: "Fast Food & QSR",
    location: "Sector 4, Bypass Junction",
    inspector: "Ankita Jaiswal",
    scores: [11, 10, 9, 10, 12],
    grandTotal: 52,
    overallGrade: "D"
  }
];

// 3. Storage Helpers (localStorage)
function getStoredReports() {
  try {
    var saved = localStorage.getItem("foodInspectorReports");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Storage read error:", e);
  }
  return [];
}

function getAllReports() {
  var userReports = getStoredReports();
  var merged = userReports.slice();

  for (var i = 0; i < defaultReports.length; i++) {
    var def = defaultReports[i];
    var exists = false;
    for (var j = 0; j < userReports.length; j++) {
      if (userReports[j].license === def.license || 
          userReports[j].restName.toLowerCase() === def.restName.toLowerCase()) {
        exists = true;
        break;
      }
    }
    if (!exists) merged.push(def);
  }
  return merged;
}

function saveNewReport(newReport) {
  try {
    var stored = getStoredReports();
    var foundIndex = -1;
    for (var i = 0; i < stored.length; i++) {
      if (stored[i].license === newReport.license || 
          stored[i].restName.toLowerCase() === newReport.restName.toLowerCase()) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex !== -1) {
      stored[foundIndex] = newReport;
    } else {
      stored.unshift(newReport);
    }
    localStorage.setItem("foodInspectorReports", JSON.stringify(stored));
  } catch (e) {
    console.error("Storage write error:", e);
  }
}

// 4. Page Navigation Router (Home / Public Reports / Login / Dashboard)
function navigateTo(page) {
  var homeEl = document.getElementById("homePage");
  var publicEl = document.getElementById("publicPage");
  var loginEl = document.getElementById("loginPage");
  var dashEl = document.getElementById("dashboard");
  var navHome = document.getElementById("navHome");

  if (navHome) {
    if (page === "home") {
      navHome.classList.add("active");
    } else {
      navHome.classList.remove("active");
    }
  }

  if (homeEl) homeEl.style.display = (page === "home") ? "block" : "none";
  if (publicEl) publicEl.style.display = (page === "reports") ? "block" : "none";

  if (page === "reports") {
    searchPublicReports();
  }

  if (page === "login") {
    if (currentInspector) {
      if (loginEl) loginEl.style.display = "none";
      if (dashEl) dashEl.style.display = "block";
    } else {
      if (loginEl) loginEl.style.display = "block";
      if (dashEl) dashEl.style.display = "none";
    }
  } else {
    if (page !== "dashboard") {
      if (loginEl) loginEl.style.display = "none";
      if (dashEl) dashEl.style.display = "none";
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToPillars() {
  navigateTo("home");
  setTimeout(function() {
    var el = document.getElementById("pillarsSection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 100);
}

// 5. Public Search Functionality
function searchPublicReports() {
  var input = document.getElementById("publicSearchInput");
  var filter = input ? input.value.trim().toLowerCase() : "";
  var container = document.getElementById("publicReportsList");
  if (!container) return;

  var allReports = getAllReports();
  var filtered = [];

  for (var i = 0; i < allReports.length; i++) {
    var r = allReports[i];
    if (filter === "" || r.restName.toLowerCase().indexOf(filter) !== -1) {
      filtered.push(r);
    }
  }

  if (filtered.length === 0) {
    container.innerHTML =
      "<div class='empty-reports'>" +
      "<p>No certified restaurant reports found matching \"<strong>" + escapeHtml(filter) + "</strong>\".</p>" +
      "<p style='font-size:0.85rem; color:#90a4ae;'>Try searching for 'Green Leaf', 'Royal Spice', or 'Golden Spoon'.</p>" +
      "</div>";
    return;
  }

  var html = "";
  for (var j = 0; j < filtered.length; j++) {
    var rep = filtered[j];
    var gradeCls = getGradeClass(rep.overallGrade);

    html += "<div class='public-report-card'>";
    html += "  <div class='card-main'>";
    html += "    <h4>" + escapeHtml(rep.restName) + "</h4>";
    html += "    <p class='card-meta'>";
    html += "      <strong>License:</strong> " + escapeHtml(rep.license) + " | <strong>Category:</strong> " + escapeHtml(rep.estType) + "<br>";
    html += "      <strong>Audited on:</strong> " + rep.date + " | <strong>Inspector:</strong> " + escapeHtml(rep.inspector);
    html += "    </p>";
    html += "  </div>";
    html += "  <div class='card-score'>";
    html += "    <span class='score-text'>" + rep.grandTotal + " / 100 Pts</span>";
    html += "    <span class='grade-badge " + gradeCls + "'>Grade " + rep.overallGrade + "</span>";
    html += "    <button type='button' class='btn btn-primary' onclick=\"viewPublicReport('" + rep.id + "')\">View Certificate</button>";
    html += "  </div>";
    html += "</div>";
  }

  container.innerHTML = html;
}

function quickSearch(term) {
  var input = document.getElementById("publicSearchInput");
  if (input) {
    input.value = term;
    searchPublicReports();
  }
}

// 6. View Public Report Certificate in Modal
function viewPublicReport(reportId) {
  var allReports = getAllReports();
  var found = null;
  for (var i = 0; i < allReports.length; i++) {
    if (allReports[i].id === reportId) {
      found = allReports[i];
      break;
    }
  }

  if (!found) {
    alert("Report not found.");
    return;
  }

  var modalBody = document.getElementById("modalReportBody");
  modalBody.innerHTML = renderCertificateHTML(found);

  var modal = document.getElementById("reportModal");
  modal.style.display = "flex";
}

function closeModal(event) {
  if (!event || event.target.id === "reportModal" || !event.target.closest) {
    document.getElementById("reportModal").style.display = "none";
  }
}

function downloadModalImage() {
  var box = document.getElementById("modalReportBody");
  if (!box || typeof html2canvas === "undefined") {
    alert("Image export library not loaded. Check internet connection.");
    return;
  }

  html2canvas(box, { backgroundColor: "#ffffff", scale: 2 }).then(function(canvas) {
    var link = document.createElement("a");
    link.download = "foodguard-certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// 7. Inspector Authentication (login / logout)
function login() {
  var userInput = document.getElementById("username").value.trim();
  var passInput = document.getElementById("password").value.trim();
  var msg = document.getElementById("loginMsg");

  var matchedUser = null;
  for (var name in inspectors) {
    if (name.toLowerCase() === userInput.toLowerCase()) {
      matchedUser = name;
      break;
    }
  }

  if (matchedUser && inspectors[matchedUser] === passInput) {
    currentInspector = matchedUser;
    sessionStorage.setItem("loggedInspector", currentInspector);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("homePage").style.display = "none";
    document.getElementById("publicPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("userStatus").style.display = "flex";
    document.getElementById("officerNameDisplay").textContent = currentInspector;
    document.getElementById("inspector").value = currentInspector;

    var btnBack = document.getElementById("btnBackToAudit");
    if (btnBack) btnBack.style.display = "none";

    showStage(0);
    calculateAllStages();
  } else {
    msg.textContent = "Invalid username or password. Please try again.";
    msg.style.display = "block";
  }
}

function logout() {
  sessionStorage.removeItem("loggedInspector");
  currentInspector = "";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("userStatus").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginMsg").style.display = "none";

  var btnBack = document.getElementById("btnBackToAudit");
  if (btnBack) btnBack.style.display = "none";

  navigateTo("home");
}

// 8. 5-Stage Audit Navigation & Grading
function showStage(index) {
  for (var i = 0; i <= 6; i++) {
    var stageEl = document.getElementById("stage" + i);
    if (stageEl) {
      stageEl.style.display = (i === index) ? "block" : "none";
    }
  }

  var tabs = document.querySelectorAll(".tab-link");
  for (var j = 0; j < tabs.length; j++) {
    if (j === index) {
      tabs[j].classList.add("active");
    } else {
      tabs[j].classList.remove("active");
    }
  }

  var btnBack = document.getElementById("btnBackToAudit");
  if (btnBack) btnBack.style.display = "none";

  if (index === 6) {
    generateAndPublishReport();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getGrade(score, maxScore) {
  var pct = (score / maxScore) * 100;
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 60) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function getGradeClass(grade) {
  return "grade-" + (grade || "f").toLowerCase();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateStage(stageNum) {
  var s1 = Number(document.getElementById("s" + stageNum + "_1").value) || 0;
  var s2 = Number(document.getElementById("s" + stageNum + "_2").value) || 0;
  var s3 = Number(document.getElementById("s" + stageNum + "_3").value) || 0;
  var s4 = Number(document.getElementById("s" + stageNum + "_4").value) || 0;

  var total = s1 + s2 + s3 + s4;
  var grade = getGrade(total, 20);

  var scoreEl = document.getElementById("score" + stageNum);
  var badgeEl = document.getElementById("grade" + stageNum);

  if (scoreEl) scoreEl.textContent = total;
  if (badgeEl) {
    badgeEl.textContent = grade;
    badgeEl.className = "grade-badge " + getGradeClass(grade);
  }

  return total;
}

function calculateAllStages() {
  for (var i = 1; i <= 5; i++) {
    updateStage(i);
  }
}

// 9. Render Certificate & Publish
function renderCertificateHTML(rep) {
  var html = "";
  html += "<div class='certificate-container'>";
  html += "  <div class='cert-header'>";
  html += "    <h2>FoodGuard Official Inspection Certificate</h2>";
  html += "    <p>FoodGuard Authority | Food Safety &amp; Hygiene Standards</p>";
  html += "  </div>";

  html += "  <div class='cert-summary'>";
  html += "    <div>";
  html += "      <h4>Overall Safety Rating: Grade " + rep.overallGrade + "</h4>";
  html += "      <p>Total Score: <strong>" + rep.grandTotal + " / 100 Points</strong></p>";
  html += "    </div>";
  html += "    <span class='grade-badge " + getGradeClass(rep.overallGrade) + "' style='font-size:1.2rem; padding:6px 14px;'>Grade " + rep.overallGrade + "</span>";
  html += "  </div>";

  html += "  <div class='cert-details'>";
  html += "    <p><strong>Establishment:</strong> " + escapeHtml(rep.restName) + "</p>";
  html += "    <p><strong>License No:</strong> " + escapeHtml(rep.license) + "</p>";
  html += "    <p><strong>Date:</strong> " + rep.date + "</p>";
  html += "    <p><strong>Category:</strong> " + escapeHtml(rep.estType) + "</p>";
  html += "    <p><strong>Address:</strong> " + escapeHtml(rep.location) + "</p>";
  html += "    <p><strong>Inspector:</strong> " + escapeHtml(rep.inspector) + "</p>";
  html += "  </div>";

  html += "  <table>";
  html += "    <thead><tr><th>Stage</th><th>Inspection Area</th><th>Points (Max 20)</th><th>Grade</th></tr></thead>";
  html += "    <tbody>";
  for (var k = 0; k < 5; k++) {
    var stageScore = (rep.scores && rep.scores[k] !== undefined) ? rep.scores[k] : 0;
    var stageGrade = getGrade(stageScore, 20);
    html += "      <tr>";
    html += "        <td>Stage " + (k + 1) + "</td>";
    html += "        <td>" + stageTitles[k + 1] + "</td>";
    html += "        <td>" + stageScore + " / 20</td>";
    html += "        <td><span class='grade-badge " + getGradeClass(stageGrade) + "'>" + stageGrade + "</span></td>";
    html += "      </tr>";
  }
  html += "    </tbody>";
  html += "    <tfoot><tr><td colspan='2'>Grand Total Score</td><td>" + rep.grandTotal + " / 100</td><td>Grade " + rep.overallGrade + "</td></tr></tfoot>";
  html += "  </table>";

  html += "  <div class='cert-footer'>";
  html += "    <div><p>Inspecting Officer: <strong>" + escapeHtml(rep.inspector) + "</strong></p><div class='sign-line'>Authorized Signature</div></div>";
  html += "    <div><p>Status: <strong>Official Record</strong></p><p>Verified on " + rep.date + "</p></div>";
  html += "  </div>";
  html += "</div>";

  return html;
}

function generateAndPublishReport() {
  var restName = document.getElementById("restName").value.trim() || "Restaurant";
  var license = document.getElementById("fssaiLicense").value.trim() || "N/A";
  var date = document.getElementById("inspDate").value || today;
  var estType = document.getElementById("establishmentType").value;
  var location = document.getElementById("location").value.trim() || "-";
  var inspector = currentInspector || "Officer";

  var scores = [];
  var grandTotal = 0;

  for (var i = 1; i <= 5; i++) {
    var stageScore = updateStage(i);
    scores.push(stageScore);
    grandTotal += stageScore;
  }

  var overallGrade = getGrade(grandTotal, 100);

  var newReport = {
    id: "REP-" + Date.now(),
    restName: restName,
    license: license,
    date: date,
    estType: estType,
    location: location,
    inspector: inspector,
    scores: scores,
    grandTotal: grandTotal,
    overallGrade: overallGrade
  };

  document.getElementById("reportBox").innerHTML = renderCertificateHTML(newReport);
  saveNewReport(newReport);
  searchPublicReports();

  var promptBox = document.getElementById("generatePromptBox");
  var successCard = document.getElementById("publishSuccessCard");
  var nameEl = document.getElementById("publishedRestName");
  var officerEl = document.getElementById("publishedOfficer");

  if (promptBox) promptBox.style.display = "none";
  if (successCard) successCard.style.display = "block";
  if (nameEl) nameEl.textContent = restName;
  if (officerEl) officerEl.textContent = inspector;

  return newReport;
}

function generateReport() {
  return generateAndPublishReport();
}

function viewInPublicPortal() {
  var restName = document.getElementById("restName").value.trim() || "Green Leaf Bistro";
  navigateTo("reports");

  var btnBack = document.getElementById("btnBackToAudit");
  if (btnBack && currentInspector) btnBack.style.display = "inline-block";

  var searchInput = document.getElementById("publicSearchInput");
  if (searchInput) {
    searchInput.value = restName;
    searchPublicReports();
  }
}

function returnToDashboard() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("publicPage").style.display = "none";
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  var btnBack = document.getElementById("btnBackToAudit");
  if (btnBack) btnBack.style.display = "none";
  showStage(6);
}

function startNewAudit() {
  document.getElementById("restName").value = "";
  document.getElementById("fssaiLicense").value = "";
  document.getElementById("location").value = "";
  for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 4; j++) {
      var el = document.getElementById("s" + i + "_" + j);
      if (el) el.value = 5;
    }
  }
  calculateAllStages();

  var promptBox = document.getElementById("generatePromptBox");
  var successCard = document.getElementById("publishSuccessCard");
  if (promptBox) promptBox.style.display = "block";
  if (successCard) successCard.style.display = "none";

  showStage(0);
}

// 10. Initialization on Page Load
if (document.getElementById("inspDate")) {
  document.getElementById("inspDate").value = today;
}

var savedUser = sessionStorage.getItem("loggedInspector");
if (savedUser && inspectors[savedUser]) {
  currentInspector = savedUser;
  document.getElementById("userStatus").style.display = "flex";
  document.getElementById("officerNameDisplay").textContent = currentInspector;
  document.getElementById("inspector").value = currentInspector;
}

// Default view
navigateTo("home");
