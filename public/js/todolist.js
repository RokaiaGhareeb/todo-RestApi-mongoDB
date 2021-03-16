let todolists;

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
  
  let title = document.createElement("div");
  title.innerText = todolist.title;
  title.className = "card-title todoTitle fs-4";
  title.id = 'T' + todolist._id;
  cardBody.appendChild(title);
  
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
  card.appendChild(cardBody);
  todolists.prepend(card);
}

function createListItem(listItems, Items){
  listItems.forEach(element => {
    let item = document.createElement('div');
    item.className = "item"
    item.id = element._id;

    let itemTitle = document.createElement('div');
    itemTitle.innerText = element.title;
    itemTitle.style.width = '70%';
    itemTitle.id = 'it'+ element._id;

    let itemTick = document.createElement('div');
    itemTick.innerHTML = '<i class="fa fa-check" style = "color:green;cursor: pointer;"></i>';
    itemTick.id = 'itck'+ element._id;


    let itemDel = document.createElement("div");
    itemDel.innerHTML = '<i class="fa fa-trash" onclick="deleteListItem(this)" aria-hidden="true"  style="color:rgb(237, 237, 237);cursor: pointer;"></i>';
    itemDel.className = 'm-2 fs-5';
    itemDel.id = 'idl'+ element._id;


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

async function addItemToList(e){
  const listid = e.parentNode.parentNode.previousElementSibling.id;
  console.log(listid);
  const inpt = document.getElementById('inp' + listid);
  if(inpt.value === "") return false;

  const response = await fetch("https://nwetodo-restapi.herokuapp.com/api/todolist/item/" + listid, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json", Authorization: getToken() },
      body: JSON.stringify({"title" : inpt.value, "done": false})
  });
  const result = await response.json();
  console.log(result);
}

// function appendToItems(listid){
//   let Items = document.getElementById(listid);

//   let item = document.createElement('div');
//   item.className = "item"
//   item.id = element._id;

//   let itemTitle = document.createElement('div');
//   itemTitle.innerText = element.title;
//   itemTitle.style.width = '70%';
//   itemTitle.id = 'it'+ element._id;

//   let itemTick = document.createElement('div');
//   itemTick.innerHTML = '<i class="fa fa-check" style = "color:green;cursor: pointer;"></i>';
//   itemTick.id = 'itck'+ element._id;


//   let itemDel = document.createElement("div");
//   itemDel.innerHTML = '<i class="fa fa-trash" onclick="deleteListItem(this)" aria-hidden="true"  style="color:rgb(237, 237, 237);cursor: pointer;"></i>';
//   itemDel.className = 'm-2 fs-5';
//   itemDel.id = 'idl'+ element._id;


//   item.appendChild(itemTitle);
//   item.appendChild(itemTick);
//   item.appendChild(itemDel);
//   Items.appendChild(item);
// }