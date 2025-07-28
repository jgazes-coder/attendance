// Debug logger
console.log("=== DEBUG INIT ===");

// Global data stores
window.attendanceData = [];
window.ptoData = [];

// 1. Upload Button
document.getElementById('uploadBtn').addEventListener('click', function() {
    console.log("[DEBUG] Upload button clicked");
    alert("Upload button works!"); // Simple verification
    
    // Manually load test data
    window.attendanceData = [
        { empID: "1154", fullname: "Hahn, Amy", date: "45810", type: "attendance" }
    ];
    console.log("Test data loaded:", window.attendanceData);
});

// 2. Report Button
document.getElementById('generateReportBtn').addEventListener('click', function() {
    console.log("[DEBUG] Report button clicked");
    alert(`Report would show ${window.attendanceData.length} records`);
});
