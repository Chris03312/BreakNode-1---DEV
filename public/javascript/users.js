const { HOST, PORT } = Config;

async function getRecords() {
    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/userDatas`, {
            method: 'GET'
        });
        const data = await res.json();

        if (data.success) {
            const tableBody = document.querySelector('.table-wrapper table tbody');
            tableBody.innerHTML = '';

            data.users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>${user.overBreak} times</td>
                    <td>${user.status === 'Enable' ? 'Active' : user.status}</td>
                    <td>
                        <div class="actionButtons">
                            <form class="actionForm editForm">
                                <button type="button" class="editBtn" onclick="editBtn(${user.id})">Edit</button>
                            </form>
                            <form class="actionForm deleteForm">
                                <button type="button" class="deleteBtn" onclick="DeleteBtn(${user.id})">Delete</button>
                            </form>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

        } else {
            console.error('Failed to load users:', data.message);
        }

    } catch (error) {
        console.error('Error in fetching users:', error);
    }
}


async function InsertUser() {
    const UserId = document.getElementById('userId').value;
    const Name = document.getElementById('name').value;
    const Campaign = document.getElementById('campaign').value;
    const Password = document.getElementById('password').value;
    const FffBreak = document.getElementById('FffBreak').value;
    const FftBreak = document.getElementById('FftBreak').value;
    const FoneHour = document.getElementById('FoneHour').value;
    const ToneHour = document.getElementById('ToneHour').value;
    const SffBreak = document.getElementById('SffBreak').value;
    const SftBreak = document.getElementById('SftBreak').value;
    const messageBox = document.getElementById('messageBox');

    console.log('Collected values:', {
        UserId,
        Name,
        Campaign,
        Password,
        FffBreak,
        FftBreak,
        FoneHour,
        ToneHour,
        SffBreak,
        SftBreak
    });

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/insertUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    UserId, Name, Campaign, Password, FffBreak,
                    FftBreak, FoneHour, ToneHour, SffBreak, SftBreak
                })
        });

        console.log('Request sent to server, waiting for response...');
        const data = await res.json();
        console.log('Response received:', data);

        if (data.success) {
            messageBox.innerText = data.message;
            messageBox.style.color = 'green';
            messageBox.style.backgroundColor = '#d4edda';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);

            console.log('Success:', data.message);
        } else {
            messageBox.innerText = data.message || 'Submission Failed';
            messageBox.style.color = 'red';
            messageBox.style.backgroundColor = '#f8d7da';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';

            console.log('Failure:', data.message || 'Submission Failed');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageBox.innerText = data.message;
        messageBox.style.color = 'red';
    }
}

document.getElementById('search').addEventListener('input', async function () {
    const searchValue = this.value.trim();

    try {
        const response = await fetch(`http://${Config.HOST}:${Config.PORT}/User/searchUsers?search=${encodeURIComponent(searchValue)}`);
        const data = await response.json();

        const tableBody = document.querySelector('.table-wrapper table tbody');
        tableBody.innerHTML = '';

        if (data.success && Array.isArray(data.users)) {
            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.campaign}</td>
                    <td>
                        <div class="actionButtons">
                            <form class="actionForm editForm">
                                <button type="button" class="editBtn" onclick="editBtn(${user.id})">Edit</button>
                            </form>
                            <form class="actionForm deleteForm">
                                <button type="button" class="deleteBtn" onclick="DeleteBtn(${user.id})">Delete</button>
                            </form>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="4">No matching users found</td></tr>`;
        }
    } catch (error) {
        console.error('Search request failed:', error);
    }
});

async function editBtn(id) {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block';

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/editDatas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        if (data.success) {
            const user = data.data[0]; // assuming result is an array
            document.getElementById('idInput').value = user.id;
            document.getElementById('nameInput').value = user.name;
            document.getElementById('campaignInput').value = user.campaign;
            document.getElementById('passwordInput').value = user.password;
        } else {
            alert(data.message || 'User not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data.');
    }
}

async function UpdateUser() {
    const messageBox4 = document.getElementById('messageBox4');

    const UserId = document.getElementById('idInput').value;
    const Name = document.getElementById('nameInput').value;
    const Campaign = document.getElementById('campaignInput').value;
    const Password = document.getElementById('passwordInput').value;

    console.log(UserId, Name, Campaign, Password);

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/updateDatas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Name, Campaign, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox4.innerText = data.message;
            messageBox4.style.color = 'green';
            messageBox4.style.backgroundColor = '#d4edda';
            messageBox4.style.padding = '10px';
            messageBox4.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            messageBox4.innerText = data.message || 'Failed to update user';
            messageBox4.style.color = 'red';
        }
    } catch (error) {
        console.error(error);
        messageBox4.innerText = 'An error occurred. Please try again later.';
        messageBox4.style.color = 'red';
    }
}

function DeleteBtn(userId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.style.display = 'block';

    document.getElementById('UserId').value = userId;
}

async function deleteUsers() {
    const messageBox3 = document.getElementById('messageBox3');
    const UserId = document.getElementById('UserId').value;

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/User/deleteDatas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId })
        });

        const data = await res.json();

        if (data.success) {
            messageBox3.innerText = data.message;
            messageBox3.style.color = 'green';
            messageBox3.style.backgroundColor = '#d4edda';
            messageBox3.style.padding = '10px';
            messageBox3.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            messageBox3.innerText = data.message || 'Failed to delete user.';
            messageBox3.style.color = 'red';
        }
    } catch (error) {
        console.error(error);
        messageBox3.innerText = 'An error occurred. Please try again later.';
        messageBox3.style.color = 'red';
    }
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('showPassCheck').addEventListener('change', function () {
    const passInput = document.getElementById('passwordInput');
    passInput.type = this.checked ? 'text' : 'password';
});

document.getElementById("toggleBreaks").addEventListener("click", function () {
    const breakSection = document.getElementById("breakSection");
    const isHidden = breakSection.style.display === "none";
    breakSection.style.display = isHidden ? "block" : "none";
    this.textContent = isHidden ? "- Hide Break Times" : "+ Break Times";
});

document.getElementById('showPassCheck').addEventListener('change', function () {
    const passInput = document.getElementById('passwordInput');
    passInput.type = this.checked ? 'text' : 'password';
});

getRecords();