const username = document.getElementById('usernameinput');
const password = document.getElementById('passwordinput');
const warning = document.getElementById('warning');
const passwordhelper = document.getElementById('passwordHelp');

async function login() {
    if (username.value === '' || password.value === '') {
        warning.style.display = 'block';
        return false;
    } else {

        const response = await fetch('https://nwetodo-restapi.herokuapp.com/api/user/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": username.value, "password": password.value })
        });
        const result = await response.json();
        if(!result['sucess']){
            warning.style.display = 'block'
            return false;
        }else{
            document.cookie = "token=" + result['token'] + "; expires=Thu, 18 Dec 2021 12:00:00 UTC";
            window.location = './profile.html';
        }
    }
}


