function toggleForm() {
    const role = document.getElementById('role').value;
    document.getElementById('agentForm').style.display = (role === 'agent') ? 'block' : 'none';
    document.getElementById('adminForm').style.display = (role === 'admin') ? 'block' : 'none';
}


async function agentLogin() {
    const agentUserId = document.getElementById('agentId').value;
    const agentPassword = document.getElementById('agentPassword').value;

    try {
        const res = await fetch('', {
            
        })
    }catch (error) {

    }
}

async function adminLogin() {
    const adminUserId = document.getElementById('adminId').value;
    const adminPassword = document.getElementById('adminPassword').value;

    try {
        const res = await fetch('', {

        })
    }catch (error){

    }
}