fetch('/agent/sidebar/sidebar.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Sidebar failed to load.');
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('sidebar').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading sidebar:', error);
    });
