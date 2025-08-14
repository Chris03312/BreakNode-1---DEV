window.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL

    function populateTableRows(tableId, data) {
        const tbody = document.querySelector(`#${tableId} tbody`);
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
                <td>${item.amount || ''}</td>
                <td>${item.accountNumber || ''}</td>
                <td>${item.request || ''}</td>
                <td>${item.confirmedAmount || ''}</td>
                <td>${item.remarks || ''}</td>
                <td>
                    <button class="send-btn" onclick="sendBtn(${item.requestId})">Send</button>
                    <button class="confirm-btn" onclick="confirmBtn(${item.requestId})">Confirm</button>
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

    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/EmailRequest/emailRequest`, {
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

        // Fallback for error
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
});
