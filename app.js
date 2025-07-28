console.log("=== DEBUG MODE ===");

// Debug: Log all clicks on the page
document.addEventListener('click', (e) => {
  console.log("Clicked:", e.target.id || e.target.tagName);
});

// Global variables
window.attendanceData = [];
window.ptoData = [];

// Super-simple upload test
document.getElementById('uploadBtn').addEventListener('click', function() {
  console.log("--- UPLOAD BUTTON CLICKED ---");
  alert("Upload button works!"); // Simple verification
  
  const testData = [{empID: "999", fullname: "Test", date: "45810", type: "debug"}];
  window.attendanceData = testData;
  console.log("Test data loaded:", testData);
});

// Basic report generation
document.getElementById('generateReportBtn').addEventListener('click', function() {
  console.log("--- REPORT BUTTON CLICKED ---");
  console.log("Current data:", {
    attendance: window.attendanceData,
    pto: window.ptoData
  });
  
  if (window.attendanceData.length === 0 && window.ptoData.length === 0) {
    alert("No data loaded! Click Upload first.");
    return;
  }
  
  alert(`Report would run with ${window.attendanceData.length + window.ptoData.length} records`);
});
