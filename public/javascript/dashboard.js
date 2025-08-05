const { HOST, PORT } = Config;

function updateDateTime() {
    const dateElement = document.getElementById('date');
    const now = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US');
    dateElement.innerHTML = `${dateStr} - ${timeStr}`;
}

async function getRecords() {
    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/records`, {
            method: 'GET'
        });

        const data = await res.json();

        if (data.success) {
            const tableBody = document.querySelector('#breakTable tbody');
            tableBody.innerHTML = ''; // clear existing rows

            data.data.forEach(record => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${record.userId}</td>
                    <td>${record.name}</td>
                    <td>${record.campaign}</td>
                    <td>${record.breakType}</td>
                    <td>${record.breakOut}</td>
                    <td>${record.breakIn || '-'}</td>
                    <td>${record.timeDifference || '-'}</td>
                    <td>${record.remarks || '-'}</td>
                `;
                tableBody.appendChild(row);
            });

        } else {
            console.error('Failed to load records:', data.message);
        }

    } catch (error) {
        console.error('Error in fetching records:', error);
    }
}

function formatTime(dateTimeStr) {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function BreakOut() {
    const UserIdOut = document.getElementById('userIdOut').value;
    const BreakTypeOut = document.getElementById('breakTypeOut').value;
    const messageBox = document.getElementById('messagBox');

    if (!UserIdOut.trim() || !BreakTypeOut.trim()) {
        console.log('Validation failed: missing or space-only fields');
        messageBox.innerText = 'Please fill in all fields.';
        messageBox.style.color = 'red';
        return;
    }

    if (!/^\d+$/.test(UserIdOut.trim())) {
        console.log('Validation failed: userId must be numeric only');
        messageBox.innerText = 'User ID must contain numbers only.';
        messageBox.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/BreakOut`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdOut, BreakTypeOut })
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById('userIdOut').value = '';
            document.getElementById('breakTypeOut').selectedIndex = 0;

            messageBox.innerText = data.message;
            messageBox.style.color = 'green';
            messageBox.style.backgroundColor = '#d4edda';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 1000);
        } else {
            messageBox.innerText = data.message || 'Break Out Failed';
            messageBox.style.color = 'red';
            messageBox.style.backgroundColor = '#f8d7da';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageBox.innerText = "Server Error. An error occurred.";
        messageBox.style.color = 'red';
    }
}

// break IN

async function BreakIn() {
    const UserIdIn = document.getElementById('userIdIn').value;
    const BreakTypeIn = document.getElementById('breakTypeIn').value;
    const messageBox2 = document.getElementById('messagBox2');
    const reason = document.getElementById('reasonForlateBreak').value;

    if (!UserIdIn.trim()) {
        console.log('Validation failed: missing or space-only fields');
        messageBox2.innerText = 'Please fill in all fields.';
        messageBox2.style.color = 'red';
        return;
    }

    if (!/^\d+$/.test(UserIdIn.trim())) {
        console.log('Validation failed: userId must be numeric only');
        messageBox2.innerText = 'User ID must contain numbers only.';
        messageBox2.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/BreakIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdIn, BreakTypeIn, reason })
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById('userIdIn').value = '';
            document.getElementById('breakTypeIn').selectedIndex = 0;

            messageBox2.innerText = data.message;
            messageBox2.style.color = 'green';
            messageBox2.style.backgroundColor = '#d4edda';
            messageBox2.style.padding = '10px';
            messageBox2.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 1000);
        } else {
            messageBox2.innerText = data.message || 'Break Out Failed';
            messageBox2.style.color = 'red';
            messageBox2.style.backgroundColor = '#f8d7da';
            messageBox2.style.padding = '10px';
            messageBox2.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageBox2.innerText = "Server Error. An error occurred.";
        messageBox2.style.color = 'red';
    }

}

// MODALS 
const breakOutModal = document.getElementById('breakOutModal');
const breakInModal = document.getElementById('breakInModal');

const openOutBtn = document.getElementById('breakOutBtn');
const openInBtn = document.getElementById('breakInBtn');

const closeOutBtn = document.getElementById('closeOutBtn');
const closeInBtn = document.getElementById('closeInBtn');

openOutBtn.addEventListener('click', () => {
    breakOutModal.style.display = "block";
});

openInBtn.addEventListener('click', () => {
    breakInModal.style.display = "block";
});

closeOutBtn.addEventListener('click', () => {
    breakOutModal.style.display = "none";
});

closeInBtn.addEventListener('click', () => {
    breakInModal.style.display = "none";
});

window.addEventListener('click', (e) => {
    if (e.target === breakOutModal) {
        breakOutModal.style.display = 'none';
    }
    if (e.target === breakInModal) {
        breakInModal.style.display = 'none';
    }
});


setInterval(updateDateTime, 1000);
updateDateTime();
getRecords();