window.addEventListener('DOMContentLoaded', function () {
    const AgentId = sessionStorage.getItem('UserId');

    function populateTableRows(tableId, data) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) {
            console.error(`Table with ID "${tableId}" not found!`);
            return;
        }
        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 10;
            td.style.textAlign = 'center';
            td.textContent = 'No data available';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.date || ''}</td>
                <td>${item.agentName || ''}</td>
                <td>${item.email || ''}</td>
                <td>${item.clientName || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td style="text-align:center;">₱${item.amount || '-'}</td>
                <td>${item.accountNumber || ''}</td>
                <td>${item.request || ''}</td>
                <td style="text-align:center;">${item.confirmedAmount ? `₱${item.confirmedAmount}` : '-'}</td>
                <td>${item.remarks || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Function to fetch and populate all tables
    async function fetchAndPopulateTables() {
        try {
            const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AgentEmailRequest/emailRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId })
            });

            const data = await res.json();

            populateTableRows('request', data.pending || []);
            populateTableRows('sent', data.sent || []);
            populateTableRows('confirmed', data.confirmed || []);

            if (!data.success) {
                console.warn('No data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching email request data:', error);
            populateTableRows('request', []);
            populateTableRows('sent', []);
            populateTableRows('confirmed', []);
        }
    }

    // Initial fetch
    fetchAndPopulateTables();

    // Refresh every 5 seconds (5000 ms)
    setInterval(fetchAndPopulateTables, 2000);
});
