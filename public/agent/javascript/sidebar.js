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

        document.getElementById('cancelRequestEmail').addEventListener('click', () => {
            document.getElementById('requestEmailModal').style.display = 'none';
        });

        document.getElementById('cancelRequestViber').addEventListener('click', () => {
            document.getElementById('requestViberModal').style.display = 'none';
        });

    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });

const { HOST, PORT } = Config;

document.addEventListener('DOMContentLoaded', () => {
    const reqDetails = document.getElementById('reqdetails');
    const otherRequestInput = document.getElementById('reqothers');

    if (reqDetails && otherRequestInput) {
        reqDetails.addEventListener('change', function () {
            if (this.value === 'Others') {
                otherRequestInput.style.display = 'flex';
            } else {
                otherRequestInput.style.display = 'none';
            }
        });
    }
});

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
    setInterval(countNotif, 1000); // Run every 1 second


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
