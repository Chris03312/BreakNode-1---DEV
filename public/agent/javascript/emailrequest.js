window.addEventListener('DOMContentLoaded', function () {
    const AgentId = sessionStorage.getItem('UserId');
    const Campaign = this.sessionStorage.getItem('Campaign');

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
            td.colSpan = tableId === 'viber' ? 10 : 11;  // adjust colspan depending on table
            td.style.textAlign = 'center';
            td.textContent = 'No data available';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');

            if (tableId === 'viber' && item.request === 'Viber Request') {
                tr.innerHTML = `
                <td>${item.date || ''}</td>
                <td>${item.agentName || ''}</td>
                <td>${item.clientName || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td style="text-align:center;">₱${item.amount || '-'}</td>
                <td>${item.accountNumber || ''}</td>
                <td>${item.request || ''}</td>
                <td style="text-align:center;">${item.confirmedAmount ? `₱${item.confirmedAmount}` : '-'}</td>
                <td>${item.remarks || ''}</td>
                <td>
                ${item.remarks?.trim().toLowerCase() === 'sent'
                        ? ''
                        : `<button type="button" onclick="requestEditModal('${item.accountNumber}', '${item.request}')">Edit</button>`}
                </td>
            `;
            } else {
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
                <td>
                ${['sent', 'confirmed'].includes(item.remarks?.trim().toLowerCase())
                        ? ''
                        : `<button type="button" onclick="requestEditModal('${item.accountNumber}', '${item.request}')">Edit</button>`}
                </td>
            `;
            }

            tbody.appendChild(tr);
        });
    }

    async function fetchAndPopulateTables() {
        try {
            const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AgentEmailRequest/emailRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId, Campaign })
            });

            const data = await res.json();

            populateTableRows('request', data.pending || []);
            populateTableRows('viber', data.viber || []);
            populateTableRows('confirmed', data.confirmed || []);

            if (!data.success) {
                console.warn('No data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching email request data:', error);
            populateTableRows('request', []);
            populateTableRows('viber', []);
            populateTableRows('confirmed', []);
        }
    }

    fetchAndPopulateTables();
    setInterval(fetchAndPopulateTables, 3000);
});


async function requestEditModal(AccountNumber, request) {
    const AgentId = sessionStorage.getItem('UserId');
    const messageBox11 = document.getElementById('messageBox11');
    if (request === 'Viber Request') {
        const requestEditEmailModal = document.getElementById('requestEditEmailModal');
        requestEditEmailModal.style.display = 'flex';

        try {
            const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/emailEditRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId, AccountNumber, request })
            });

            const data = await res.json();

            if (data.success) {
                const edit = data.data;
                document.getElementById('reqeditemail').value = edit.email;
                document.getElementById('reqeditclient').value = edit.clientName;
                document.getElementById('reqeditmobile').value = edit.mobileNumber;
                document.getElementById('reqeditamount').value = edit.amount;
                document.getElementById('reqeditaccount').value = edit.accountNumber;
                document.getElementById('reqeditdetails').value = edit.request;
            } else {
                messageBox11.innerText = data.message;
            }
        } catch (error) {
            console.error('Error Agent Edit Email Request:', error);
        }

        document.getElementById('cancelRequestEditEmail').addEventListener('click', () => {
            requestEditEmailModal.style.display = 'none';
        })
    } else if (request === 'Proof of Payment') {
        const requestEditEmailModal = document.getElementById('requestEditEmailModal');
        requestEditEmailModal.style.display = 'flex';

        try {
            const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/emailEditRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ AgentId, AccountNumber, request })
            });

            const data = await res.json();

            if (data.success) {
                const edit = data.data;
                document.getElementById('reqeditemail').value = edit.email;
                document.getElementById('reqeditclient').value = edit.clientName;
                document.getElementById('reqeditmobile').value = edit.mobileNumber;
                document.getElementById('reqeditamount').value = edit.amount;
                document.getElementById('reqeditaccount').value = edit.accountNumber;
                document.getElementById('reqeditdetails').value = edit.request;
            } else {
                messageBox11.innerText = data.message;
            }
        } catch (error) {
            console.error('Error Agent Edit Email Request:', error);

        }

        document.getElementById('cancelRequestEditEmail').addEventListener('click', () => {
            requestEditEmailModal.style.display = 'none';
        });
    }
}

async function emailEditRequest() {
    const AgentId = sessionStorage.getItem('UserId');
    const Campaign = sessionStorage.getItem('Campaign');
    const reqeditemail = document.getElementById('reqeditemail').value;
    const reqeditclient = document.getElementById('reqeditclient').value;
    const reqeditmobile = document.getElementById('reqeditmobile').value;
    const reqeditamount = document.getElementById('reqeditamount').value;
    const reqeditaccount = document.getElementById('reqeditaccount').value;
    const reqeditdetails = document.getElementById('reqeditdetails').value;
    const messageBox11 = document.getElementById('messageBox11');

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AgentEmailRequest/emailUpdateRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, Campaign, reqeditemail, reqeditclient, reqeditmobile, reqeditamount, reqeditaccount, reqeditdetails })
        });

        const data = await res.json();

        if (data.success) {
            messageBox11.innerText = data.message;
            messageBox11.style.color = 'green';
            messageBox11.style.backgroundColor = '#d4edda';
            messageBox11.style.padding = '10px';
            messageBox11.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox11.innerText = data.message;
            messageBox11.style.color = 'red';
            messageBox11.style.backgroundColor = '#f8d7da';
            messageBox11.style.padding = '10px';
            messageBox11.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Agent Updating Email Request:', error);
    }
}