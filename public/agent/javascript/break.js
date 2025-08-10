function timeclock() {
    const clock = document.getElementById('timeclock');
    const now = new Date();

    // Format time as HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const formattedTime =
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')} ${ampm}`;

    clock.textContent = formattedTime;
}

// Update clock every second
setInterval(timeclock, 1000);

// Initialize immediately
timeclock();
