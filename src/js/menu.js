// Clear the 'coverwise_form' cookie when the home page loads
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
    document.cookie = "coverwise_form=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const menuNav = document.querySelector('.menu-nav');
    if (menuBtn && menuNav) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuNav.classList.toggle('open');
        });
        document.addEventListener('click', function() {
            if (menuNav.classList.contains('open')) {
                menuNav.classList.remove('open');
            }
        });
        menuNav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});