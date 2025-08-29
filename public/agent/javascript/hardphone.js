document.addEventListener('DOMContentLoaded', () => {
    const Campaign = sessionStorage.getItem('Campaign');
    const AgentName = sessionStorage.getItem('Name');


    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'Semicolon') {
            event.preventDefault();

            const activeElement = document.activeElement;

            if (activeElement && activeElement.classList.contains('editable-cell') && activeElement.isContentEditable) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                activeElement.textContent = timeString;
                activeElement.blur();
            }
        }
    });

    document.addEventListener('keydown', async (event) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'Minus') {
            event.preventDefault();

            const activeElement = document.activeElement;

            if (activeElement && activeElement.tagName === 'TD') {
                const row = activeElement.parentElement;
                if (row && row.tagName === 'TR') {
                    row.querySelectorAll('td').forEach(td => {
                        td.style.backgroundColor = 'violet';
                    });

                    // Update CSV: assuming row[header] is accessible
                    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
                    const rowData = filteredData[(currentPage - 1) * pageSize + rowIndex];

                    try {
                        const res = await fetch(`http://${HOST}:${PORT}/AgentUsers/hardphoneUpdate`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                AgentName,
                                Hardphone,
                                column: 'RowStatus', // <-- Ensure this exists in your CSV
                                value: 'Violet',
                                originalRow: rowData
                            })
                        });

                        const result = await res.json();
                        if (!result.success) {
                            alert(`❌ Failed to update CSV: ${result.message}`);
                        } else {
                            // Update local data too
                            rowData['RowStatus'] = 'Violet';
                        }
                    } catch (err) {
                        console.error('Update error:', err);
                        alert('⚠️ Failed to update CSV due to network/server error.');
                    }
                }
            }
        }
    });


    let Hardphone = '';
    if (Campaign === 'MEC 1 - 30') Hardphone = 'MEC HARDPHONE 1 - 30';
    else if (Campaign === 'MEC 61 AND UP') Hardphone = 'MEC HARDPHONE 61 AND UP';
    else if (Campaign === 'MEC 121 AND UP') Hardphone = 'MEC HARDPHONE 121 AND UP';
    else if (Campaign === 'MPL 1 - 30') Hardphone = 'MPL HARDPHONE 1 - 30';
    else if (Campaign === 'MPL 91 AND UP') Hardphone = 'MPL HARDPHONE 91 AND UP';

    const container = document.getElementById('table-container');
    const paginationControls = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('search-input');

    let currentPage = 1;
    const pageSize = 500;
    let fullData = [];
    let filteredData = [];

    const editableColumns = [
        'Dialing Time',
        'Ring Time',
        'Customer Pickup Time',
        'Talk Start Time',
        'End Time',
        'Dialing Rounds',
        'Call Result',
        'Call Disposition',
        'Actions',
        'Group Name',
        'CSAT Response',
        'Admin Intervention',
        'Reason for Transfer',
        'Remarks',
        'PTP Date',
        'PTP Amount'
    ];

    if (container) {
        container.innerHTML = `
        <div id="loading-spinner">
            <div class="spinner"></div>
            <span>Loading data, please wait...</span>
        </div>`;
    }

    hardphoneData();

    async function hardphoneData() {
        try {
            const res = await fetch(`http://${HOST}:${PORT}/AgentUsers/hardphoneData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Hardphone, AgentName })
            });

            const data = await res.json();

            if (data.success) {
                fullData = data.data;
                if (!fullData || fullData.length === 0) {
                    container.innerHTML = ` 
                        <div style="
                            padding: 20px; 
                            margin: 20px auto; 
                            max-width: 600px; 
                            background-color: #ffe6e6; 
                            border: 1px solid #ff4d4d; 
                            border-radius: 8px; 
                            color: #b30000; 
                            font-weight: bold; 
                            font-size: 1.1rem; 
                            text-align: center;
                            box-shadow: 0 2px 8px rgba(179,0,0,0.2);
                        ">
                            ❌ No assigned fast call.
                        </div>
                        `;
                    return;
                }

                filteredData = fullData;
                renderTablePage(currentPage);
                renderPaginationControls();
            } else {
                container.innerHTML = `<p style="color: red;">${data.message}</p>`;
            }

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = `<p style="color: red;">Server error.</p>`;
        }
    }

    function filterData(searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredData = fullData.filter(row =>
            Object.values(row).some(val => String(val).toLowerCase().includes(term))
        );

        if (filteredData.length === 0) {
            container.innerHTML = `<p style="color: red;">No matching data found.</p>`;
            paginationControls.innerHTML = '';
        } else {
            currentPage = 1;
            renderTablePage(currentPage);
            renderPaginationControls();
        }
    }

    function renderTablePage(page) {
        const start = (page - 1) * pageSize;
        const end = page * pageSize;
        renderTable(filteredData.slice(start, end));
    }

    function renderTable(data) {
        if (!container) return;

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');

            // *** HERE: Check if RowStatus is 'Violet' (case-insensitive) and set background color ***
            if (row['RowStatus'] && row['RowStatus'].toLowerCase() === 'violet') {
                tr.style.backgroundColor = 'violet';
            }

            headers.forEach(header => {
                const td = document.createElement('td');
                let value = row[header] ?? '';

                if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                    value = value.split('T')[0];
                }

                td.textContent = value;

                if (editableColumns.includes(header)) {
                    td.classList.add('editable-cell');

                    const selectColumns = {
                        'Dialing Rounds': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        'Call Result': [
                            'Contact_Unanswered - No_Answer',
                            'Contact_Answered - Connection_Problems_of_Agents',
                            'Contact_Answered - Contact_Short_Abandoned',
                            'Contact_Answered - Customer_Abandoned_after_Assigning_Agents',
                            'Contact_Unanswered - No_RingBack_Tone',
                            'Talked - Hang_up_by_Agent',
                            'Talked - Hang_up_by_Contact',
                            'Talked - Hang_up_by_System'
                        ],
                        'Call Disposition': [
                            'NO_ANSWER_FROM_THE_USER',
                            'DROPPED_BY_CUSTOMER',
                            'RPC-PROMISED_TO_PAY',
                            'TP-CUSTOMER_NOT_THERE_AT_TIME_OF_CALL',
                            'TP-ANSWERING_MACHINE_DETECTED',
                            'RPC-REQUEST_FOR_CALLBACK',
                            'TP-FAILED_PID_PROCESS',
                            'RPC-REFUSED_TO_PAY',
                            'FRAUD_UNAUTHORIZED_TRANSACTION',
                            'RPC-CALL_ENDED_PREMATURELY',
                            'NO_ANSWER_FROM_THE_USER_480',
                            'RPC-PAYMENT_PROCESS_ERROR-CAN’T_PAY',
                            'SCH-TP-Wrong_Number',
                            'BUSY_TONE'
                        ],
                        'Actions': [
                            'Financially_Tight',
                            'Client_forgot_to_settle',
                            'Client_is_sick',
                            'Waiting_for_Salary',
                            'Delayed_Source_of_Income',
                            'Deceased_Family_Member',
                            'Family_Member_Health_Issues',
                            'Fraud',
                            'Unemployed',
                            'Calamity_Victim',
                            'Business_Down',
                            'Forgot_to_get_Reason_for_Delay',
                            'Accident',
                            'Maya_Application_Error',
                            'Prioritize_other_Bills_(Utilities, Credit Card, Mortgage etc)',
                            'Client_under_Medication',
                            'Maya_Blocked_Account',
                            'Claiming_Paid',
                            'Client_Out_of_the_Country',
                            'No_Intention_of_Paying',
                            'EMERGENCY_EXPENSES',
                            'CONFUSED_ON_LOAN_TERMS',
                            'REFUSED_TO_PROVIDE_REASON',
                            'LACK_OF_FUNDS',
                            'DISPUTE_CLAIM',
                            'ASSUMED_THAT_BILL-END_DATE_IS_DUE_DATE',
                            'CREDIT_TAB_STATES_THAT_I_COULD_PAY_ANY_AMOUNT',
                            'CONFUSED_DUE_TO_APP_DESIGN_(PAY_PARTIALLY)'
                        ],
                        'Group Name': ['1-30 DPD'],
                    };

                    if (selectColumns[header]) {
                        const select = document.createElement('select');
                        select.classList.add('dropdown-select');

                        selectColumns[header].forEach(optionText => {
                            const option = document.createElement('option');
                            option.value = optionText;
                            option.textContent = optionText;
                            if (optionText === value) option.selected = true;
                            select.appendChild(option);
                        });

                        select.addEventListener('change', async () => {
                            const newValue = select.value;
                            td.style.backgroundColor = '#ffd966';

                            try {
                                const res = await fetch(`http://${HOST}:${PORT}/AgentUsers/hardphoneUpdate`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        AgentName,
                                        Hardphone,
                                        column: header,
                                        value: newValue,
                                        originalRow: row
                                    })
                                });

                                const result = await res.json();
                                if (!result.success) {
                                    alert(`❌ Update failed: ${result.message}`);
                                    select.value = row[header];
                                    td.style.backgroundColor = '#f8d7da';
                                } else {
                                    row[header] = newValue;
                                    td.style.backgroundColor = '#d4edda';
                                }
                            } catch (err) {
                                console.error(err);
                                alert('⚠️ Server/network error during update.');
                                select.value = row[header];
                                td.style.backgroundColor = '#f8d7da';
                            }

                            setTimeout(() => {
                                td.style.backgroundColor = '';
                            }, 1500);
                        });

                        td.innerHTML = '';
                        td.appendChild(select);
                    } else {
                        td.contentEditable = true;

                        const updateCell = async () => {
                            const newValue = td.textContent.trim();
                            if (newValue === String(row[header]).trim()) return;

                            td.style.backgroundColor = '#ffd966';
                            try {
                                const res = await fetch(`http://${HOST}:${PORT}/AgentUsers/hardphoneUpdate`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        AgentName,
                                        Hardphone,
                                        column: header,
                                        value: newValue,
                                        originalRow: row
                                    })
                                });

                                const result = await res.json();
                                if (!result.success) {
                                    alert(`❌ Update failed: ${result.message}`);
                                    td.textContent = row[header];
                                    td.style.backgroundColor = '#f8d7da';
                                } else {
                                    row[header] = newValue;
                                    td.style.backgroundColor = '#d4edda';
                                }
                            } catch (err) {
                                console.error(err);
                                alert('⚠️ Server/network error during update.');
                                td.textContent = row[header];
                                td.style.backgroundColor = '#f8d7da';
                            }

                            setTimeout(() => {
                                td.style.backgroundColor = '';
                            }, 1500);
                        };

                        td.addEventListener('blur', updateCell);
                        td.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                td.blur();
                            }
                        });
                    }
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        paginationControls.innerHTML = `
            <button id="prevBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button id="nextBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        document.getElementById('prevBtn').onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderTablePage(currentPage);
                renderPaginationControls();
            }
        };

        document.getElementById('nextBtn').onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTablePage(currentPage);
                renderPaginationControls();
            }
        };
    }

    searchInput.addEventListener('input', (e) => {
        filterData(e.target.value);
    });
});
