let username = document.getElementById("username");
let email = document.getElementById("email");
let usernameEdit = document.getElementById('usernameEdit');
let emailEdit = document.getElementById('emailEdit');
let usernameEditwarning = document.getElementById('usernameEditwarning');
let emailEditwarning = document.getElementById('emailEditwarning');
let EditProfileModal = new bootstrap.Modal(
  document.getElementById("exampleModal2"),
  {
    keyboard: false,
  }
);


function getToken() {
  var token = "token" + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(token) == 0) {
      return c.substring(token.length, c.length);
    }
  }
  return "";
}

async function getProfile() {

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/user/profile", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  username.innerText = result["user"]["username"];
  email.innerText = result["user"]["email"];
  usernameEdit.value = result["user"]["username"];
  emailEdit.value = result["user"]["email"];
}

async function editProfile() {
  if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailEdit.value))) {
    emailEditwarning.style.display = 'block'
    return false;
  } else {
    emailEditwarning.style.display = 'none'
    const user = { "username": usernameEdit.value, "email": emailEdit.value }
    const response = await fetch('https://nwetodo-restapi.herokuapp.com/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: getToken() },
      body: JSON.stringify(user)
    });
    const result = await response.json();
    console.log(result['username']);
    username.innerText = result['username'];
    email.innerText = result['email'];
    EditProfileModal.hide();
  }
}

async function logout() {
  window.location = "./login.html";
}



