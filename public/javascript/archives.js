const { HOST, PORT } = Config;

async function loadArchiveFolders() {
    try {
        const res = await fetch(`http://${Config.HOST}:${Config.PORT}/Archive/archiveDatas`);
        const data = await res.json();

        const container = document.getElementById('archiveList');
        container.innerHTML = '';

        if (data.success && data.dates.length > 0) {
            data.dates.forEach(date => {
                const div = document.createElement('div');
                div.className = 'date-folder';

                const icon = document.createElement('span');
                icon.className = 'folder-icon';
                icon.textContent = '📁';

                const label = document.createElement('span');
                label.textContent = new Date(date).toDateString();

                div.appendChild(icon);
                div.appendChild(label);

                div.onclick = () => loadRecordsByDate(date);
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<p>No archive dates found.</p>';
        }
    } catch (error) {
        console.error('Error fetching archive data:', error);
        document.getElementById('archiveList').innerHTML = '<p>Error loading archives.</p>';
    }
}

async function loadRecordsByDate(date) {
    const res = await fetch(`http://${HOST}:${PORT}/Archive/archiveRecordsByDate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
    });

    const data = await res.json();
    console.log('Response from server:', data);

    const modal = document.getElementById('archiveModal');
    const title = document.getElementById('selectedDateTitle');
    const tbody = document.getElementById('recordBody');
    const thead = document.getElementById('recordHead');

    const pstDate = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    const formattedDate =
        pstDate.getFullYear() + '-' +
        String(pstDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(pstDate.getDate()).padStart(2, '0');

    title.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 6px;">
            📋 Archived Records for ${pstDate.toDateString()}
            <button id="downloadArchiveBtn" style="
                border: none;
                background: none;
                cursor: pointer;
                font-size: 14px;
                color: #333;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            ">
                <img src="../assets/download-icon.png" alt="Download" style="width: 16px; height: 16px;">
                <span>Download</span>
            </button>
        </span>
    `;

    document.getElementById('downloadArchiveBtn').addEventListener('click', async () => {
        const res = await fetch(`http://${HOST}:${PORT}/Archive/downloadArchive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: formattedDate })
        });
        console.log(formattedDate);
        if (!res.ok) {
            alert('No file found for this date.');
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `archive_${formattedDate}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    thead.innerHTML = `
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Campaign</th>
          <th>Date</th>
          <th>Break Type</th>
          <th>Break Out</th>
          <th>Break In</th>
          <th>Time Difference</th>
          <th>Remarks</th>
        </tr>
    `;

    tbody.innerHTML = '';

    if (data.success && data.records.length > 0) {
        data.records.forEach(r => {
            const row = `<tr>
                <td>${r.userId}</td>
                <td>${r.name}</td>
                <td>${r.campaign}</td>
                <td>${new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</td>
                <td>${r.breakType}</td>
                <td>${r.breakOut}</td>
                <td>${r.breakIn}</td>
                <td>${r.timeDifference}</td>
                <td>${r.remarks}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="9">No records found for this date.</td></tr>';
    }
    modal.style.display = 'block';
}

function closeArchiveModal() {
    const modal = document.getElementById('archiveModal');
    modal.style.display = 'none';
}

loadArchiveFolders();