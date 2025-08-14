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

        document.getElementById('requestEmailTrigger').addEventListener('click', () => {
            document.getElementById('closeEmailRequestModal').style.display = 'none';
        });

    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });

async function emailRequest() {
    const AccountId = sessionStorage.getItem('UserId');
    const Name = sessionStorage('name');
    const campaign = sessionStorage('campaign');
    const reqname = document.getElementById('reqname').value;
}