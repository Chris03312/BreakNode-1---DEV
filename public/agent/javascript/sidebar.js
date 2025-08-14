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

        document.getElementById('cancelRequestEmail').addEventListener('click', () => {
            document.getElementById('requestEmailModal').style.display = 'none';
        });

    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
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
    const messageBox9 = document.getElementById('messageBox9');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/insertEmailRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, agentName, Campaign, Reqemail, Reqclient, Reqmobile, Reqamount, Reqaccount, Reqdetails })
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