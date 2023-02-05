
window.onload = function () {
    const email = document.querySelector('.email > input');
    const firstName = document.querySelector('.first-name > input');
    const lastName = document.querySelector('.last-name > input');
    const password = document.querySelector('.password > input');

    const form = document.querySelector('form');

    const elements = [email, firstName, lastName, password];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        elements.forEach(element => {
            if (!element.validity.valid) {
                showError(element);
            }
        })
    })

    firstName.addEventListener('input', () => {
        if (firstName.validity.valueMissing || firstName.validity.badInput || firstName.validity.patternMismatch) {
            showError(firstName);
        } else {
            removeError(firstName);
        }
    })

    lastName.addEventListener('input', () => {
        if (lastName.validity.valueMissing || lastName.validity.badInput || lastName.validity.patternMismatch) {
            showError(lastName);
        } else {
            removeError(lastName);
        }
    })

    email.addEventListener('input', () => {
        if (email.validity.valueMissing || email.validity.badInput || !email.validity.valid || email.validity.typeMismatch) {
            showError(email);
        } else {
            removeError(email);
        }
    })

    password.addEventListener('input', () => {
        if (password.validity.valueMissing || password.validity.badInput || !password.validity.valid) {
            showError(password);
        } else {
            removeError(password);
        }
    })

    function showError(element) {
        element.classList.add('error-active');
        const error = element.parentElement.querySelector('.error');
        error.style.display = 'flex';
        const errorImg = element.parentElement.querySelector('.form__input > img');
        errorImg.style.display = 'block';

        if (element.validity.valueMissing) {
            error.textContent = 'Field Cannot be empty';
        } else if (element.validity.patternMismatch || element.validity.typeMismatch) {
            error.textContent = 'Looks like this is not correct';
        } else if (element.validity.valid) {
            error.textContent = 'Looks like this is not correct';
        }


    }

    function removeError(element) {
        element.classList.remove('error-active');
        const error = element.parentElement.querySelector('.error');
        error.style.display = 'none';
        const errorImg = element.parentElement.querySelector('.form__input > img');
        errorImg.style.display = 'none';
    }
}