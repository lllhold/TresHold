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
    const contactSubmit = document.querySelector('#contactSubmit');
    const contactStatus = document.querySelector('#contactStatus');
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyK-XpvcSEXEf1csb-j6cgaWtRJn0tXP9ZUgIppwzm2Hp9tDRSppV5vj8EO3f2OFlv-Qw/exec';
    let contactSending = false;

    if (contactForm && contactSubmit && contactStatus) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            if (contactSending) return;

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            contactSending = true;
            contactSubmit.disabled = true;
            contactStatus.className = 'contact-form-status is-loading';
            contactStatus.textContent = 'Enviando consulta…';

            try {
                const response = await fetch(appsScriptUrl, {
                    method: 'POST',
                    body: new FormData(contactForm)
                });

                if (!response.ok) {
                    throw new Error('El servidor respondió con un error.');
                }

                contactStatus.className = 'contact-form-status is-success';
                contactStatus.textContent = 'Consulta enviada correctamente.';
                contactForm.reset();
            } catch (error) {
                console.error('No se pudo enviar la consulta:', error);
                contactStatus.className = 'contact-form-status is-error';
                contactStatus.textContent = 'No se pudo confirmar el envío. Revisa tu conexión e inténtalo de nuevo.';
            } finally {
                contactSending = false;
                contactSubmit.disabled = false;
            }
        });
    }
});
