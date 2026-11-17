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
    const contactHoneypot = document.querySelector('#website');
    const contactLimits = { nombre: 100, email: 254, obra: 150, mensaje: 5000 };
    Object.keys(contactLimits).forEach(function (fieldName) {
        const field = contactForm && contactForm.elements[fieldName];
        if (field) field.maxLength = contactLimits[fieldName];
    });
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

            if (contactHoneypot && contactHoneypot.value.trim() !== '') {
                contactStatus.className = 'contact-form-status is-error';
                contactStatus.textContent = 'No se ha podido procesar la consulta.';
                return;
            }

            contactSending = true;
            contactSubmit.disabled = true;
            contactStatus.className = 'contact-form-status is-loading';
            contactStatus.textContent = 'Enviando consulta…';

            try {
                // Apps Script no expone una respuesta CORS utilizable desde GitHub Pages.
                // La petición se envía, pero su resultado no permite confirmar la entrega.
                await fetch(appsScriptUrl, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    mode: 'no-cors'
                });

                contactStatus.className = 'contact-form-status is-error';
                contactStatus.textContent = 'La consulta se ha enviado, pero no se puede verificar la entrega desde esta página. Conservamos los datos por seguridad.';
            } catch (error) {
                console.error('No se pudo enviar la consulta:', error);
                contactStatus.className = 'contact-form-status is-error';
                contactStatus.textContent = 'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
            } finally {
                contactSending = false;
                contactSubmit.disabled = false;
            }
        });
    }
});
