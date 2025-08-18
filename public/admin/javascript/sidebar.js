fetch('/admin/sidebar/sidebar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebar').innerHTML = html;

        // Now elements exist, safe to attach event listeners and update content
        const UserId = sessionStorage.getItem('UserId');
        const Name = sessionStorage.getItem('Name');

        console.log('UserId:', UserId);
        console.log('Name:', Name);

        const nameElement = document.getElementById('AgentName');
        if (nameElement) {
            nameElement.innerText = Name || "No Name Found";
        }

        document.getElementById('addAgentBreakTrigger').addEventListener('click', () => {
            document.getElementById('agentBreakModal').style.display = 'flex';
        });

        document.getElementById('addAgentTrigger').addEventListener('click', () => {
            document.getElementById('agentAgentModal').style.display = 'flex';
        });

        document.getElementById('closeBreakModal').addEventListener('click', () => {
            document.getElementById('agentBreakModal').style.display = 'none';
        });

        document.getElementById('closeAgentModal').addEventListener('click', () => {
            document.getElementById('agentAgentModal').style.display = 'none';
        });

        AgentsWithoutBreak();
    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });

const { HOST, PORT } = Config;


async function AgentsWithoutBreak() {
    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/agentwithoutsched`, {
            method: 'GET'
        });

        const data = await res.json();

        if (data.success) {
            const select = document.getElementById('AgentsId');
            select.innerHTML = '<option value="">--Select User ID--</option>';

            data.data.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id;
                option.textContent = agent.id;
                select.appendChild(option);
            });
        } else {
            console.warn(data.message);
        }
    } catch (error) {
        console.error('Error Getting Agent without break schedule:', error);
    }
}

async function countNotif() {
    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminEmailRequest/countEmailRequest`, {
            method: 'GET',
        });

        const data = await res.json();

        const totalBadge = document.getElementById('totalBadge');
        const mecBadge = document.getElementById('mecBadge');
        const mplBadge = document.getElementById('mplBadge');

        if (data.success) {
            totalBadge.innerText = data.total ?? 0;
            mecBadge.innerText = data.mec ?? 0;
            mplBadge.innerText = data.mpl ?? 0;
        } else {
            totalBadge.innerText = '0';
            mecBadge.innerText = '0';
            mplBadge.innerText = '0';
        }
    } catch (error) {
        console.error('Error Counting Email Request Count:', error);
    }
}


countNotif();
setInterval(countNotif, 1000);


async function addAgent() {
    const UserId = document.getElementById('agentId').value;
    const Name = document.getElementById('name').value;
    const Password = document.getElementById('agentPass').value;
    const Campaign = document.getElementById('agentCampaign').value;
    const messageBox = document.getElementById('messageBox');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminUsers/insertUsers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, Name, Password, Campaign })
        });

        const data = await res.json();

        if (data.success) {
            messageBox.innerText = data.message;
            messageBox.style.color = '#155724';
            messageBox.style.backgroundColor = '#d4edda';
            messageBox.style.border = '1px solid #c3e6cb';
            messageBox.style.padding = '10px';
            messageBox.style.borderRadius = '5px';
            messageBox.style.display = 'block';

            setTimeout(() => {
                location.reload()
            }, 2000);
        } else {
            messageBox.innerText = data.message;
        }
    } catch (error) {
        console.error('Error Creating New User Agent:', error);

    }
}

async function AddNewBreakSchedule() {
    const UserId = document.getElementById('AgentsId').value;
    const FffBreak = document.getElementById('FffBreak').value;
    const FftBreak = document.getElementById('FftBreak').value;
    const FoneHour = document.getElementById('FoneHour').value;
    const ToneHour = document.getElementById('ToneHour').value;
    const SffBreak = document.getElementById('SffBreak').value;
    const SftBreak = document.getElementById('SftBreak').value;
    const messageBox6 = document.getElementById('messageBox6');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/User/insertSchedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId, FffBreak, FftBreak, FoneHour, ToneHour, SffBreak, SftBreak })
        });

        const data = await res.json();

        if (data.success) {
            messageBox6.innerText = data.message;
            messageBox6.style.color = '#155724';
            messageBox6.style.backgroundColor = '#d4edda';
            messageBox6.style.border = '1px solid #c3e6cb';
            messageBox6.style.padding = '10px';
            messageBox6.style.borderRadius = '5px';
            messageBox6.style.display = 'block';

            // Refresh the dropdown after successful insert
            await AgentsWithoutBreak();

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            messageBox6.innerText = data.message;
        }
    } catch (error) {
        console.error('Error inserting schedule:', error);
    }
}
