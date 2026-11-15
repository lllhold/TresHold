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
    if (navbarToggler && navbarResponsive) {
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
    }

    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    const responseFrame = document.querySelector('#contactResponseFrame');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const status = document.querySelector('#contactFormStatus');
    let sending = false;
    let timeoutId;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (sending) return;
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        sending = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';
        status.className = 'contact-form-status is-loading';
        status.textContent = 'Enviando tu consulta…';

        const finish = function (success) {
            clearTimeout(timeoutId);
            if (success) {
                contactForm.reset();
                status.className = 'contact-form-status is-success';
                status.textContent = 'Mensaje enviado correctamente';
            } else {
                status.className = 'contact-form-status is-error';
                status.textContent = 'No se pudo enviar el mensaje';
            }
            sending = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar consulta';
        };

        responseFrame.onload = function () {
            finish(true);
        };
        responseFrame.onerror = function () {
            finish(false);
        };
        timeoutId = window.setTimeout(function () {
            finish(false);
        }, 15000);

        contactForm.submit();
    });
});
