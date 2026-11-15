// Scripts

window.addEventListener('DOMContentLoaded', function () {
    const navbarCollapsible = document.body.querySelector('#mainNav');
    const navbarShrink = function () {
        if (!navbarCollapsible) return;
        navbarCollapsible.classList.toggle('navbar-shrink', window.scrollY !== 0);
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navbarResponsive = document.body.querySelector('#navbarResponsive');
    if (!navbarToggler || !navbarResponsive) return;

    navbarToggler.addEventListener('click', function () {
        const isOpen = navbarResponsive.classList.toggle('show');
        navbarToggler.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('#navbarResponsive .nav-link').forEach(function (item) {
        item.addEventListener('click', function () {
            if (window.getComputedStyle(navbarToggler).display !== 'none' && navbarResponsive.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});
