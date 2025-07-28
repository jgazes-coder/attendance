// Global data stores
window.attendanceData = [];
window.ptoData = [];

// File processing
function processFiles(files, type) {
  Array.from(files).forEach(file => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const processed = results.data.map(item => ({
          ...item,
          type: type,
          date: type === 'attendance' ? item.date_in_office : item.start_pto
        }));
        
        if (type === 'attendance') {
          window.attendanceData.push(...processed);
        } else {
          window.ptoData.push(...processed);
        }
        console.log(`Processed ${file.name}`, processed.slice(0, 2)); // Log first 2 rows
      },
      error: (error) => {
        console.error(`Error parsing ${file.name}:`, error);
        alert(`Error processing ${file.name}. See console.`);
      }
    });
  });
}

// Upload handler
document.getElementById('uploadBtn').addEventListener('click', function() {
  try {
    window.attendanceData = [];
    window.ptoData = [];
    
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;
    
    if (attendanceFiles.length > 0) processFiles(attendanceFiles, 'attendance');
    if (ptoFiles.length > 0) processFiles(ptoFiles, 'pto');
    
    alert(`Processing ${attendanceFiles.length + ptoFiles.length} files...`);
    
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed. See console.");
  }
});

// Report generation
document.getElementById('generateReportBtn').addEventListener('click', function() {
  try {
    const startNum = document.getElementById('startDate').value?.replace(/-/g, '');
    const endNum = document.getElementById('endDate').value?.replace(/-/g, '');
    
    const filteredData = [
      ...window.attendanceData,
      ...window.ptoData.map(item => ({ ...item, type: 'pto' }))
    ].filter(item => {
      const date = item.date.toString();
      return (!startNum || date >= startNum) && 
             (!endNum || date <= endNum);
    });
    
    document.querySelector('#reportTable tbody').innerHTML = filteredData
      .sort((a, b) => a.date - b.date)
      .map(item => `
        <tr>
          <td>${item.empID}</td>
          <td>${item.fullname}</td>
          <td>${item.date}</td>
          <td>${item.type.toUpperCase()}</td>
        </tr>
      `).join('');
    
    console.log("Report generated with", filteredData.length, "records");
    
  } catch (error) {
    console.error("Report error:", error);
    alert("Report generation failed. See console.");
  }
});

console.log("App initialized successfully");
