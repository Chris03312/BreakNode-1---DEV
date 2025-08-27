window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL

    function populateTableRows(tableId, data) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) {
            console.error(`Table with ID "${tableId}" not found!`);
            return;
        }

        const isViberTable = tableId === 'mecViber' || tableId === 'mplViber';
        const columnCount = isViberTable ? 10 : 11; // Adjust based on columns shown

        tbody.innerHTML = '';

        const filteredData = data.filter(item => item.remarks?.trim().toLowerCase() !== 'confirmed');

        if (filteredData.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = columnCount;
            td.style.textAlign = 'center';
            td.textContent = 'No data available';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        if (!data || data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = columnCount;
            td.style.textAlign = 'center';
            td.textContent = 'No data available';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        data.forEach(item => {
            if (item.remarks?.trim().toLowerCase() === 'confirmed') return;

            const tr = document.createElement('tr');

            tr.innerHTML = isViberTable
                ? `
                <td>${item.date || ''}</td>
                <td>${item.agentName || ''}</td>
                <td>${item.clientName || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td style="text-align:center;">₱${item.amount ? Number(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '-'}</td>
                <td>${item.accountNumber || ''}</td>
                <td>${item.request || ''}</td>
                <td>${item.dpd || ''}</td>
                <td style="text-align:center;">${item.confirmedAmount ? `₱${item.confirmedAmount}` : 'Not Confirmed Yet'}</td>
                <td>${item.remarks || ''}</td>
                <td>
                    <button class="confirm-btn" onclick="confirmViberAmountBtn('${item.agentId}')"
                        ${item.remarks?.trim().toLowerCase() === 'pending' ? 'disabled' : ''}>
                        Confirm
                    </button>
                </td>
                `
                : `
                <td>${item.date || ''}</td>
                <td>${item.agentName || ''}</td>
                <td>${item.email || ''}</td>
                <td>${item.clientName || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td style="text-align:center;">₱${item.amount ? Number(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '-'}</td>
                <td>${item.accountNumber || ''}</td>
                <td>${item.request || ''}</td>
                <td>${item.dpd || ''}</td>
                <td style="text-align:center;">${item.confirmedAmount ? `₱${item.confirmedAmount}` : 'Not Confirmed Yet'}</td>
                <td>${item.remarks || ''}</td>
                <td>
                    <button 
                        class="send-btn" 
                        onclick="sendBtn('${item.agentId}', '${item.email}', '${item.clientName}', '${item.amount}', '${item.accountNumber}', '${item.campaign}')"${item.remarks?.toLowerCase() === 'sent' ? 'disabled' : ''}>Send
                    </button>
                    <button class="confirm-btn" onclick="confirmAmountBtn('${item.agentId}', '${item.accountNumber}', '${item.email}')"
                        ${item.remarks?.trim().toLowerCase() === 'pending' ? 'disabled' : ''}>
                        Confirm
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    const showBoxes = (selector) => {
        document.querySelectorAll('.box').forEach(box => box.style.display = 'none');
        document.querySelectorAll(selector).forEach(box => box.style.display = 'block');
    };

    const showAllTablesWithData = (responseData) => {
        document.querySelectorAll('.box').forEach(box => box.style.display = 'block');
        populateTableRows('mpl130', responseData.mpl130 || []);
        populateTableRows('mpl91', responseData.mpl91 || []);
        populateTableRows('mplViber', responseData.mplViber || []);
        populateTableRows('mec130', responseData.mec130 || []);
        populateTableRows('mec61', responseData.mec61 || []);
        populateTableRows('mec121', responseData.mec121 || []);
        populateTableRows('mecViber', responseData.mecViber || []);
    };

    const showAllTablesWithNoData = () => {
        document.querySelectorAll('.box').forEach(box => box.style.display = 'block');
        populateTableRows('mpl130', []);
        populateTableRows('mpl91', []);
        populateTableRows('mplViber', []);
        populateTableRows('mec130', []);
        populateTableRows('mec61', []);
        populateTableRows('mec121', []);
        populateTableRows('mecViber', []);

    };

    async function AutoArchiveBroken(brokenPTP) {
        const { agentId, email, clientName, accountNumber } = brokenPTP;

        try {
            await fetch(`http://${Config.HOST}:${Config.PORT}/AgentEmailRequest/emailRequest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId, email, clientName, accountNumber })
            });
        } catch (error) {
            console.error('Error Admin Sending BrokenPTP Email Request:', error);
        }
    }

    async function fetchAndPopulateTables() {
        try {
            const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AdminEmailRequest/emailRequest`, {
                method: 'GET'
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const responseData = await res.json();

            if (!responseData.success) {
                console.warn('No data:', responseData.message);
                if (agents === 'MPL') {
                    showBoxes('.box.mpl');
                    populateTableRows('mpl130', []);
                    populateTableRows('mpl91', []);
                    populateTableRows('mplViber', []);
                } else if (agents === 'MEC') {
                    showBoxes('.box.mec');
                    populateTableRows('mec130', []);
                    populateTableRows('mec61', []);
                    populateTableRows('mec121', []);
                    populateTableRows('mecViber', []);

                } else {
                    showAllTablesWithNoData();
                }
                return;
            }

            // Show & populate based on agent param
            if (agents === 'MPL') {
                showBoxes('.box.mpl');
                populateTableRows('mpl130', responseData.mpl130 || []);
                populateTableRows('mpl91', responseData.mpl91 || []);
                populateTableRows('mplViber', responseData.mplViber || []);
            } else if (agents === 'MEC') {
                showBoxes('.box.mec');
                populateTableRows('mec130', responseData.mec130 || []);
                populateTableRows('mec61', responseData.mec61 || []);
                populateTableRows('mec121', responseData.mec121 || []);
                populateTableRows('mecViber', responseData.mecViber || []);
            } else {
                showAllTablesWithData(responseData);
            }

        } catch (error) {
            console.error('Error fetching or processing data:', error);

            if (agents === 'MPL') {
                showBoxes('.box.mpl');
                populateTableRows('mpl130', []);
                populateTableRows('mpl91', []);
            } else if (agents === 'MEC') {
                showBoxes('.box.mec');
                populateTableRows('mec130', []);
                populateTableRows('mec61', []);
                populateTableRows('mec121', []);
            } else {
                showAllTablesWithNoData();
            }
        }
    }

    fetchAndPopulateTables();
    setInterval(fetchAndPopulateTables, 5000);
});


let emailData = {};

function sendBtn(AgentId, Email, ClientName, Amount, AccountNumber, Campaign) {
    emailData = { AgentId, Email, ClientName, Amount, AccountNumber, Campaign };
    document.getElementById('confirmModal').style.display = 'flex';
    document.getElementById('email').innerText = Email;

    console.log('Email Data', emailData);

    const cancelbtn = document.getElementById('cancelModalBtn');
    cancelbtn.addEventListener('click', () => {
        document.getElementById('confirmModal').style.display = 'none';
    });
}

async function confirmModalBtn() {
    const { AgentId, Email, ClientName, Amount, AccountNumber, Campaign } = emailData;

    const messageBox10 = document.getElementById('messageBox10');
    const confirmModalBtn = document.getElementById('confirmModalBtn');
    confirmModalBtn.innerText = "Sending....";

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminEmailRequest/sendEmailRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, Email, ClientName, Amount, AccountNumber, Campaign })
        });

        const data = await res.json();

        if (data.success) {
            messageBox10.innerText = data.message;
            messageBox10.style.color = 'green';
            messageBox10.style.backgroundColor = '#d4edda';
            messageBox10.style.padding = '10px';
            messageBox10.style.borderRadius = '5px';

            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            messageBox10.innerText = data.message;
            messageBox10.style.color = 'red';
            messageBox10.style.backgroundColor = '#f8d7da';
            messageBox10.style.padding = '10px';
            messageBox10.style.borderRadius = '5px';
        }
    } catch (error) {
        console.error('Error Admin Sending Email Request:', error);
    } finally {
        confirmModalBtn.innerText = "Confirm"; // reset button text
    }
}


let confirmEmail = {};

async function confirmAmountBtn(AgentId, AccountNumber, Email) {
    confirmEmail = { AgentId, AccountNumber, Email };
    document.getElementById('confirmAmountModal').style.display = 'flex';
    document.getElementById('confirmEmail').innerText = Email;

    console.log('Email Data', confirmEmail);

    const cancelAmountbtn = document.getElementById('cancelConfirmAmountModalBtn');
    cancelAmountbtn.addEventListener('click', () => {
        document.getElementById('confirmAmountModal').style.display = 'none';
    });
}

async function confirmAmountModalBtn() {
    const { AgentId, AccountNumber, Email } = confirmEmail;
    const ConfirmedAmount = document.getElementById('ConfirmedAmount').value;

    const messageBox11 = document.getElementById('messageBox11');
    const confirmAmountModalBtn = document.getElementById('confirmAmountModalBtn');
    confirmAmountModalBtn.innerText = "Updating...";

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminEmailRequest/confirmedAmount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, AccountNumber, ConfirmedAmount, Email })
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
        console.error('Error Admin Sending Confirm Email Amount Request:', error);
    } finally {
        confirmAmountModalBtn.innerText = "Confirm";
    }
}
