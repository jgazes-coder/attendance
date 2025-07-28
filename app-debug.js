/***********************
 * DEBUG MODE ENABLED
 * Complete working version with error handling
 ***********************/

console.log("=== DEBUG INIT ===");

// Global data stores with test data
window.attendanceData = [
  { 
    empID: "1154", 
    fullname: "Hahn, Amy", 
    date: "45810", 
    type: "attendance",
    date_in_office: "45810" // Added for CSV compatibility
  }
];

window.ptoData = [
  { 
    id_num: "9999", 
    lastname: "Doe", 
    firstname: "John", 
    fullname: "Doe, John", 
    empID: "1155", 
    region: "New York", 
    start_pto: "45811" 
  }
];

// --------------------------------------------------
// FILE UPLOAD HANDLER (SIMPLIFIED)
// --------------------------------------------------
document.getElementById('uploadBtn').addEventListener('click', function() {
  try {
    console.log("--- UPLOAD BUTTON CLICKED ---");
    
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;
    
    console.log(`Found ${attendanceFiles.length} attendance files`);
    console.log(`Found ${ptoFiles.length} PTO files`);
    
    // For now, just log files - we'll process them later
    Array.from(attendanceFiles).forEach(file => {
      console.log("Attendance file:", file.name);
    });
    
    Array.from(ptoFiles).forEach(file => {
      console.log("PTO file:", file.name);
    });
    
    alert("File selection working! Data processing will be added next.");
    
  } catch (error) {
    console.error("Upload error:", error);
    alert("Error during upload. Check console.");
  }
});

// --------------------------------------------------
// REPORT GENERATION (FULLY WORKING VERSION)
// --------------------------------------------------
document.getElementById('generateReportBtn').addEventListener('click', function() {
  try {
    console.log("--- REPORT BUTTON CLICKED ---");
    
    // 1. Verify data exists
    console.log("Current Attendance Data:", JSON.stringify(window.attendanceData, null, 2));
    console.log("Current PTO Data:", JSON.stringify(window.ptoData, null, 2));
    
    // 2. Transform all data to common format
    const allAttendance = window.attendanceData.map(item => ({
      empID: item.empID,
      fullname: item.fullname || `${item.firstname} ${item.lastname}`,
      date: item.date || item.date_in_office,
      type: 'attendance'
    }));
    
    const allPTO = window.ptoData.map(item => ({
      empID: item.empID,
      fullname: item.fullname || `${item.firstname} ${item.lastname}`,
      date: item.start_pto,
      type: 'pto'
    }));
    
    const combinedData = [...allAttendance, ...allPTO];
    console.log("Combined Data:", JSON.stringify(combinedData, null, 2));
    
    // 3. Sort by date (ascending)
    combinedData.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    
    // 4. Generate table rows
    const tableBody = document.querySelector('#reportTable tbody');
    if (!tableBody) {
      throw new Error("Missing table body - check your HTML for #reportTable tbody");
    }
    
    tableBody.innerHTML = combinedData.map(item => `
      <tr>
        <td>${item.empID}</td>
        <td>${item.fullname}</td>
        <td>${item.date}</td>
        <td>${item.type.toUpperCase()}</td>
      </tr>
    `).join('');
    
    console.log(`Displayed ${combinedData.length} records`);
    alert(`Report generated with ${combinedData.length} records!`);
    
  } catch (error) {
    console.error("Report generation failed:", error);
    alert("Error generating report. Check console for details.");
  }
});

// --------------------------------------------------
// INITIALIZATION CHECK
// --------------------------------------------------
console.log("Element checks:");
console.log("Upload button:", document.getElementById('uploadBtn') ? "FOUND" : "MISSING");
console.log("Report button:", document.getElementById('generateReportBtn') ? "FOUND" : "MISSING");
console.log("Table body:", document.querySelector('#reportTable tbody') ? "FOUND" : "MISSING");

console.log("=== DEBUG READY ===");
