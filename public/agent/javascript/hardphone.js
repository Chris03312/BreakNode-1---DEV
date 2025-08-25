document.addEventListener('DOMContentLoaded', () => {
    const Campaign = sessionStorage.getItem('Campaign');
    const AgentName = sessionStorage.getItem('Name');

    let Hardphone = '';
    if (Campaign === 'MEC 1 - 30') Hardphone = 'MEC HARDPHONE 1 - 30';
    else if (Campaign === 'MEC 61 AND UP') Hardphone = 'MEC HARDPHONE 61 AND UP';
    else if (Campaign === 'MEC 121 AND UP') Hardphone = 'MEC HARDPHONE 121 AND UP';
    else if (Campaign === 'MPL 1 - 30') Hardphone = 'MPL HARDPHONE 1 - 30';
    else if (Campaign === '61 AND UP') Hardphone = 'MPL HARDPHONE 91 AND UP';

    const HOST = 'localhost'; // Change if needed
    const PORT = 5000;

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

    endorsementData();

    async function endorsementData() {
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
                    container.innerHTML = `<p style="color: red;">No assigned fast call.</p>`;
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

            headers.forEach(header => {
                const td = document.createElement('td');
                let value = row[header] ?? '';

                if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                    value = value.split('T')[0];
                }

                td.textContent = value;

                if (editableColumns.includes(header)) {
                    td.contentEditable = true;
                    td.classList.add('editable-cell');

                    const updateCell = async () => {
                        const newValue = td.textContent.trim();
                        if (newValue === String(row[header]).trim()) return; // No change

                        td.style.backgroundColor = '#ffd966'; // yellow during update

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
                                td.textContent = row[header]; // revert
                                td.style.backgroundColor = '#f8d7da'; // red
                            } else {
                                console.log(`✅ ${header} updated to "${newValue}"`);
                                row[header] = newValue; // live update in memory
                                td.style.backgroundColor = '#d4edda'; // green
                            }
                        } catch (err) {
                            console.error(err);
                            alert('⚠️ Server/network error during update.');
                            td.textContent = row[header];
                            td.style.backgroundColor = '#f8d7da'; // red
                        }

                        setTimeout(() => {
                            td.style.backgroundColor = ''; // reset
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
