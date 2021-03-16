let todolists;
let todoListTitle = document.getElementById('todoListTitle');
let warning = document.getElementById('titlewarning');
let addTodoListModal = new bootstrap.Modal(
  document.getElementById("exampleModal"),
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

function createListCard(todolist) {
  let card = document.createElement("div");
  card.className = "card shadow cursor-pointer  m-4 bg-transparent rounded-3";

  let cardBody = document.createElement("div");
  cardBody.className = "card-body todolist rounded-3";

  let cardHeader = document.createElement("div");
  cardHeader.className = "cardHeader";
  let title = document.createElement("div");
  title.innerText = todolist.title;
  title.className = "card-title todoTitle fs-4";
  title.id = 'T' + todolist._id;
  
  let delBtn = document.createElement('div');
  delBtn.innerHTML = '<i class="fa fa-trash" onclick="deleteList(this)" aria-hidden="true"  style="color:rgb(237, 237, 237);cursor: pointer;"></i>';
  delBtn.className = 'm-2 fs-5';
  
  
  cardHeader.appendChild(title);
  cardHeader.appendChild(delBtn);

  cardBody.appendChild(cardHeader);

  let Items = document.createElement('div');
  Items.id = todolist._id;

  createListItem(todolist.listItems, Items);

  cardBody.appendChild(Items);

  let addItemInpt = document.createElement("input");
  addItemInpt.className = "form-control";
  addItemInpt.id = 'inp' + todolist._id;

  let addItemBtn = document.createElement("div");
  addItemBtn.innerHTML = '<i class="fa fa-plus" onclick= "addItemToList(this)" aria-hidden="true" style="color:rgb(237, 237, 237);cursor: pointer;"></i>';
  addItemBtn.className = 'm-2 fs-5';

  let addContainer = document.createElement('div');
  addContainer.className = "addContainer";
  addContainer.appendChild(addItemInpt);
  addContainer.appendChild(addItemBtn);

  cardBody.appendChild(addContainer);
  let date = document.createElement("div");
    const d = new Date(todolist.createdAt);
    date.innerText = d.toDateString();
    date.className = "card-color date fs-6 text-center";
    cardBody.appendChild(date);

  card.appendChild(cardBody);
  todolists.prepend(card);
}

function createListItem(listItems, Items) {
  listItems.forEach(element => {
    let item = document.createElement('div');
    item.className = "item"
    item.id = element._id;

    let itemTitle = document.createElement('div');
    itemTitle.innerText = element.title;
    itemTitle.style.width = '70%';
    itemTitle.id = 'it' + element._id;
    if (element.done)
      itemTitle.className = "itemTicked"

    let itemTick = document.createElement('div');
    itemTick.innerHTML = '<i class="fa fa-check" onclick="tick(this)" style = "color:green;cursor: pointer;"></i>';
    itemTick.id = 'itck' + element._id;


    let itemDel = document.createElement("div");
    itemDel.innerHTML = '<i class="fa fa-trash" onclick="deleteListItem(this)" aria-hidden="true"  style="color:rgb(237, 237, 237);cursor: pointer;"></i>';
    itemDel.className = 'm-2 fs-5';
    itemDel.id = 'idl' + element._id;


    item.appendChild(itemTitle);
    item.appendChild(itemTick);
    item.appendChild(itemDel);
    Items.appendChild(item);
  });
}

async function getTodoLists() {
  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  console.log(result);
  if (todolists) {
    document.getElementsByClassName('todos')[0].replaceWith(todolist);
    return;
  }
  document.getElementsByClassName('todos')[0].innerText = "";
  todolists = document.getElementsByClassName('todos')[0];
  result.forEach((todolist) => {
    createListCard(todolist);
  });
}

async function deleteListItem(e) {
  const itemid = e.parentNode.parentNode.id;
  const listid = e.parentNode.parentNode.parentNode.id;
  console.log(itemid);
  console.log(listid);

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/item/" + listid + "/" + itemid, {
    method: "DELETE",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  console.log(result);
  e.parentNode.parentNode.remove();
}

async function addItemToList(e) {
  const listid = e.parentNode.parentNode.previousElementSibling.id;
  console.log(listid);
  const inpt = document.getElementById('inp' + listid);
  console.log(inpt.value);
  if (inpt.value === "") return false;

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/item/" + listid, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
    body: JSON.stringify({ "title": inpt.value, "done": false }),
  });
  const result = await response.json();
  console.log(result);
  appendToItems(listid);
  inpt.value = "";
}

async function appendToItems(listid) {
  let Items = document.getElementById(listid);
  Items.innerHTML = "";
  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/" + listid, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  console.log(result);
  let list = result[0]['listItems'];
  createListItem(list, Items);
}

async function tick(e) {
  const itemid = e.parentNode.parentNode.id;
  const listid = e.parentNode.parentNode.parentNode.id;
  console.log(itemid);
  console.log(listid);

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/changestatus/" + listid + "/" + itemid, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
    body: JSON.stringify({ "done": true }),
  });
  const result = await response.json();
  console.log(result);
  const title = document.getElementById('it' + itemid);
  title.className = "itemTicked";
}

async function addList() {
  if (
    todoListTitle.value === "" ||
    todoListTitle.value.length > 20 ||
    todoListTitle.value.length < 10
  ) {
    titlewarning.style.display = "block";
    return false;
  } else {
    titlewarning.style.display = "none";
  }

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
    body: JSON.stringify({
      title: todoListTitle.value,
    }),
  });
  const result = await response.json();
  console.log(result);
  addTodoListModal.hide();
  todoListTitle.value = "";
  createListCard(result);
}

async function deleteList(e){
  const listid = e.parentNode.parentNode.nextElementSibling.id;
  console.log(listid);

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/" + listid, {
    method: "DELETE",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  console.log(result);
  e.parentNode.parentNode.parentNode.remove();
}

async function filterByDate(){
  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/", {
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
    todolists = document.getElementsByClassName('todos')[0];
    filterdList.forEach((todolist) => {
      createListCard(todolist);
    });
  }else{
    document.getElementsByClassName('todos')[0].innerText = "No Match";
  }
}