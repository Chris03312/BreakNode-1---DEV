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
                    <td>${record.dispositions || ''}</td>
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
const BreakOutModal = document.getElementById('breakOutModal');
const BreakInModal = document.getElementById('breakInModal');
const breakOutBtn = document.getElementById('breakOutBtn');
const breakInBtn = document.getElementById('breakInBtn');
const closeBtn = document.getElementById('closeModal');

breakOutBtn.addEventListener('click', () => {
    BreakOutModal.style.display = 'flex';
});

breakInBtn.addEventListener('click', () => {
    BreakInModal.style.display = 'flex';
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal-container').style.display = 'none';
    });
});

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

async function BreakIn() {
    const UserIdIn = document.getElementById('breakInUserId').value;
    const BreakTypeIn = document.getElementById('breakInType').value;
    const Reason = document.getElementById('reasonForlateBreak').value;
    const messageBox8 = document.getElementById('messageBox8');

    messageBox8.innerText = '';
    messageBox8.style.backgroundColor = 'transparent';
    messageBox8.style.padding = '0';
    messageBox8.style.borderRadius = '0';
    messageBox8.style.color = '';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/breakIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdIn, BreakTypeIn, Reason })
        });

        const data = await res.json();

        if (data.success) {
            messageBox8.innerText = data.message;
            messageBox8.style.color = 'green';
            messageBox8.style.backgroundColor = '#d4edda';
            messageBox8.style.padding = '10px';
            messageBox8.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 2000);
        } else {
            messageBox8.innerText = data.message;
            messageBox8.style.color = 'red';
            messageBox8.style.backgroundColor = '#f8d7da';
            messageBox8.style.padding = '10px';
            messageBox8.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageBox8.innerText = "Server Error. An error occurred.";
        messageBox8.style.color = 'red';
    }

}

async function BreakOut() {
    const UserIdOut = document.getElementById('breakOutUserId').value;
    const BreakTypeOut = document.getElementById('breakOutType').value;
    const messageBox7 = document.getElementById('messageBox7');

    messageBox7.innerText = '';
    messageBox7.style.backgroundColor = 'transparent';
    messageBox7.style.padding = '0';
    messageBox7.style.borderRadius = '0';
    messageBox7.style.color = '';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/breakOut`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdOut, BreakTypeOut })
        });

        const data = await res.json();

        if (data.success) {
            messageBox7.innerText = data.message;
            messageBox7.style.color = 'green';
            messageBox7.style.backgroundColor = '#d4edda';
            messageBox7.style.padding = '10px';
            messageBox7.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 2000);
        } else {
            messageBox7.innerText = data.message;
            messageBox7.style.color = 'red';
            messageBox7.style.backgroundColor = '#f8d7da';
            messageBox7.style.padding = '10px';
            messageBox7.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageBox7.innerText = "Server Error. An error occurred.";
        messageBox7.style.color = 'red';
    }
}


// Update clock every second
setInterval(timeclock, 1000);
setInterval(recordTable, 5000);

recordTable()
timeclock();

