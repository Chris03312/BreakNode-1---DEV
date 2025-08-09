const { HOST, PORT } = Config;

function toggleForm() {
    const role = document.getElementById('role').value;
    document.getElementById('agentForm').style.display = (role === 'agent') ? 'block' : 'none';
    document.getElementById('adminForm').style.display = (role === 'admin') ? 'block' : 'none';
}


async function agentLogin() {
    const agentUserId = document.getElementById('agentId').value;
    const agentPassword = document.getElementById('agentPassword').value;

    try {
        const res = await fetch(`http://${HOST}:${PORT}/agentAuthentication/authenticate`, {

        })
    } catch (error) {

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