var server = "http://localhost:5000/";

function getCompletedTodos() {
  var result = null
  $.ajax({
    type: "GET",
    url: server + "todo/completed",  // endpoint to get all completed todo
    async: false,
    success: function (data) {
      result = data;
    }
  });

  return result;
}

function getIncompleteTodos() {
  var result = null
  $.ajax({
    type: "GET",
    url: server + "todo/incomplete",  // endpoint to get all incompleted todo
    async: false,
    success: function (data) {
      result = data;
    }
  });

  return result;
}

var data = { todo: getIncompleteTodos() || [], completed: getCompletedTodos() || [] };

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

renderTodoList();

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function () {
  var value = document.getElementById('item').value;
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

function addItem(value) {
  var id = addItemToBackend(value);
  addItemToDOM(id, value, false);
  document.getElementById('item').value = '';

  // data.todo.push(value);
  data.todo[value] = false;
}

function addItemToBackend(value) {
  var result = null;
  payload = { 'title': value };
  console.log(payload);
  $.ajax({
    type: "POST",
    url: server + "add",    // endpoint to add todo
    data: payload,
    async: false,
    success: function (data) {
      result = data;        // TODO: return last added id
    }
  });
  return result.id;
}

function renderTodoList() {
  if (Object.keys(data.todo).length === 0 && Object.keys(data.completed).length === 0) {
    return;
  }

  for (const [key, value] of Object.entries(data.todo)) {
    addItemToDOM("", key, value);
  }

  for (const [key, value] of Object.entries(data.completed)) {
    addItemToDOM("", key, value);
  }
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var typeId = parent.id;
  var value = item.innerText;
  var itemID = item.id;

  if (typeId === 'todo') {
    delete data.todo[value]
  } else {
    delete data.completed[value]
  }

  parent.removeChild(item);
  removeItemInBackend(itemID, value);
}

function removeItemInBackend(id, value) {
  $.ajax({
    url: server + "delete/" + value, // TODO: change value to id
    type: 'DELETE',
    async: false,
    success: function (data) {
      console.log(data);
    }
  });
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var typeId = parent.id;
  var value = item.innerText;
  var itemID = item.id;

  if (typeId === 'todo') {
    delete data.todo[value]
    data.completed[value] = true
    updateBackendItem(itemID, value, true);
  } else {
    delete data.completed[value]
    data.todo[value] = false
    updateBackendItem(itemID, value, false);
  }

  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (typeId === 'todo') ? document.getElementById('completed') : document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

function updateBackendItem(id, value, status) {
  payload = { 'status': status };
  $.ajax({
    url: server + "update/" + value, // TODO: change value to id
    type: 'PUT',
    data: payload,
    async: false,
    success: function (data) {
      console.log(data);
    }
  });
}

// Adds a new item to the todo list
function addItemToDOM(id, text, completed) {
  var list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

  var item = document.createElement('li');
  item.innerText = text;
  item.id = id;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}
