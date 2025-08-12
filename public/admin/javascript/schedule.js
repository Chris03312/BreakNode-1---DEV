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
                        <button type="button" class="edit" onclick="editbtn(${user.id})">Edit</button>
                        <button type="button" class="delete" onclick="deleteBtn(${user.id})">Delete</button>
                    </td>
                `;
                TableBody.appendChild(row);
            });
        } else {
            TableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No ${agents} users found</td>
                </tr>
            `;
        }

    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

function closeEditModal() {
    const editModal = document.getElementById('agentEditScheduleModal');
    editModal.style.display = 'none';
}

async function editbtn(id) {
    const editModal = document.getElementById('agentEditScheduleModal');
    editModal.style.display = 'flex';

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/editSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        if (data.success) {
            const user = data.data[0];

            document.getElementById('editId').value = user.id;
            document.getElementById('editFffBreak').value = user.FffBreak;
            document.getElementById('editFftBreak').value = user.FftBreak;
            document.getElementById('editFoneHour').value = user.FoneHour;
            document.getElementById('editToneHour').value = user.ToneHour;
            document.getElementById('editSffBreak').value = user.SffBreak;
            document.getElementById('editSftBreak').value = user.SftBreak;
        } else {
            alert(data.message || 'User not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data.');
    }
}

async function UpdateEditBtn() {
    const agentId = document.getElementById('editId').value;
    const FffBreak = document.getElementById('editFffBreak').value;
    const FftBreak = document.getElementById('editFftBreak').value;
    const FoneHour = document.getElementById('editFoneHour').value;
    const ToneHour = document.getElementById('editToneHour').value;
    const SffBreak = document.getElementById('editSffBreak').value;
    const SftBreak = document.getElementById('editSftBreak').value;
    const messageBox4 = document.getElementById('messageBox4');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/updateSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak })
        });

        const data = await res.json();

        if (data.success) {
            messageBox4.innerText = data.message;
            messageBox4.style.color = '#155724';
            messageBox4.style.backgroundColor = '#d4edda';
            messageBox4.style.border = '1px solid #c3e6cb';
            messageBox4.style.padding = '10px';
            messageBox4.style.borderRadius = '5px';
            messageBox4.style.display = 'block';

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            messageBox4.innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteBtn(id) {
    const messageBox5 = document.getElementById('messageBox5');
    const deleteModal = document.getElementById('deleteAgentScheduleModal');
    deleteModal.style.display = 'flex';
    document.getElementById('message').innerText = `Are you sure you want to delete the User ${id}`;

    document.getElementById('confirmDelete').addEventListener('click', async function () {
        try {
            const res = await fetch(`http://${HOST}:${PORT}/User/deleteSchedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })

            const data = await res.json();

            if (data.success) {
                messageBox5.innerText = data.message;
                messageBox5.style.color = '#155724';
                messageBox5.style.backgroundColor = '#d4edda';
                messageBox5.style.border = '1px solid #c3e6cb';

                setTimeout(() => {
                    location.reload();
                }, 3000);
            } else {
                messageBox5.innerText = data.message;
            }
        } catch (error) {
            console.error('Error Deleting User datas:', error);

        }
    }, { once: true });
}

getSchedule();

