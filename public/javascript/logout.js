function showLogoutModal() {
    document.getElementById('logoutModal').style.display = 'flex';
}

function closeLogoutModal(event) {
    if (event.target.classList.contains('modal-overlay')) {
        document.getElementById('logoutModal').style.display = 'none';
    }
}

// Your original logout function with small fixes
async function logout() {
    const UserId = sessionStorage.getItem('UserId');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/Logout/agentLogout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // fixed space in header key
            body: JSON.stringify({ UserId })
        });

        const data = await res.json(); // added await here

        if (data.success) {
            sessionStorage.removeItem('UserId');
            sessionStorage.removeItem('Name');
            sessionStorage.removeItem('Campaign');

            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}
