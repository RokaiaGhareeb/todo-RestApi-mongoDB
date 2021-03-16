const username = document.getElementById('usernameinput');
const email = document.getElementById('emailinput');
const password = document.getElementById('passwordinput');
const usernamehelper = document.getElementById('usernameHelp');
const emailhelper = document.getElementById('emailHelp');
const warning = document.getElementById('warning');
const passwordhelper = document.getElementById('passwordHelp');
var regex = new Array();
var passed = 0;
regex.push("[0-9]"); //For Numeric Digits
regex.push("[a-z]"); //For Lowercase Alphabet

async function signup() {
    if (username.value === '' || email.value === '' || password.value === '') {
        warning.style.display = 'block';
        return false;
    } else {
        warning.style.display = 'none';
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value))) {
            emailhelper.style.display = 'block'
            return false;
        }else{
            emailhelper.style.display = 'none'
        }
        for (var i = 0; i < regex.length; i++) {
            if ((new RegExp(regex[i])).test(password.value)) {
                passed++;
            }
        }
        if (!(passed == 2 && password.value.length >= 8)) {
            passwordhelper.style.display = 'block';
            passed = 0;
            return false;
        }else{
            passwordhelper.style.display = 'none';
            const user = { "username": username.value, "email": email.value, "password": password.value }
            const response = await fetch('https://nwetodo-restapi.herokuapp.com/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const result1 = await response.json();
            console.log(result1)
            if (!result1['sucess']) {
                if (result1['err'].keyPattern.username) {
                    usernamehelper.style.display = 'block';
                    return false;
                }
            }
            else{
                const response = await fetch('https://nwetodo-restapi.herokuapp.com/api/user/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"username" : username.value,  "password": password.value})
            });
            const result2 = await response.json();
            document.cookie = "token="+ result2['token'] +"; expires=Thu, 18 Dec 2021 12:00:00 UTC";
                window.location = './todo.html'
            }
        }
    }
}
