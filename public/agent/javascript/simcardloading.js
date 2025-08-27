window.addEventListener('DOMContentLoaded', function () {
    const AgentId = sessionStorage.getItem('UserId');
    const Campaign = sessionStorage.getItem('Campaign');

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
            td.colSpan = 8;
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
                <td>${item.campaign || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td>${item.loadPurposes || ''}</td>
                <td>${item.remarks || ''}</td>
                <td>${item.loadAt || ''}</td>
                <td>
                ${item.remarks?.trim().toLowerCase() === 'done'
                    ? ''
                    : `<button type="button" onclick="requestEditModal('${item.accountNumber}', '${item.request}')">Edit</button>`}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    async function fetchAndPopulateTables() {
        try {
            const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AgentSimCardLoadingRequest/loadRequestDatas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId, Campaign })
            });

            const data = await res.json();

            populateTableRows('sim', data.pending || []);

            if (!data.success) {
                console.warn('No data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching email request data:', error);
            populateTableRows('sim', []);

        }
    }

    fetchAndPopulateTables();
    setInterval(fetchAndPopulateTables, 3000);
});