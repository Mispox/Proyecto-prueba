document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formError = document.getElementById('form-error');

    contactForm.addEventListener('submit', function(event) {
      
        event.preventDefault();
        
       
        formError.textContent = '';
        formError.style.display = 'none';

     
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        //  validación mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let errors = [];

        // Validación checks
        if (name === '') {
            errors.push('El campo de nombre es obligatorio.');
        }
        if (email === '') {
            errors.push('El campo de correo electrónico es obligatorio.');
        } else if (!emailRegex.test(email)) {
            errors.push('Por favor, introduce un correo electrónico válido.');
        }
        if (message === '') {
            errors.push('El campo de mensaje es obligatorio.');
        }

        // Por si hay errores
        if (errors.length > 0) {
            formError.textContent = errors.join(' ');
            formError.style.display = 'block';
        } else {
            this.form.submit();
        }
    });

});
