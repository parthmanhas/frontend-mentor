const ratingDisplay = document.querySelector('.how-did-we-do');
const thankyou = document.querySelector('.thankyou');

const form = document.querySelector('form');
const submit = form.querySelector('button');

document.getElementsByName('rating').forEach(item => {
    console.log(item)
    item.onclick = function() {
        submit.removeAttribute('disabled');
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const stars = form.rating.value;
    document.querySelector('.stars-selected-text').textContent = `You Selected ${stars} out of 5`;
    ratingDisplay.classList.add('hidden');
    thankyou.classList.remove('hidden');
})