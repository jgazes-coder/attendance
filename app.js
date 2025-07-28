window.onerror = function(message, url, line) {
  console.error("Global error:", message, "at line", line);
};

// Global variables
let attendanceData = [];
let ptoData = [];

// File upload handler
document.getElementById('uploadBtn').addEventListener('click', function() {
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;
    
    attendanceData = [];
    ptoData = [];
    
    if (attendanceFiles.length > 0) {
        processFiles(attendanceFiles, 'attendance');
    }
    
    if (ptoFiles.length > 0) {
        processFiles(ptoFiles, 'pto');
    }
});

// CSV parsing function
function processFiles(files, type) {
    Array.from(files).forEach(file => {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                const processed = results.data.map(item => ({
                    ...item,
                    type: type,
                    date: type === 'attendance' ? item.date_in_office : item.start_pto
                }));
                
                if (type === 'attendance') {
                    attendanceData.push(...processed);
                } else {
                    ptoData.push(...processed);
                }
            },
            error: function(error) {
                console.error("CSV error:", error);
            }
        });
    });
}

// Report generation
document.getElementById('generateReportBtn').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select both dates!');
        return;
    }
    
    // Convert YYYY-MM-DD to numeric (e.g., "2025-07-28" → 20250728)
    const startNum = parseInt(startDate.replace(/-/g, ''));
    const endNum = parseInt(endDate.replace(/-/g, ''));
    
    const filteredData = [...attendanceData, ...ptoData].filter(item => {
        const date = parseInt(item.date);
        return date >= startNum && date <= endNum;
    });
    
    displayResults(filteredData);
});

// Display results in table
function displayResults(data) {
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.empID}</td>
            <td>${item.fullname}</td>
            <td>${item.date}</td>
            <td>${item.type === 'attendance' ? 'Attendance' : 'PTO'}</td>
        `;
        tableBody.appendChild(row);
    });
}
console.log("Script loaded!");
console.log("Upload button exists:", !!document.getElementById('uploadBtn'));
console.log("Report button exists:", !!document.getElementById('generateReportBtn'));
