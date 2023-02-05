window.onload = function () {
    const email = document.querySelector('input');
    const error = document.querySelector('.error');
    const form = document.querySelector('form');

    let errorActive = false;

    email.addEventListener('input', () => {
        removeError();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (email.validity.valueMissing) {
            showError('Whoops! It looks like you forgot to add your email')
        } else if (email.validity.typeMismatch) {
            showError('Please provide a valid email address')
        } else if (email.validity.valid) {
            removeError();
        }
    });

    function showError(content) {
        email.classList.add('error-active');
        error.style.display = 'block';
        error.textContent = content;
    }

    function removeError() {
        error.style.display = 'none';
        email.classList.remove('error-active');
    }

}