var username = document.getElementById('username');
var email = document.getElementById('email');
var todos = document.getElementsByClassName('todos')[0];

function getToken() {
    var token = "token" + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(token) == 0) {
        return c.substring(token.length, c.length);
      }
    }
    return "";
}

async function getTodos(){
    const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', 'Authorization': getToken()},
    });
    const result = await response.json();
    for(var i = 0; i < result['todos'].length; i++){
        todos.innerText = result['todos'][i].title;
    }
}

async function addTodo(){

}

async function deleteTodo(){

}

async function editTodo(){

}


async function getProfile(){
    const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', 'Authorization': getToken()},
    });
    const result = await response.json();
    username.innerText = result['user']['username'];
    email.innerText = result['user']['email'];
    console.log(result)
    getTodos();
}

async function editProfile(){

}

async function logout(){
    window.location = './login.html';
}