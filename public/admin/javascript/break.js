function timeclock() {
    const clock = document.getElementById('timeclock');
    const now = new Date();

    // Format time as HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const formattedTime =
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')} ${ampm}`;

    clock.textContent = formattedTime;
}

async function recordTable() {
    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/records`, {
            method: 'GET'
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            data.data.forEach(record => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${record.accountId || ''}</td>
                    <td>${record.name || ''}</td>
                    <td>${record.campaign || ''}</td>
                    <td>${record.breakType || ''}</td>
                    <td>${record.breakOut || ''}</td>
                    <td>${record.breakIn || ''}</td>
                    <td>${record.timeDifference || ''}</td>
                    <td>${record.remarks || ''}</td>
                `;

                tbody.appendChild(row);
            });
        } else {
            console.error('Failed to load records:', data.message);
        }

    } catch (error) {
        console.error('Error fetching records:', error);
    }
}


// Update clock every second
setInterval(timeclock, 1000);
recordTable()
timeclock();

