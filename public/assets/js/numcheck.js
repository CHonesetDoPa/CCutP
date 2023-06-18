const input = document.getElementById('content');
const counter = document.getElementById('counter');

input.addEventListener('input', function () {
    const textLength = input.value.length;
    const maxLength = input.getAttribute('maxlength');
    counter.innerText = `${textLength}/${maxLength}`;
});
