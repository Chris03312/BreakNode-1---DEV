const { HOST, PORT } = Config;

const logsContainer = document.getElementById('logs');
const userId = sessionStorage.getItem('UserId');  // Your current user ID
const storageKey = `breakLogs_${userId}`;

// Load saved logs on page load
window.onload = () => {
    const savedLogs = localStorage.getItem(storageKey);
    if (savedLogs) {
        logsContainer.innerHTML = savedLogs;
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }
}

function clearLogs() {
    logsContainer.innerHTML = '';
    localStorage.removeItem(storageKey);
}

function saveLogs() {
    localStorage.setItem(storageKey, logsContainer.innerHTML);
}

function addLogLine(line, delay = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = line;
            logsContainer.appendChild(p);
            logsContainer.scrollTop = logsContainer.scrollHeight;
            saveLogs();
            resolve();
        }, delay);
    });
}

function formatTime(time) {
    if (!time) return '';
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

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



async function getAgentSchedule() {
    const AgentId = sessionStorage.getItem('UserId');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/agentSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId })
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
            const tbody = document.querySelector('.schedule-table table tbody');
            tbody.innerHTML = ''; // Clear old rows

            data.data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatTime(record.FffBreak)} - ${formatTime(record.FftBreak)}</td>
                    <td>${formatTime(record.FoneHour)} - ${formatTime(record.ToneHour)}</td>
                    <td>${formatTime(record.SffBreak)} - ${formatTime(record.SftBreak)}</td>
                `;

                tbody.appendChild(row);
            });

        } else {
            console.error('Failed to load Agent Schedule:', data.message);
        }
    } catch (error) {
        console.error('Error in getting break agent schedule:', error);
    }
}


async function breakOut() {
    const UserIdOut = sessionStorage.getItem('UserId');

    if (!UserIdOut) {
        await addLogLine('User Id is Undefined', 700);
        return;
    }

    if (logsContainer.children.length > 0) {
        const spacer = document.createElement('p');
        spacer.style.marginTop = '20px';
        spacer.textContent = '';
        logsContainer.appendChild(spacer);
    }

    try {
        await addLogLine("BREAKING OUT...", 0);

        const breakOutRes = await fetch(`http://${HOST}:${PORT}/Agent/agentbreakOut`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdOut }),
        });

        const breakOutData = await breakOutRes.json();

        if (!breakOutData.success) {
            await addLogLine(breakOutData.message, 700);
            return;
        }

        const BreakTypeOut = breakOutData.breakTypeOut;
        const Status = breakOutData.status;

        const action = 'Break Out';
        const status = (Status === 'Enable') ? 'Active' : 'Inactive';

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: '2-digit'
        });
        const formattedTime = now.toLocaleTimeString();

        await addLogLine(`Date: ${formattedDate}`, 700);
        await addLogLine(`Time: ${formattedTime}`, 700);
        await addLogLine(`User ID: ${UserIdOut}`, 700);
        await addLogLine(`Action: ${action}`, 700);
        await addLogLine(`Break Type: ${BreakTypeOut}`, 700);
        await addLogLine(`Status: ${status}`, 700);

        const hr = document.createElement('hr');
        logsContainer.appendChild(hr);
        saveLogs();

        await addLogLine('✅ Break Out successfully recorded!', 700);

    } catch (error) {
        console.error('Error in breakOut:', error);
        await addLogLine('An error occurred while processing break out.', 700);
    }
}


async function breakIn() {
    const UserIdIn = sessionStorage.getItem('UserId');

    if (!UserIdIn) {
        await addLogLine('User Id is Undefined', 700);
        return;
    }

    if (logsContainer.children.length > 0) {
        const spacer = document.createElement('p');
        spacer.style.marginTop = '20px';
        spacer.textContent = '';
        logsContainer.appendChild(spacer);
    }

    try {
        await addLogLine("BREAKING IN...", 0);

        const breakInRes = await fetch(`http://${HOST}:${PORT}/Agent/agentbreakIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserIdIn }),
        });

        const breakInData = await breakInRes.json();

        if (!breakInData.success) {
            await addLogLine(breakInData.message, 700);
            return;
        }

        const BreakTypeIn = breakInData.BreakTypeIn;
        const Remarks = breakInData.remarks;

        const action = 'Break In';
        const remarks = Remarks;

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: '2-digit'
        });
        const formattedTime = now.toLocaleTimeString();

        await addLogLine(`Date: ${formattedDate}`, 700);
        await addLogLine(`Time: ${formattedTime}`, 700);
        await addLogLine(`User ID: ${UserIdIn}`, 700);
        await addLogLine(`Action: ${action}`, 700);
        await addLogLine(`Break Type: ${BreakTypeIn}`, 700);
        await addLogLine(`Remarks: ${remarks}`, 700);

        const hr = document.createElement('hr');
        logsContainer.appendChild(hr);
        saveLogs();

        await addLogLine('✅ Break In successfully recorded!', 700);

    } catch (error) {
        console.error('Error in breakIn:', error);
        await addLogLine('An error occurred while processing break in.', 700);
    }
}

document.getElementById('clearLogsBtn').addEventListener('click', () => {
    clearLogs();
});



// Update clock every second
setInterval(timeclock, 1000);
getAgentSchedule()
timeclock();
