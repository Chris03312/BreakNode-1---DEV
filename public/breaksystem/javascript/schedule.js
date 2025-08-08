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
    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/userDatas`, {
            method: 'GET'
        });

        const data = await res.json();

        if (data.success) {
            const tableBody = document.querySelector('#breakTable tbody');
            tableBody.innerHTML = '';

            data.users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>${formatTimeRange(user.FffBreak, user.FftBreak)}</td>
                    <td>${formatTimeRange(user.FoneHour, user.ToneHour)}</td>
                    <td>${formatTimeRange(user.SffBreak, user.SftBreak)}</td>
                <td>${user.overBreak ? `${user.overBreak} times` : '0 times'}</td>
                    <td>
                        <div class="actionButtons">
                            <form class="actionForm editForm">
                                <button type="button" class="updateBtn" onclick="UpdateBtn(${user.id})">Update</button>
                            </form>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

        } else {
            tableBody.innerHTML = `<tr><td colspan="8">No matching users found</td></tr>`;
        }

    } catch (error) {
        console.error('Error in fetching users:', error);
    }
}

document.getElementById('search').addEventListener('input', async function () {
    const searchValue = this.value.trim();

    try {
        const response = await fetch(`http://${Config.HOST}:${Config.PORT}/User/searchUsers?search=${encodeURIComponent(searchValue)}`);
        const data = await response.json();

        const tableBody = document.querySelector('#breakTable tbody');
        tableBody.innerHTML = '';

        if (data.success && Array.isArray(data.users)) {
            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>${formatTimeRange(user.FffBreak, user.FftBreak)}</td>
                    <td>${formatTimeRange(user.FoneHour, user.ToneHour)}</td>
                    <td>${formatTimeRange(user.SffBreak, user.SftBreak)}</td>
                    <td>${user.overBreak}</td>
                    <td>
                        <div class="actionButtons">
                            <form class="actionForm editForm">
                                <button type="button" class="editBtn" onclick="UpdateBtn(${user.id})">Update</button>
                            </form>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="8">No matching users found</td></tr>`;
        }
    } catch (error) {
        console.error('Search request failed:', error);
    }
});

async function UpdateBtn(id) {
    const editModal = document.getElementById('breakTimeModal');
    editModal.style.display = 'block';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/editDatas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        if (data.success) {
            const user = data.data[0];

            document.getElementById('UserId').value = user.id;
            document.getElementById('FffBreak').value = user.FffBreak;
            document.getElementById('FftBreak').value = user.FftBreak;

            document.getElementById('FoneHour').value = user.FoneHour;
            document.getElementById('ToneHour').value = user.ToneHour;

            document.getElementById('SffBreak').value = user.SffBreak;
            document.getElementById('SftBreak').value = user.SftBreak;
        } else {
            alert(data.message || 'User not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data.');
    }
}

async function UpdateUser() {
    const UserId = document.getElementById('UserId').value;
    const FffBreak = document.getElementById('FffBreak').value;
    const FftBreak = document.getElementById('FftBreak').value;
    const FoneHour = document.getElementById('FoneHour').value;
    const ToneHour = document.getElementById('ToneHour').value;
    const SffBreak = document.getElementById('SffBreak').value;
    const SftBreak = document.getElementById('SftBreak').value;

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/updateSchedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak })
        });

        const data = await res.json();

        if (data.success) {
            messageBox4.innerText = data.message;
            messageBox4.style.color = 'green';
            messageBox4.style.backgroundColor = '#d4edda';
            messageBox4.style.padding = '10px 10px';
            messageBox4.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            messageBox4.innerText = data.message || 'Failed to update user';
            messageBox4.style.color = 'red';
            messageBox4.style.backgroundColor = '#f8d7da';
        }
    } catch (error) {
        console.error(error);
        messageBox4.innerText = 'An error occurred. Please try again later.';
        messageBox4.style.color = 'red';
    }
}

document.getElementById('cancelEdit').addEventListener('click', function () {
    document.getElementById('breakTimeModal').style.display = "none";
});

function closeBreakModal() {
    document.getElementById('breakTimeModal').style.display = 'none';
}

getSchedule();