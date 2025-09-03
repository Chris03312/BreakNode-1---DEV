document.addEventListener('DOMContentLoaded', () => {
    const Campaign = sessionStorage.getItem('Campaign');
    console.log('Campaign from sessionStorage:', Campaign);

    const container = document.getElementById('table-container');
    const paginationControls = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('search-input');

    let currentPage = 1;
    const pageSize = 500;
    let fullData = [];
    let filteredData = [];

    if (container) {
        container.innerHTML = `
        <div id="loading-spinner">
            <div class="spinner"></div>
            <span>Loading data, please wait...</span>
        </div>
        `;
    }
    endorsementData();

    async function endorsementData() {
        try {
            const res = await fetch(`http://${HOST}:${PORT}/AgentUsers/endorsementData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Campaign })
            });

            const data = await res.json();
            const endoTitle = document.getElementById('endoTitle');
            console.log("Fetched data:", data);

            if (data.success) {
                fullData = data.data;
                filteredData = fullData;
                renderTablePage(currentPage);
                renderPaginationControls();
                endoTitle.innerText = `📁 Endorsement Source: ${data.endorsementStatus}`;
            } else {
                container.innerHTML = `<p style="color: red;">${data.message}</p>`;
            }

        } catch (error) {
            console.error('Error loading endorsement data:', error);
            container.innerHTML = `<p style="color: red;">Server error.</p>`;
        }
    }

    // New: Search filtering function
    function filterData(searchTerm) {
        if (!searchTerm) {
            filteredData = fullData;
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            filteredData = fullData.filter(row => {
                // Check if any cell contains the search term (case-insensitive)
                return Object.values(row).some(val =>
                    String(val).toLowerCase().includes(lowerTerm)
                );
            });
        }
        currentPage = 1; // reset to first page on new search
        renderTablePage(currentPage);
        renderPaginationControls();
    }

    function renderTablePage(page) {
        const start = (page - 1) * pageSize;
        const end = page * pageSize;
        const pageData = filteredData.slice(start, end); // use filteredData here
        renderTable(pageData);
    }

    function renderTable(data) {
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="no-data-message">
                    <p>No data found.</p>
                </div>
            `;
            return;
        }

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

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const tr = document.createElement('tr');

            headers.forEach(header => {
                const td = document.createElement('td');
                let cell = row[header] ?? '';

                // Format ISO date
                if (typeof cell === 'string' && cell.match(/^\d{4}-\d{2}-\d{2}T/)) {
                    cell = cell.split('T')[0];
                }

                td.textContent = cell;
                tr.appendChild(td);
            });

            fragment.appendChild(tr);
        }

        tbody.appendChild(fragment);
        table.appendChild(thead);
        table.appendChild(tbody);

        container.innerHTML = '';
        container.appendChild(table);
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(filteredData.length / pageSize); // use filteredData here
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

    // Hook up search input event
    searchInput.addEventListener('input', (e) => {
        filterData(e.target.value);
    });
});
