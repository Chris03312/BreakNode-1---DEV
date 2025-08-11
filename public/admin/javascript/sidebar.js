fetch('/admin/sidebar/sidebar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('sidebar').innerHTML = html;

        // Now elements exist, safe to attach event listeners and update content
        const userId = sessionStorage.getItem('UserId');
        const name = sessionStorage.getItem('Name');
        const nameElement = document.getElementById('AgentName');
        if (nameElement) {
            nameElement.innerText = name || "No Name Found";
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

    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });
