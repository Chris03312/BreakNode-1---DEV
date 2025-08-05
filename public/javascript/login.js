const { HOST, PORT } = Config;

function toggleForm() {
    const role = document.getElementById('role').value;
    document.getElementById('agentForm').style.display = (role === 'agent') ? 'block' : 'none';
    document.getElementById('adminForm').style.display = (role === 'admin') ? 'block' : 'none';
}

async function BreakIn() {
    const UserIdIn = document.getElementById('agentId').value;
    const Password = document.getElementById('agentPass').value;
    const BreakTypeIn = document.getElementById('breakType').value;
    const messageBox = document.getElementById('messageBox');

    messageBox.innerText = '';
    messageBox.style.backgroundColor = 'transparent';
    messageBox.style.padding = '0';
    messageBox.style.borderRadius = '0';
    messageBox.style.color = '';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Agent/agentbreakIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdIn, BreakTypeIn, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = data.message;
            messageBox.style.color = 'green';
            messageBox.style.backgroundColor = '#d4edda';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 2000);
        } else {
            messageBox.innerText = data.message;
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

async function BreakOut() {
    const UserIdOut = document.getElementById('agentId').value;
    const Password = document.getElementById('agentPass').value;
    const BreakTypeOut = document.getElementById('breakType').value;
    const messageBox = document.getElementById('messageBox');

    messageBox.innerText = '';
    messageBox.style.backgroundColor = 'transparent';
    messageBox.style.padding = '0';
    messageBox.style.borderRadius = '0';
    messageBox.style.color = '';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Agent/agentbreakOut`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdOut, BreakTypeOut, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = data.message;
            messageBox.style.color = 'green';
            messageBox.style.backgroundColor = '#d4edda';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';

            setTimeout(() => location.reload(), 2000);
        } else {
            messageBox.innerText = data.message;
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

async function adminLogin() {
    const UserId = document.getElementById('userId').value;
    const Password = document.getElementById('password').value;
    const loginBtn = document.querySelector('button[onclick="adminLogin()"]');
    const messageBox = document.getElementById('messageBox');

    try {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Checking...';

        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Authentication/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = '';
            loginBtn.innerText = 'Logging in...';
            loginBtn.classList.add('loading');

            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1500);
        } else {
            messageBox.innerText = data.message;
            messageBox.style.color = 'red';
            messageBox.style.backgroundColor = '#f8d7da';

            UserId.innerText = 'none';
            Password.innerText = 'none';

            loginBtn.disabled = false;
            loginBtn.innerText = 'Login';
        }

    } catch (error) {
        console.error(error);
        loginBtn.disabled = false;
        loginBtn.innerText = 'Login';
    }
}

async function getSchedule() {
    try {
        // Fetch both datasets
        const activeRes = await fetch(`http://${Config.HOST}:${Config.PORT}/Break/remarks`, {
            method: 'GET'
        });

        const activeBreakData = await activeRes.json();

        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/userDatas`, {
            method: 'GET'
        });

        const data = await res.json();

        const activeRemarksMap = new Map();

        // Build a map of active remarks (userId + breakType as key)
        if (activeBreakData.success && Array.isArray(activeBreakData.break)) {
            activeBreakData.break.forEach(entry => {
                const key = `${entry.userId}-${entry.breakType}`;
                activeRemarksMap.set(key, entry.remarks);
            });
        }

        const mecTableBody = document.querySelector('#breakTable tbody');
        const mplTableBody = document.querySelector('#breakTable1 tbody');

        mecTableBody.innerHTML = '';
        mplTableBody.innerHTML = '';

        const getStyle = (userId, breakType) => {
            const remark = activeRemarksMap.get(`${userId}-${breakType}`);
            switch (remark) {
                case 'Active': return 'background-color: yellow; color: black;';
                case 'Late': return 'background-color: orange; color: black;';
                case 'Over Break': return 'background-color: red; color: black;';
                case 'Early': return 'background-color: green; color: black;';
                case '': return '';
                default: return '';
            }
        };

        if (data.success) {
            // Render MEC users
            if (Array.isArray(data.mec) && data.mec.length > 0) {
                data.mec.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td style="${getStyle(user.id, '15 Minutes Break')}">${formatTimeRange(user.FffBreak, user.FftBreak)}</td>
                        <td style="${getStyle(user.id, '1 hour Break')}">${formatTimeRange(user.FoneHour, user.ToneHour)}</td>
                        <td style="${getStyle(user.id, '10 Minutes Break')}">${formatTimeRange(user.SffBreak, user.SftBreak)}</td>
                        <td>${user.overBreak || 0} times</td>
                    `;
                    mecTableBody.appendChild(row);
                });
            } else {
                mecTableBody.innerHTML = `<tr><td colspan="6">No MEC users found</td></tr>`;
            }

            // Render MPL users
            if (Array.isArray(data.mpl) && data.mpl.length > 0) {
                data.mpl.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td style="${getStyle(user.id, '15 Minutes Break')}">${formatTimeRange(user.FffBreak, user.FftBreak)}</td>
                        <td style="${getStyle(user.id, '1 hour Break')}">${formatTimeRange(user.FoneHour, user.ToneHour)}</td>
                        <td style="${getStyle(user.id, '10 Minutes Break')}">${formatTimeRange(user.SffBreak, user.SftBreak)}</td>
                        <td>${user.overBreak || 0} times</td>
                    `;
                    mplTableBody.appendChild(row);
                });
            } else {
                mplTableBody.innerHTML = `<tr><td colspan="6">No MPL users found</td></tr>`;
            }
        } else {
            mecTableBody.innerHTML = `<tr><td colspan="6">No matching users found</td></tr>`;
            mplTableBody.innerHTML = `<tr><td colspan="6">No matching users found</td></tr>`;
        }

    } catch (error) {
        console.error('Error in fetching users:', error);
    }
}


window.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        adminLogin();
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hourStr = hours.toString().padStart(2, '0');

    const timeString = `${hourStr}:${minutes}:${seconds} ${ampm}`;
    document.getElementById('LiveClock').textContent = timeString;
}

function formatTimeRange(start, end) {
    const formatTime = timeStr => {
        const date = new Date(`1970-01-01T${timeStr}`);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
}
setInterval(updateClock, 1000);
updateClock();
getSchedule(); // TO LOAD THE MPL AND MEC TO THE UI
