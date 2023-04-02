let pageOneContainer;
let pageTwoContainer;
let skills;
let imgContainer;
let niceToMeetYouText;

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onscroll = function () {
    if (window.screen.width < 800) {
        return;
    };
    let num = window.scrollY + window.innerHeight - (pageTwoContainer.offsetTop + pageTwoContainer.offsetTop / 10)
    num = (num / 1000) * 2;
    skills.forEach(skill => skill.style.opacity = num > 1 ? '1' : `${num}`);
}

// window.addEventListener('resize', () => {
//     // max-width of img is 445px
//     if (+window.screen.width * 0.37 >= 445) return;
//     imgContainer.style.width = `${+window.screen.width * 0.37}px`;
//     if (window.screen.width > 600)
//         niceToMeetYouText.style.marginTop = `${0.006 * +window.screen.width}rem`;
//     else
//         niceToMeetYouText.style.marginTop = `0`;
// })

window.onload = function () {
    pageOneContainer = document.querySelector('.page-one-container');
    imgContainer = pageOneContainer.querySelector('.img-container');
    niceToMeetYouText = pageOneContainer.querySelector('h1:first-of-type');
    const line = pageOneContainer.querySelector('.line');
    const dot = pageOneContainer.querySelector('.dot');
    
    if (window.screen.width > 600)
        niceToMeetYouText.style.marginTop = `${0.006 * +window.screen.width}rem`;
    else
        niceToMeetYouText.style.marginTop = `0`;

    line.addEventListener('animationend', () => {
        dot.style.display = 'inline-flex';
    })
    const contactMeButton = document.querySelectorAll('.contact');
    pageTwoContainer = document.querySelector('.page-two-container');
    skills = pageTwoContainer.querySelectorAll('.skill');
    
    if (window.screen.width > 800) {
        skills.forEach(skill => skill.style.opacity = '0');
    };

    const pageFourBackgroundContainer = document.querySelector('.page-four-background-container');
    contactMeButton.forEach(button => button.addEventListener('click', () => pageFourBackgroundContainer.scrollIntoView({ behavior: "smooth" })));

    const scrollToTop = document.querySelector('.scroll-to-top');
    scrollToTop.addEventListener('click', () => window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    }));

    const form = document.querySelector('form');
    const nameInput = form.querySelector('.name-container > input');
    const emailInput = form.querySelector('.email-container > input');
    const messageInput = form.querySelector('.message-container > textarea');
    [nameInput, emailInput, messageInput].forEach(input => input.addEventListener('invalid', (e) => e.preventDefault()));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInputValid = validateField(nameInput, 'name', true);
        const emailInputValid = validateField(emailInput, 'email', true);
        const messageInputValid = validateField(messageInput, 'message', true);

        // display toast
        const toast = document.querySelector('.toast-success');
        toast.style.display = 'block';
        toast.addEventListener('animationend', () => {
            toast.style.display = 'none';
        })
        toast.style.animation = 'fade 2s ease';
        
        if (nameInputValid && emailInputValid && messageInputValid) {
            console.log('hit da endpoint');
        }
    })
}

function validateField(field, fieldName, onSubmit = false) {
    const correctNameRegex = new RegExp('^[a-zA-Z ]+$');
    const correctEmailRegex = new RegExp('^[a-z.0-9]+@[a-z]+.[a-z]+$');
    const error = field.parentNode.querySelector('.error-text');
    let fieldValid = true;
    field.classList.remove('valid-border');
    field.classList.remove('error-border');
    if (field.value.length === 0) {
        field.classList.add('error-border');
        error.textContent = 'Please fill in the field';
        fieldValid = false;
    }
    else if (fieldName === 'name' && !correctNameRegex.test(field.value)) {
        field.style.borderBottom = '2px solid $red';
        field.classList.add('error-border');
        fieldValid = false;
        error.textContent = 'Please enter only alphabets';
    } else if (fieldName === 'email' && !correctEmailRegex.test(field.value)) {
        field.classList.add('error-border');
        error.textContent = 'Please enter in correct format';
        fieldValid = false;
    } else {
        field.classList.add('valid-border');
        error.textContent = '';
    }

    if (onSubmit) {
        return fieldValid;
    }
}