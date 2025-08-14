window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const agents = params.get('agents'); // MEC or MPL

    const boxes = document.querySelectorAll('.email-grid > div');
    const titles = document.querySelectorAll('.title');

    if (agents === 'MPL') {
        // Show first 2 boxes, hide third
        boxes.forEach((box, index) => {
            box.style.display = index < 2 ? 'flex' : 'none';
        });

        // Set titles for MPL
        if (titles[0]) titles[0].textContent = 'MPL 1 - 30';
        if (titles[1]) titles[1].textContent = 'MPL 91';
        if (titles[2]) titles[2].textContent = ''; // optional clear hidden box title
    } else if (agents === 'MEC') {
        // Show all 3 boxes
        boxes.forEach(box => {
            box.style.display = 'flex';
        });

        // Set titles for MEC
        if (titles[0]) titles[0].textContent = 'MEC 1 - 30';
        if (titles[1]) titles[1].textContent = 'MEC 61';
        if (titles[2]) titles[2].textContent = 'MEC 121';
    } else {
        // Default: show all boxes, clear titles
        boxes.forEach(box => box.style.display = 'flex');
        titles.forEach(title => title.textContent = '');
    }
});
