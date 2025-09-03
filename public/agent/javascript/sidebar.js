fetch('/agent/sidebar/sidebar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebar').innerHTML = html;

        // Now elements exist, safe to attach event listeners and update content
        const UserId = sessionStorage.getItem('UserId');
        const Campaign = sessionStorage.getItem('Campaign');
        const Name = sessionStorage.getItem('Name');

        console.log('UserId:', UserId);
        console.log('Campaign:', Campaign);
        console.log('Name:', Name);

        const nameElement = document.getElementById('AgentName');
        if (nameElement) {
            nameElement.innerText = Name || "No Name Found";
        }

        document.getElementById('requestEmailTrigger').addEventListener('click', () => {
            document.getElementById('requestEmailModal').style.display = 'flex';
        });

        document.getElementById('requestViberTrigger').addEventListener('click', () => {
            document.getElementById('requestViberModal').style.display = 'flex';
        });

        document.getElementById('requestLoadTrigger').addEventListener('click', () => {
            document.getElementById('requestLoadModal').style.display = 'flex';
        });

        document.getElementById('addPtpTrigger').addEventListener('click', () => {
            document.getElementById('addPtpModal').style.display = 'flex';
        });

        document.getElementById('cancelRequestEmail').addEventListener('click', () => {
            document.getElementById('requestEmailModal').style.display = 'none';
        });

        document.getElementById('cancelRequestViber').addEventListener('click', () => {
            document.getElementById('requestViberModal').style.display = 'none';
        });

        document.getElementById('cancelRequestLoad').addEventListener('click', () => {
            document.getElementById('requestLoadModal').style.display = 'none';
        });

        document.getElementById('cancelPtp').addEventListener('click', () => {
            document.getElementById('addPtpModal').style.display = 'none';
        });

    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });

const { HOST, PORT } = Config;

document.addEventListener('DOMContentLoaded', () => {
    async function countNotif() {
        const AgentId = sessionStorage.getItem('UserId');
        const Campaign = sessionStorage.getItem('Campaign');

        try {
            const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/countEmailRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId, Campaign })
            });

            const data = await res.json();

            const agentTotalBadge = document.getElementById('agentTotalBadge');
            const agentConfirmBadge = document.getElementById('agentConfirmBadge');

            if (agentTotalBadge && agentConfirmBadge) {
                if (data.success) {
                    agentTotalBadge.innerText = data.total ?? '0';
                    agentConfirmBadge.innerText = data.confirmed ?? '0';
                } else {
                    agentTotalBadge.innerText = '0';
                    agentConfirmBadge.innerText = '0';
                }
            }
        } catch (error) {
            console.error('Error Counting Email Request Count:', error);
        }
    }
    countNotif();
    setInterval(countNotif, 1000);
});


async function emailRequest() {
    const AgentId = sessionStorage.getItem('UserId');
    const agentName = sessionStorage.getItem('Name');
    const Campaign = sessionStorage.getItem('Campaign');
    const Reqemail = document.getElementById('reqemail').value;
    const Reqclient = document.getElementById('reqclient').value;
    const Reqmobile = document.getElementById('reqmobile').value;
    const Reqamount = document.getElementById('reqamount').value;
    const Reqaccount = document.getElementById('reqaccount').value;
    const Reqdetails = document.getElementById('reqdetails').value;
    const reqdpd = document.getElementById('reqdpd').value;
    const messageBox9 = document.getElementById('messageBox9');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/insertEmailRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails, reqdpd })
        });

        const data = await res.json();

        if (data.success) {
            messageBox9.innerText = data.message;
            messageBox9.style.color = 'green';
            messageBox9.style.backgroundColor = '#d4edda';
            messageBox9.style.padding = '10px';
            messageBox9.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox9.innerText = data.message;
            messageBox9.style.color = 'red';
            messageBox9.style.backgroundColor = '#f8d7da';
            messageBox9.style.padding = '10px';
            messageBox9.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Inserting  Email Request:', error);
    }
}

let isNotificationBoxOpen = false;

function toggleNotificationBox() {
    const box = document.getElementById('notificationBox');
    isNotificationBoxOpen = !isNotificationBoxOpen;
    box.style.display = isNotificationBoxOpen ? 'block' : 'none';
}

function markAllAsRead(event) {
    event.stopPropagation(); // prevent toggle when clicking footer
    const badge = document.getElementById('notifBadge');
    badge.style.display = 'none';

    // You can also clear notifications here if you want:
    // document.getElementById('notificationList').innerHTML = '<li>No new notifications</li>';
}

// OPTIONAL: Close box when clicking outside
document.addEventListener('click', function (e) {
    const notif = document.getElementById('notification');
    if (!notif.contains(e.target)) {
        document.getElementById('notificationBox').style.display = 'none';
        isNotificationBoxOpen = false;
    }
});

async function viberRequest() {
    const AgentId = sessionStorage.getItem('UserId');
    const agentName = sessionStorage.getItem('Name');
    const Campaign = sessionStorage.getItem('Campaign');
    const vibclient = document.getElementById('vibclient').value;
    const vibmobile = document.getElementById('vibmobile').value;
    const vibamount = document.getElementById('vibamount').value;
    const vibaccount = document.getElementById('vibaccount').value;
    const vibdetails = document.getElementById('vibdetails').value;
    const vibdpd = document.getElementById('vibdpd').value;
    const messageBox15 = document.getElementById('messageBox15');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/insertViberRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, agentName, Campaign, vibclient, vibmobile, vibamount, vibaccount, vibdetails, vibdpd })
        });

        const data = await res.json();

        if (data.success) {
            messageBox15.innerText = data.message;
            messageBox15.style.color = 'green';
            messageBox15.style.backgroundColor = '#d4edda';
            messageBox15.style.padding = '10px';
            messageBox15.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox15.innerText = data.message;
            messageBox15.style.color = 'red';
            messageBox15.style.backgroundColor = '#f8d7da';
            messageBox15.style.padding = '10px';
            messageBox15.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Inserting  Email Request:', error);
    }
}

async function loadRequest() {
    const AgentId = sessionStorage.getItem('UserId');
    const AgentName = sessionStorage.getItem('Name');
    const Campaign = sessionStorage.getItem('Campaign');
    const reqloadmobile = document.getElementById('reqloadmobile').value;
    const reqloadpurpose = document.getElementById('reqloadpurpose').value;
    const messageBox16 = document.getElementById('messageBox16');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentSimCardLoadingRequest/insertLoadRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, AgentName, Campaign, reqloadmobile, reqloadpurpose })
        });

        const data = await res.json();

        if (data.success) {
            messageBox16.innerText = data.message;
            messageBox16.style.color = 'green';
            messageBox16.style.backgroundColor = '#d4edda';
            messageBox16.style.padding = '10px';
            messageBox16.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox16.innerText = data.message;
            messageBox16.style.color = 'red';
            messageBox16.style.backgroundColor = '#f8d7da';
            messageBox16.style.padding = '10px';
            messageBox16.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Inserting  Load Request:', error);
    }
}

async function addPtp() {
    const ClientName = document.getElementById('ptpName').value;
    const PtpEmail = document.getElementById('ptpEmail').value;
    const PtpAccountNumber = document.getElementById('ptpAccountNumber').value;
    const PtpMobileNumber = document.getElementById('ptpMobileNumber').value;
    const PtpAmount = document.getElementById('ptpAmount').value;
    const PtpDpd = document.getElementById('ptpDpd').value;
    const AgentName = sessionStorage.getItem('Name');
    const AgentId = sessionStorage.getItem('UserId');
    const Campaign = sessionStorage.getItem('Campaign');
    const messageBox17 = document.getElementById('messageBox17');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentPtp/addPtp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ClientName, PtpEmail, PtpAccountNumber, PtpMobileNumber, PtpAmount, PtpDpd, AgentName, AgentId, Campaign })
        });

        const data = await res.json();

        if (data.success) {
            messageBox17.innerText = data.message;
            messageBox17.style.color = 'green';
            messageBox17.style.backgroundColor = '#d4edda';
            messageBox17.style.padding = '10px';
            messageBox17.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox17.innerText = data.message;
            messageBox17.style.color = 'red';
            messageBox17.style.backgroundColor = '#f8d7da';
            messageBox17.style.padding = '10px';
            messageBox17.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Inserting  PTP:', error);
    }
}