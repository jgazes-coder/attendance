// Global variables to store parsed data
let attendanceData = [];
let ptoData = [];

document.getElementById('uploadBtn').addEventListener('click', function() {
    const attendanceFiles = document.getElementById('attendanceFiles').files;
    const ptoFiles = document.getElementById('ptoFiles').files;
    
    // Reset data
    attendanceData = [];
    ptoData = [];
    
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
