var username = document.getElementById('username');
var email = document.getElementById('email');
var todos = document.getElementsByClassName('todos')[0];
var todoTitle = document.getElementById('todoTitle');
var todoDesc = document.getElementById('todoDesc');
// var todoTag = document.getElementById('todoTag');
var todosts = document.getElementById('todorb');
var inprogresssts = document.getElementById('inprogressrb');
var titlewarning = document.getElementById('titlewarning');
var descwarning = document.getElementById('descwarning');
// var addTodoModal = document.getElementById('exampleModal');
var addTodoModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
  keyboard: false
})

function getToken() {
  var token = "token" + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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

async function getTodos() {
  const response = await fetch('http://localhost:3000/api/user/profile', {
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', 'Authorization': getToken() },
  });
  const result = await response.json();
  // for(var i = 0; i < result['todos'].length; i++){
  //     todos.innerText = result['todos'][i].title;
  // }
}

async function addTodo() {
  var status;
  if (todoTitle.value === '' || todoTitle.value.length > 20 || todoTitle.value.length < 10) {
    titlewarning.style.display = 'block';
    return false;
  }
  else {
    titlewarning.style.display = 'none';
  }
  if (todoDesc.value === '' || todoDesc.value.length > 500 || todoTitle.value.length < 10) {
    descwarning.style.display = 'block';
    return false;
  }
  else {
    descwarning.style.display = 'none';
  }
  if (inprogresssts.checked)
    status = inprogresssts.value;
  else if (todosts.checked)
    status = todosts.value
  const response = await fetch('http://localhost:3000/api/todo', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', 'Authorization': getToken() },
    body: JSON.stringify({ "title": todoTitle.value, "body": todoDesc.value, "status": status })
  });
  const result = await response.json();
  console.log(result);
  addTodoModal.hide();
  todoTitle.value = todoDesc.value = '';
}

async function deleteTodo() {

}

async function editTodo() {

}


async function getProfile() {
  const response = await fetch('http://localhost:3000/api/user/profile', {
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', 'Authorization': getToken() },
  });
  const result = await response.json();
  username.innerText = result['user']['username'];
  email.innerText = result['user']['email'];
  console.log(result)
  getTodos();
}

async function editProfile() {

}

async function logout() {
  window.location = './login.html';
}