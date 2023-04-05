import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
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

const timer = ms => new Promise(res => setTimeout(res, ms))

window.onload = async function () {

    // Your web app's Firebase configuration
    const firebaseConfig = {
    };

    // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);
    // const messages = collection(db, 'messages');
    // const user = await getDocs(messages);

    pageOneContainer = document.querySelector('.page-one-container');
    imgContainer = pageOneContainer.querySelector('.img-container');
    niceToMeetYouText = pageOneContainer.querySelector('h1:first-of-type');
    const navbarText = document.querySelector('nav>p:first-of-type');
    const IamText = pageOneContainer.querySelectorAll('h1')[1];
    const name = pageOneContainer.querySelector('.name');
    const smallDescriptionText = pageOneContainer.querySelector('p:first-of-type');
    async function scrambleLetters(correctOrder, currentText, element, time, underline = false, wordRotationCount = 3) {
        const perInterationWidth = Math.ceil(element.clientWidth / correctOrder.length);
        let currentWidth = 0;
        for (let i = 0; i < correctOrder.length; i++) {
            let j = 0;
            while (j < wordRotationCount) {
                const index = Math.floor(Math.random() * 100) % correctOrder.length;
                currentText = currentText.substring(0, i) + correctOrder[index] + currentText.substring(i + 1);
                element.textContent = currentText;
                await timer(time);
                j++;
            }
            currentText = currentText.substring(0, i) + correctOrder[i] + currentText.substring(i + 1);
            element.textContent = currentText;
            if (underline) {
                currentWidth += perInterationWidth;
                if (currentWidth > element.clientWidth) {
                    currentWidth = element.clientWidth;
                }
                nameLine.style.width = `${currentWidth}px`;
            }
        }
    }
    const nameLine = pageOneContainer.querySelector('.name');
    scrambleLetters('parthmanhas', navbarText.textContent, navbarText, 25);
    scrambleLetters('Nice to meet you!', niceToMeetYouText.textContent, niceToMeetYouText, 15);
    scrambleLetters('I am Parth Manhas.', IamText.textContent, IamText, 15, true);
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInputValid = validateField(nameInput, 'name', true);
        const emailInputValid = validateField(emailInput, 'email', true);
        const messageInputValid = validateField(messageInput, 'message', true);

        const formValid = nameInputValid && emailInputValid && messageInputValid;
        const docData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        }
        let dataSentSuccess = true;
        if (nameInputValid && emailInputValid && messageInputValid) {
            try {
                await setDoc(doc(db, 'messages', docData.email), docData);
            } catch (e) {
                dataSentSuccess = false;
            }

            const toastSuccess = document.querySelector('.toast-success');
            const toastError = document.querySelector('.toast-error');
            dataSentSuccess ? displayToast(toastSuccess, dataSentSuccess) : displayToast(toastError, dataSentSuccess);
        }

        // display toast
        function displayToast(toast, dataSentSuccess) {
            const lineDiv = document.createElement('div');
            if (dataSentSuccess) {
                toast.textContent = 'Message Sent Successfully!';
                lineDiv.classList.add('line');
            } else {
                toast.textContent = 'Error Sending Message!';
                lineDiv.classList.add('error-line');
            }
            if ((!toast.style.display || toast.style.display === 'none')) {
                toast.style.animation = '';
                toast.style.display = 'block';
                toast.appendChild(lineDiv);
                setTimeout(() => {
                    toast.style.animation = 'fade 1s linear';
                    const animationEndCleanup = () => {
                        toast.style.display = 'none';
                        toast.style.animation = '';
                        toast.removeEventListener('animationend', animationEndCleanup);
                    }
                    toast.addEventListener('animationend', animationEndCleanup);
                }, 1000);
            }
        }
    })
}

