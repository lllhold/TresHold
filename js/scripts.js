// Scripts - Navegación y formulario de contacto

window.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. MENÚ DE NAVEGACIÓN
    // ==========================================

    const navbarCollapsible = document.body.querySelector('#mainNav');

    const navbarShrink = function () {
        if (!navbarCollapsible) return;

        navbarCollapsible.classList.toggle(
            'navbar-shrink',
            window.scrollY !== 0
        );
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navbarResponsive = document.body.querySelector('#navbarResponsive');

    if (navbarToggler && navbarResponsive) {

        navbarToggler.addEventListener('click', function () {
            const isOpen = navbarResponsive.classList.toggle('show');

            navbarToggler.setAttribute(
                'aria-expanded',
                String(isOpen)
            );
        });

        document.querySelectorAll('#navbarResponsive .nav-link')
            .forEach(function (item) {

                item.addEventListener('click', function () {

                    if (
                        window.getComputedStyle(navbarToggler).display !== 'none' &&
                        navbarResponsive.classList.contains('show')
                    ) {
                        navbarToggler.click();
                    }

                });

            });
    }

    // ==========================================
    // 2. FORMULARIO DE CONTACTO
    // ==========================================

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyK-XpvcSEXEf1csb-j6cgaWtRJn0tXP9ZUgIppwzm2Hp9tDRSppV5vj8EO3f2OFlv-Qw/exec';

    const contactForm = document.querySelector('#contactForm');
    const contactSubmit = document.querySelector('#contactSubmit');

    if (!contactForm) return;

    // Evitar envíos duplicados
    let enviando = false;

    // Mensaje de estado
    const estado = document.createElement('div');

    estado.id = 'contactStatus';
    estado.setAttribute('role', 'status');
    estado.setAttribute('aria-live', 'polite');
    estado.style.marginTop = '15px';

    contactForm.appendChild(estado);

    // Evitar que el botón envíe dos veces
    if (contactSubmit) {
        contactSubmit.setAttribute('type', 'submit');
    }

    contactForm.addEventListener('submit', async function (event) {

        event.preventDefault();

        if (enviando) return;

        // Validar formulario
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Comprobar configuración
        if (SCRIPT_URL.includes('PEGA_AQUI')) {
            estado.textContent = 'Error: falta configurar Google Apps Script.';
            estado.style.color = 'red';
            return;
        }

        enviando = true;

        const textoOriginal = contactSubmit
            ? contactSubmit.textContent
            : '';

        if (contactSubmit) {
            contactSubmit.disabled = true;
            contactSubmit.textContent = 'Enviando...';
        }

        estado.textContent = 'Enviando mensaje...';
        estado.style.color = '#555';

        try {

            const datos = new FormData(contactForm);

            // Enviar los datos al servidor
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: datos
            });

            // IMPORTANTE:
            // no-cors no permite comprobar la respuesta del servidor.
            // Llegar aquí NO confirma que Gmail haya enviado el mensaje.

            estado.textContent =
                'Solicitud enviada. No se ha podido confirmar la entrega del correo.';

            estado.style.color = '#856404';

            // No borrar los datos hasta confirmar la entrega.

        } catch (error) {

            console.error('Error de conexión:', error);

            estado.textContent =
                'No se pudo completar la solicitud. Inténtalo de nuevo.';

            estado.style.color = 'red';

        } finally {

            enviando = false;

            if (contactSubmit) {
                contactSubmit.disabled = false;
                contactSubmit.textContent = textoOriginal;
            }

        }

    });

});
