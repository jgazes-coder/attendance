// Debug logger
console.log("=== DEBUG INIT ===");

// Global data stores
window.attendanceData = [];
window.ptoData = [];
// In app.js
window.attendanceData = [
  { empID: "1154", fullname: "Hahn, Amy", date: "45810", type: "attendance" }
];
window.ptoData = [
  { id_num: "9999", lastname: "Doe", firstname: "John", fullname: "Doe, John", empID: "1155", region: "New York", start_pto: "45811" }
  ];


/*
document.getElementById('uploadBtn').addEventListener('click', function() {
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;

  */

document.getElementById('generateReportBtn').addEventListener('click', function() {
    console.log("--- REPORT BUTTON CLICKED ---");
    
    // 1. Verify data exists
    console.log("Attendance Data:", window.attendanceData);
    console.log("PTO Data:", window.ptoData);
    
    // 2. Hardcoded test - bypass date inputs
    const testData = [
        ...window.attendanceData.map(item => ({ 
            ...item, 
            date: item.date || item.start_pto, 
            type: item.type || 'attendance' 
        })),
        ...window.ptoData.map(item => ({
            empID: item.empID,
            fullname: item.fullname,
            date: item.start_pto,
            type: 'pto'
        }))
    ];
    
    console.log("Combined Test Data:", testData);
    
    // 3. Force display
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = testData.map(item => `
        <tr>
            <td>${item.empID}</td>
            <td>${item.fullname}</td>
            <td>${item.date}</td>
            <td>${item.type === 'attendance' ? 'Attendance' : 'PTO'}</td>
        </tr>
    `).join('');
    
    console.log("Table should be updated!");
});


    // Reset data
    /* attendanceData = []; */
    /* ptoData = []; */
    
    // Process attendance files
    if (attendanceFiles.length > 0) {
        processFiles(attendanceFiles, 'attendance');
    }
    
    // Process PTO files
    if (ptoFiles.length > 0) {
        processFiles(ptoFiles, 'pto');
    }
});


  

function processFiles(files, type) {
    Array.from(files).forEach(file => {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                if (type === 'attendance') {
                    attendanceData = attendanceData.concat(results.data.map(item => {
                        return {
                            ...item,
                            type: 'attendance',
                            date: item.date_in_office
                        };
                    }));
                } else if (type === 'pto') {
                    ptoData = ptoData.concat(results.data.map(item => {
                        return {
                            ...item,
                            type: 'pto',
                            date: item.start_pto
                        };
                    }));
                }
                alert(`${file.name} processed successfully!`);
            },
            error: function(error) {
                alert(`Error processing ${file.name}: ${error.message}`);
            }
        });
    });
}

document.getElementById('generateReportBtn').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    // Combine data
    const combinedData = [...attendanceData, ...ptoData];
    
    // Filter by date range
    const filteredData = combinedData.filter(item => {
        const date = parseInt(item.date);
        return date >= parseInt(startDate) && date <= parseInt(endDate);
    });
    
    // Sort by empID and date
    filteredData.sort((a, b) => {
        if (a.empID === b.empID) {
            return a.date - b.date;
        }
        return a.empID - b.empID;
    });
    
    // Display results
    displayResults(filteredData);
});

function displayResults(data) {
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        const empIDCell = document.createElement('td');
        empIDCell.textContent = item.empID;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.fullname;
        
        const dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        
        const typeCell = document.createElement('td');
        typeCell.textContent = item.type === 'attendance' ? 'Attendance' : 'PTO';
        
        row.appendChild(empIDCell);
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        row.appendChild(typeCell);
        
        tableBody.appendChild(row);
    });
}
