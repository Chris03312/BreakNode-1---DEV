window.addEventListener('DOMContentLoaded', function () {
    const AgentId = sessionStorage.getItem('UserId');
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL

    function populateTableRows(tableId, data) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 12;
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
                <td style="text-align:center;">${item.confirmedAmount ? `₱${item.confirmedAmount}` : 'Not confirmed yet'}</td>
                <td>${item.remarks || ''}</td>
                <td>
                    <button class="send-btn" onclick="sendBtn('${item.agentId}', '${item.email}', '${item.clientName}', '${item.amount}', '${item.accountNumber}')">Send</button>
                    <button class="confirm-btn" onclick="confirmAmountBtn('${item.agentId}', '${item.email}')">Confirm</button>
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
        populateTableRows('mec130', responseData.mec130 || []);
        populateTableRows('mec61', responseData.mec61 || []);
        populateTableRows('mec121', responseData.mec121 || []);
    };

    const showAllTablesWithNoData = () => {
        document.querySelectorAll('.box').forEach(box => box.style.display = 'block');
        populateTableRows('mpl130', []);
        populateTableRows('mpl91', []);
        populateTableRows('mec130', []);
        populateTableRows('mec61', []);
        populateTableRows('mec121', []);
    };

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
                } else if (agents === 'MEC') {
                    showBoxes('.box.mec');
                    populateTableRows('mec130', []);
                    populateTableRows('mec61', []);
                    populateTableRows('mec121', []);
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
            } else if (agents === 'MEC') {
                showBoxes('.box.mec');
                populateTableRows('mec130', responseData.mec130 || []);
                populateTableRows('mec61', responseData.mec61 || []);
                populateTableRows('mec121', responseData.mec121 || []);
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

    // Initial fetch
    fetchAndPopulateTables();

    // Refresh every 5 seconds
    setInterval(fetchAndPopulateTables, 5000);
});


let emailData = {}; // define it outside

function sendBtn(AgentId, Email, ClientName, Amount, AccountNumber) {
    emailData = { AgentId, Email, ClientName, Amount, AccountNumber };
    document.getElementById('confirmModal').style.display = 'flex';
    document.getElementById('email').innerText = Email;

    console.log('Email Data', emailData);

    const cancelbtn = document.getElementById('cancelModalBtn');
    cancelbtn.addEventListener('click', () => {
        document.getElementById('confirmModal').style.display = 'none';
    });
}

async function confirmModalBtn() {
    const { AgentId, Email, ClientName, Amount, AccountNumber } = emailData;

    const messageBox10 = document.getElementById('messageBox10');
    const confirmModalBtn = document.getElementById('confirmModalBtn');
    confirmModalBtn.innerText = "Sending....";

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminEmailRequest/sendEmailRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, Email, ClientName, Amount, AccountNumber })
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

async function confirmAmountBtn(AgentId, Email) {
    confirmEmail = { AgentId, Email };
    document.getElementById('confirmAmountModal').style.display = 'flex';
    document.getElementById('confirmEmail').innerText = Email;

    console.log('Email Data', confirmEmail);

    const cancelAmountbtn = document.getElementById('cancelConfirmAmountModalBtn');
    cancelAmountbtn.addEventListener('click', () => {
        document.getElementById('confirmAmountModal').style.display = 'none';
    });
}

async function confirmAmountModalBtn() {
    const { AgentId, Email } = confirmEmail;
    const ConfirmedAmount = document.getElementById('ConfirmedAmount').value;

    const messageBox11 = document.getElementById('messageBox11');
    const confirmAmountModalBtn = document.getElementById('confirmAmountModalBtn');
    confirmAmountModalBtn.innerText = "Updating...";

    try {
        const res = await fetch(`http://${HOST}:${PORT}/AdminEmailRequest/confirmedAmount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AgentId, Email, ConfirmedAmount })
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
        confirmAmountModalBtn.innerText = "Confirm"; // reset button text
    }
}


