window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL

    document.getElementById('title').innerText = agents + ' Sim Card Load | Inventory';

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
            td.colSpan = 9; // Number of columns in your table
            td.style.textAlign = 'center';
            td.textContent = 'No data available';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        data.forEach(item => {
            if (item.remarks?.trim().toLowerCase() === 'confirmed') return;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.date || ''}</td>
                <td>${item.agentName || ''}</td>
                <td>${item.campaign || ''}</td>
                <td>${item.mobileNumber || ''}</td>
                <td>${item.loadPurposes || ''}</td>
                <td>${item.loadAt || ''}</td>
                <td>${item.spamAt || ''}</td>
                <td>${item.remarks || ''}</td>
                <td>
                    <!-- Example Action Buttons -->
                    <button onclick="confirmLoadBtn('${item.agentId}', '${item.campaign}', '${item.mobileNumber}', this)">Confirm</button>
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
        populateTableRows('mec', responseData.mec || []);
        populateTableRows('mpl', responseData.mpl || []);
        populateTableRows('sms', responseData.sms || []);

    };

    const showAllTablesWithNoData = () => {
        document.querySelectorAll('.box').forEach(box => box.style.display = 'block');
        populateTableRows('mec', []);
        populateTableRows('mpl', []);
        populateTableRows('sms', []);
    };

    async function fetchAndPopulateTables() {
        try {
            const res = await fetch(`http://${Config.HOST}:${Config.PORT}/AdminSimCardLoadingRequest/simLoadingDatas`, {
                method: 'GET'
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const responseData = await res.json();

            if (!responseData.success) {
                console.warn('No data:', responseData.message);
                if (agents === 'MPL') {
                    showBoxes('.box.mpl');
                    populateTableRows('mpl', []);
                } else if (agents === 'MEC') {
                    showBoxes('.box.mec');
                    populateTableRows('mec', []);
                } else if (agents === 'SMS') {
                    showBoxes('.box.mec');
                    populateTableRows('sms', []);
                } else {
                    showAllTablesWithNoData();
                }
                return;
            }

            // ✅ CORRECTED TO MATCH BACKEND RESPONSE STRUCTURE
            if (agents === 'MPL') {
                showBoxes('.box.mpl');
                populateTableRows('mpl', responseData.mpl || []);
            } else if (agents === 'MEC') {
                showBoxes('.box.mec');
                populateTableRows('mec', responseData.mec || []);
            } else if (agents === 'SMS') {
                showBoxes('.box.sms');
                populateTableRows('sms', responseData.sms || []);
            } else {
                showAllTablesWithData(responseData);
            }


        } catch (error) {
            console.error('Error fetching or processing data:', error);

            if (agents === 'MPL') {
                showBoxes('.box.mpl');
                populateTableRows('mpl', []);
            } else if (agents === 'MEC') {
                showBoxes('.box.mec');
                populateTableRows('mec', []);
            } else if (agents === 'MEC') {
                showBoxes('.box.sms');
                populateTableRows('sms', []);
            } else {
                showAllTablesWithNoData();
            }
        }
    }

    fetchAndPopulateTables();
    setInterval(fetchAndPopulateTables, 5000);
});


async function confirmLoadBtn(AgentId, Campaign, MobileNumber, btn) {
    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminSimCardLoadingRequest/confirmLoadRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, Campaign, MobileNumber })
        });

        const data = await res.json();

        const row = btn.closest('tr');

        if (data.success) {
            row.classList.add('fade-out');
            setTimeout(() => row.remove(), 600);
        } else {
            row.classList.add('shake');
            setTimeout(() => row.classList.remove('shake'), 400);
        }
    } catch (error) {
        console.error('Error Admin Confirm Load Request:', error);
    }
}





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
            body: JSON.stringify({ AgentId, AccountNumber, ConfirmedAmount })
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
