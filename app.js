// ==============================================
// EMPLOYEE ATTENDANCE/PTO REPORTING TOOL
// ==============================================

// Global data stores with validation
window.attendanceData = [];
window.ptoData = [];

// ==============================================
// FILE PROCESSING
// ==============================================

/**
 * Validates and processes uploaded CSV files
 */
function processFiles(files, type) {
  const requiredFields = {
    attendance: ['empID', 'fullname', 'date_in_office'],
    pto: ['empID', 'fullname', 'start_pto']
  };

  Array.from(files).forEach(file => {
    console.log(`Processing ${type} file: ${file.name}`);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Validate file structure
          const missingFields = requiredFields[type].filter(
            field => !results.meta.fields.includes(field)
          );
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          // Process valid records
          const processed = results.data
            .map(item => {
              // Normalize data
              const record = {
                empID: item.empID,
                fullname: item.fullname || `${item.firstname || ''} ${item.lastname || ''}`.trim(),
                type: type,
                date: type === 'attendance' ? item.date_in_office : item.start_pto
              };
              
              // Validate critical fields
              if (!record.empID) throw new Error("Record missing empID");
              if (!record.date) throw new Error("Record missing date");
              
              return record;
            })
            .filter(Boolean);

          // Store processed data
          if (type === 'attendance') {
            window.attendanceData.push(...processed);
          } else {
            window.ptoData.push(...processed);
          }

          console.log(`Successfully processed ${processed.length} records from ${file.name}`);
          
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error.message);
          alert(`Error in ${file.name}:\n${error.message}\n\nCheck console for details.`);
        }
      },
      error: (error) => {
        console.error(`Parse error in ${file.name}:`, error);
        alert(`Cannot parse ${file.name} as CSV.\nFile may be corrupt or incorrectly formatted.`);
      }
    });
  });
}

// ==============================================
// REPORT GENERATION
// ==============================================

/**
 * Generates filtered report based on date range
 */
function generateReport() {
  try {
    // Get and validate date inputs
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;
    
    const startDate = startInput ? parseInt(startInput.replace(/-/g, '')) : null;
    const endDate = endInput ? parseInt(endInput.replace(/-/g, '')) : null;
    
    if (startDate && endDate && startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }

    // Combine and filter data
    const allRecords = [
      ...window.attendanceData,
      ...window.ptoData
    ].filter(record => {
      try {
        const recordDate = parseInt(record.date);
        if (isNaN(recordDate)) {
          console.warn(`Invalid date format in record:`, record);
          return false;
        }
        return (!startDate || recordDate >= startDate) && 
               (!endDate || recordDate <= endDate);
      } catch (error) {
        console.warn(`Error processing record:`, record, error);
        return false;
      }
    })
    .sort((a, b) => parseInt(a.date) - parseInt(b.date));

    // Display results
    const tableBody = document.querySelector('#reportTable tbody');
    if (!tableBody) throw new Error("Report table not found in page");
    
    if (allRecords.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No matching records found</td></tr>`;
      alert("No records match your criteria.\n\nPossible reasons:\n- No files uploaded\n- Date range too narrow\n- Data format issues");
      return;
    }

    tableBody.innerHTML = allRecords.map(record => `
      <tr>
        <td>${record.empID}</td>
        <td>${record.fullname || 'Unknown'}</td>
        <td>${record.date}</td>
        <td>${record.type.toUpperCase()}</td>
      </tr>
    `).join('');

    console.log(`Report generated with ${allRecords.length} records`);
    
  } catch (error) {
    console.error("Report generation failed:", error);
    alert(`Report error:\n${error.message}\n\nSee console for details.`);
  }
}

// ==============================================
// added code to download file
// ==============================================

/**
 * Exports filtered data as CSV download
 */
function exportToCSV() {
  try {
    // Get current filtered data (same logic as generateReport)
    const allRecords = [
      ...window.attendanceData,
      ...window.ptoData
    ].sort((a, b) => parseInt(a.date) - parseInt(b.date));

    if (allRecords.length === 0) {
      alert("No data to export. Generate a report first.");
      return;
    }

    // Convert to CSV format
    const headers = ["Employee ID", "Full Name", "Date", "Type"];
    const csvRows = [
      headers.join(","),
      ...allRecords.map(record => 
        `"${record.empID}","${record.fullname || ''}","${record.date}","${record.type}"`
      )
    ];

    // Create download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employee_report_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Exported CSV with", allRecords.length, "records");
    
  } catch (error) {
    console.error("Export failed:", error);
    alert("Error generating CSV file. See console for details.");
  }
}


// ==============================================
// EVENT LISTENERS
// ==============================================

document.getElementById('uploadBtn').addEventListener('click', function() {
  try {
    // Clear previous data
    window.attendanceData = [];
    window.ptoData = [];
    
    // Process new files
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;
    
    if (attendanceFiles.length === 0 && ptoFiles.length === 0) {
      alert("Please select at least one file to upload");
      return;
    }
    
    if (attendanceFiles.length > 0) processFiles(attendanceFiles, 'attendance');
    if (ptoFiles.length > 0) processFiles(ptoFiles, 'pto');
    
    alert(`Processing ${attendanceFiles.length + ptoFiles.length} file(s)...\n\nCheck console for details.`);
    
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. See console for details.");
  }
});

document.getElementById('generateReportBtn').addEventListener('click', generateReport);

// =============================================
// added event listener for new download button
// =============================================

document.getElementById('exportBtn').addEventListener('click', exportToCSV);

// ==============================================
// INITIALIZATION
// ==============================================

console.log("Attendance/PTO Tool initialized");
console.log("Data stores ready:", {
  attendance: window.attendanceData,
  pto: window.ptoData
});
