const { HOST, PORT } = Config;

function toggleForm() {
    const role = document.getElementById('role').value;
    document.getElementById('agentForm').style.display = (role === 'agent') ? 'block' : 'none';
    document.getElementById('adminForm').style.display = (role === 'admin') ? 'block' : 'none';
}


async function agentLogin() {
    const UserId = document.getElementById('agentId').value;
    const Password = document.getElementById('agentPass').value;
    const loginBtn = document.querySelector('button[onclick="agentLogin()"]');
    const messageBox = document.getElementById('messageBox');

    try {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Checking...';

        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AgentAuthentication/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = '';
            loginBtn.innerText = 'Logging in...';
            loginBtn.classList.add('loading');

            // Store in session storage
            sessionStorage.setItem('UserId', UserId);
            sessionStorage.setItem('Name', data.Name);
            sessionStorage.setItem('Campaign', data.Campaign);

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

async function adminLogin() {
    const UserId = document.getElementById('adminId').value;
    const Password = document.getElementById('adminPass').value;
    const loginBtn = document.querySelector('button[onclick="adminLogin()"]');
    const messageBox = document.getElementById('messageBox');

    try {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Checking...';

        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AdminAuthentication/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Password })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = '';
            loginBtn.innerText = 'Logging in...';
            loginBtn.classList.add('loading');

            sessionStorage.setItem('UserId', data.UserId);
            sessionStorage.setItem('Name', data.Name);

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