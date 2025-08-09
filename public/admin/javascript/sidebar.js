fetch('/admin/sidebar/sidebar.html')
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

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const userId = sessionStorage.getItem('UserId');
        const name = sessionStorage.getItem('Name');

        console.log("Stored UserId:", userId);
        console.log("Stored Name:", name);

        const nameElement = document.getElementById('AgentName');
        if (nameElement) {
            nameElement.innerText = name || "No Name Found";
        } else {
            console.warn("AgentName element not found in DOM");
        }
    }, 100); // wait 100ms for sidebar to load
});