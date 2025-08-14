const UserId = sessionStorage.getItem('UserId');

if (!UserId) {
    window.location.href = '/';
}
