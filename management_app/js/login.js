function showLoginForm() {
    document.getElementById('container_welcome').style.display = 'none';
    document.getElementById('container-login').style.display = 'block';
}

function checkUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Alexandra' && password === 'alexandra') {
        document.getElementById('success_msg').style.display = 'block';
        document.getElementById('error_msg').style.display = 'none';

        sessionStorage.setItem('userLogged', 'logged');
        window.location.replace('index.html');
    } else {
        document.getElementById('error_msg').style.display = 'block';
        document.getElementById('success_msg').style.display = 'none';
    }
}

function checkLoggedInUser() {
    const userLoggedIn = sessionStorage.getItem('userLogged');

    if (userLoggedIn === 'logged') {
        window.location.replace('index.html');
    }
}

let rmCheck = document.getElementById('remember_box');
let user = document.getElementById('username');

if (localStorage.checkbox && localStorage.checkbox !== '') {
    rmCheck.setAttribute('checked', 'checked');
    user.value = localStorage.user;
} else {
    rmCheck.removeAttribute('checked');
    user.value = '';
}

function rememberMe() {
    if (rmCheck.checked && user.value !== '') {
        localStorage.user = user.value;
        localStorage.checkbox = rmCheck.value;
    } else {
        localStorage.user = '';
        localStorage.checkbox = '';
    }
}
