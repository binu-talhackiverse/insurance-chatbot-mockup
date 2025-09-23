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