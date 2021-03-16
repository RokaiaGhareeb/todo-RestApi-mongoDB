let todos;
let todoTitle = document.getElementById("todoTitle");
let todoDesc = document.getElementById("todoDesc");
let todosts = document.getElementById("todorb");
let inprogresssts = document.getElementById("inprogressrb");
let titlewarning = document.getElementById("titlewarning");
let descwarning = document.getElementById("descwarning");
let addTodoModal = new bootstrap.Modal(
    document.getElementById("exampleModal"),
    {
        keyboard: false,
    }
);
let todoTitleEdit = document.getElementById('todoTitleEdit');
let todoDescEdit = document.getElementById('todoDescEdit');
let cardID;
let EditTodoModal = new bootstrap.Modal(
    document.getElementById("exampleModal3"),
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

function createCard(todo) {
    let card = document.createElement("div");
    card.className = "card shadow cursor-pointer  m-4 bg-transparent rounded-3";

    let cardBody = document.createElement("div");
    cardBody.className = "card-body todo rounded-3";

    let title = document.createElement("div");
    title.innerText = todo.title;
    title.className = "card-title todoTitle fs-4";
    title.id = 'T' + todo._id;
    let desc = document.createElement("div");
    desc.innerText = todo.body;
    desc.className = "card-color";
    desc.id = 'D' + todo._id;

    let date = document.createElement("div");
    const d = new Date(todo.createdAt);
    date.innerText = d.toDateString();
    date.className = "card-color date fs-6";

    let status = document.createElement("div");
    let stsClass;
    if (todo.status == "todo") {
        stsClass = "todosts";
        status.innerText = "To-Do";
    } else if (todo.status == "inprogress") {
        stsClass = "inprogress";
        status.innerText = "In-progress";
    } else if (todo.status == "done") {
        stsClass = "done";
        status.innerText = "Done";
    }
    status.className = "card-color " + stsClass;
    status.id = 'S' + todo._id;
    status.addEventListener('click', changeStatus);

    let edit = document.createElement("div");
    edit.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal3" onclick="initEditModal(this)"></i>';
    edit.className = 'm-2 fs-5';
    let del = document.createElement("div");
    del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"  onclick = "deleteTodo(this)"></i>';
    del.className = 'm-2 fs-5';

    let mbtns = document.createElement('div');
    mbtns.className = 'mbtns';
    mbtns.appendChild(edit);
    mbtns.appendChild(del);

    let footer = document.createElement("div");
    footer.className = "todo-footer";
    footer.appendChild(status);
    footer.appendChild(mbtns);
    footer.id = todo._id;

    cardBody.appendChild(title);
    cardBody.appendChild(desc);
    cardBody.appendChild(date);
    cardBody.appendChild(footer);
    card.appendChild(cardBody);
    todos.prepend(card);
}

async function getTodos() {
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/user/profile", {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
    });
    const result = await response.json();
    console.log(result["todos"]);
    if (todos) {
        document.getElementsByClassName('todos')[0].replaceWith(todos);
        return;
    }
    document.getElementsByClassName('todos')[0].innerText = "";
    todos = document.getElementsByClassName('todos')[0];
    result["todos"].forEach((todo) => {
        createCard(todo);
    });
}

async function filterTodos(filter) {
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo/filter/" + filter, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
    });
    const result = await response.json();
    console.log(result);
    if (result.length > 0) {
        todos = document.getElementsByClassName('todos')[0];
        todos.innerHTML = "";
        result.forEach((todo) => {
            createCard(todo);
        });
    } else {
        todos.innerText = "No card found!"
        todos = undefined;
    }
}

async function addTodo() {
    var status;
    if (
        todoTitle.value === "" ||
        todoTitle.value.length > 20 ||
        todoTitle.value.length < 10
    ) {
        titlewarning.style.display = "block";
        return false;
    } else {
        titlewarning.style.display = "none";
    }
    if (
        todoDesc.value === "" ||
        todoDesc.value.length > 500 ||
        todoTitle.value.length < 10
    ) {
        descwarning.style.display = "block";
        return false;
    } else {
        descwarning.style.display = "none";
    }
    if (inprogresssts.checked) status = inprogresssts.value;
    else if (todosts.checked) status = todosts.value;
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify({
            title: todoTitle.value,
            body: todoDesc.value,
            status: status,
        }),
    });
    const result = await response.json();
    console.log(result);
    addTodoModal.hide();
    todoTitle.value = todoDesc.value = "";
    createCard(result);
}

async function deleteTodo(e) {
    const id = e.parentNode.parentNode.parentNode.id;
    console.log(id)
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo/" + id, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
    });
    const result = await response.json();
    console.log(result);
    e.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
}

async function editTodo() {
    const editedTodo = { "title": todoTitleEdit.value, "body": todoDescEdit.value }
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo/edit/" + cardID, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify(editedTodo)
    });
    const result = await response.json();
    console.log(result);
    document.getElementById('T' + cardID).innerText = result["title"];
    document.getElementById('D' + cardID).innerText = result["body"];
    EditTodoModal.hide();

}

async function initEditModal(e) {
    cardID = e.parentNode.parentNode.parentNode.id;
    var selectedTodoTitle = document.getElementById('T' + cardID);
    var selectedTodoDesc = document.getElementById('D' + cardID);
    todoTitleEdit.value = selectedTodoTitle.innerText;
    todoDescEdit.value = selectedTodoDesc.innerText;
}

async function changeStatus(event) {
    var id = event.target.parentNode.id;
    console.log(id);
    var ele = event.target;
    var status;
    if (ele.innerText == "To-Do") {
        ele.innerText = "In-progress";
        ele.className = "card-color inprogress";
        status = "inprogress";
    } else if (ele.innerText == "In-progress") {
        ele.innerText = "Done";
        ele.className = "card-color done";
        status = "done";
    } else {
        ele.innerText = "To-Do";
        ele.className = "card-color todosts";
        status = "todo";
    }
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo/changestatus/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify({ "status": status })
    });
    const result = await response.json();
    console.log(result);
}

async function filterByDate(){
    const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todo/", {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json", Authorization: getToken() },
    });
    const result = await response.json();
    console.log(result);
    let filterdList = [];
    let day = document.getElementById('day');
    let month = document.getElementById('month');
    result.forEach(element => {
        const date = new Date(element.createdAt);
        if(date.getDate() == day.value && date.getMonth() + 1 == month.value){
          filterdList.push(element);
        }
      });
      if(filterdList.length > 0){
    
        document.getElementsByClassName('todos')[0].innerText = "";
        todos = document.getElementsByClassName('todos')[0];
        filterdList.forEach((todo) => {
          createCard(todo);
        });
      }else{
        document.getElementsByClassName('todos')[0].innerText = "No Match";
      }
  }