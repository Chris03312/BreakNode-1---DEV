function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function getUsers(searchTerm = '') {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('users'); // e.g., MEC or MPL
    const title = document.getElementById('title');

    title.innerText = `${agents} Agent Dashboard`;

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminUsers/userDatas`, {
            method: 'GET'
        });

        const data = await res.json();
        const TableBody = document.getElementById('TableBody');
        TableBody.innerHTML = '';

        const users = data[agents.toLowerCase()] || [];

        // ✅ Clean searchTerm once for all comparisons
        const search = searchTerm.toLowerCase();

        // ✅ Filter users by name, ID, or campaign
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(search) ||
            user.id.toString().includes(search) ||
            user.campaign.toLowerCase().includes(search)
        );

        if (filteredUsers.length > 0) {
            filteredUsers.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>${user.status === 'Enable' ? 'Active' : 'Inactive'}</td>
                    <td>
                        <button type="button" class="edit" onclick="editBtn('${user.id}')">Edit</button>
                        <button type="button" class="delete" onclick="deleteBtn('${user.id}')">Delete</button>
                    </td>
                `;
                TableBody.appendChild(row);
            });
        } else {
            TableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No matching ${agents} users found</td>
                </tr>
            `;
        }

    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

const debouncedSearch = debounce(function () {
    const searchValue = document.getElementById('search').value.trim();
    getUsers(searchValue);
}, 300); // 300ms delay

document.getElementById('search').addEventListener('input', debouncedSearch);

async function editBtn(id) {
    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminUsers/editDatas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        if (data.success) {
            const user = data.data[0]; // unpack first record

            const AgentEditModal = document.getElementById('agentEditModal');
            AgentEditModal.style.display = 'flex';

            document.getElementById('editId').value = user.id;
            document.getElementById('editName').value = user.name;
            document.getElementById('editCampaign').value = user.campaign;
            document.getElementById('editStatus').value = user.status;
            document.getElementById('editPass').value = user.password;
        } else {
            alert('NO EDIT DATA FETCHED')
        }

    } catch (error) {
        console.error('Error fetching edit data:', error);
    }
};

document.getElementById('closeAgentEditModal').addEventListener('click', function () {
    const AgentEditModal = document.getElementById('agentEditModal');
    AgentEditModal.style.display = 'none';
})


async function edit() {
    const UserId = document.getElementById('editId').value;
    const Name = document.getElementById('editName').value;
    const Password = document.getElementById('editPass').value
    const Campaign = document.getElementById('editCampaign').value;
    const Status = document.getElementById('editStatus').value;
    const messageBox3 = document.getElementById('messageBox3');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminUsers/editUsers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Name, Password, Campaign, Status })
        });

        const data = await res.json();

        if (data.success) {
            messageBox3.innerText = data.message;
            messageBox3.style.color = '#155724';
            messageBox3.style.backgroundColor = '#d4edda';
            messageBox3.style.border = '1px solid #c3e6cb';
            messageBox3.style.padding = '10px';
            messageBox3.style.borderRadius = '5px';
            messageBox3.style.display = 'block';

            setTimeout(() => {
                location.reload()
            }, 2000)
        } else {
            messageBox3.innerText = data.message;
        }
    } catch (error) {
        console.error('Error Editing User datas:', error);

    }
};

function deleteAgentModal(event) {
    if (event.target.classList.contains('deletemodal-overlay')) {
        document.getElementById('deleteAgentModal').style.display = 'none';
    }
}

async function deleteBtn(id) {
    const messageBox2 = document.getElementById('messageBox2');
    const deleteModal = document.getElementById('deleteAgentModal');
    deleteModal.style.display = 'flex';
    document.getElementById('message').innerText = `Are you sure you want to delete the User ${id}`;

    document.getElementById('confirmDelete').addEventListener('click', async function () {
        try {
            const res = await fetch(`http://${HOST}:${PORT}/AdminUsers/deleteUsers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })

            const data = await res.json();

            if (data.success) {
                messageBox2.innerText = data.message;
                messageBox2.style.color = '#155724';
                messageBox2.style.backgroundColor = '#d4edda';
                messageBox2.style.border = '1px solid #c3e6cb';

                setTimeout(() => {
                    location.reload();
                }, 3000);
            } else {
                messageBox2.innerText = data.message;
            }
        } catch (error) {
            console.error('Error Deleting User datas:', error);

        }
    }, { once: true });
}


getUsers(); 