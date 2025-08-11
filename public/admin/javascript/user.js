async function getRecords() {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('users'); // MEC or MPL
    const title = document.getElementById('title');

    title.innerText = agents + ' Agent Dashboard';

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/userDatas`, {
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
                    <td>${user.status}<td>
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