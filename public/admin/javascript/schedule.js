const { HOST, PORT } = Config;

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

async function getSchedule() {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL
    const title = document.getElementById('title');

    title.innerText = agents + ' Break Schedule';

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/schedule`, {
            method: 'GET'
        });

        const data = await res.json();
        const TableBody = document.getElementById('TableBody');
        TableBody.innerHTML = '';

        const users = data[agents.toLowerCase()];

        if (Array.isArray(users) && users.length > 0) {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>${formatTimeRange(user.FffBreak, user.FftBreak)}</td>
                    <td>${formatTimeRange(user.FoneHour, user.ToneHour)}</td>
                    <td>${formatTimeRange(user.SffBreak, user.SftBreak)}</td>
                    <td>${user.overBreak || 0} times</td>
                    <td>
                        <button type="button" class="edit">Edit</button>
                        <button type="button" class="delete">Delete</button>
                    </td>
                `;
                TableBody.appendChild(row);
            });
        } else {
            TableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No ${agents} users found</td>
                </tr>
            `;
        }

    } catch (error) {
        console.error('Error fetching records:', error);
    }
}


getSchedule();

