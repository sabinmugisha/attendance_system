document.addEventListener('DOMContentLoaded', () => {
    console.log('Staff Dashboard loaded.');

    // Example: Fetch attendance data via API
    const fetchAttendanceData = async () => {
        try {
            const response = await fetch('/attendance');
            if (response.ok) {
                const attendanceData = await response.json();
                console.log('Attendance Data:', attendanceData);

                // Example: Render attendance data dynamically
                const attendanceTable = document.querySelector('.attendance-table');
                if (attendanceTable) {
                    attendanceData.forEach((record) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${record.studentName}</td>
                            <td>${record.date}</td>
                            <td>${record.status}</td>
                        `;
                        attendanceTable.appendChild(row);
                    });
                }
            } else {
                console.error('Failed to fetch attendance data.');
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    // Call fetchAttendanceData on load
    fetchAttendanceData();
});
