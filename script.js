let input = document.querySelector(".inputbox");
let addBtn = document.querySelector(".add-btn");
let list = document.querySelector(".todo-list");
let clear = document.querySelector(".clear");

const arrayHandler = {
    get: function(target, property) {
        console.log("get")
        renderList(target);
        return target[property];
    },
    set: function(target, property, value) {
        target[property] = value;
        console.log("catch the change");
        renderList(target);
        return true;
    },
}

let allList = [];
let allListProxy = new Proxy(allList, arrayHandler);

const addTodo = (e) => {
    e.preventDefault();
    let itemContent = input.value.trim();
    input.value = "";
    let newTodo = {
        id: allListProxy.length,
        text: itemContent,
        completed: false,
    }
    if (itemContent.length !== 0) {
        allListProxy.push(newTodo);
    }
}

function editContent(id) {
    const span = document.getElementById("text-" + id);
    const oldText = span.innerHTML;
    span.innerHTML = "";
    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput-" + id);
    span.appendChild(editInput);
    editInput.focus();
    editInput.onblur = function() {
        if (editInput.value.length) {
            const originalItem = allListProxy[id];
            allListProxy[id] = {
                id: originalItem.id,
                text: editInput.value.trim(),
                completed: originalItem.completed,
            }
        } else {
            span.innerHTML = oldText;
        }
    }
}

const toggleTodo = (id) => {
    const originalItem = allListProxy[id];
    allListProxy[id] = {
        id: originalItem.id,
        text: originalItem.text,
        completed: !originalItem.completed,
    }
}

const clearAll = () => {
    allListProxy.length = 0;
}

const removeTodo = (id) => {
    console.log(`del ${allListProxy[id].text}`);
    allListProxy.splice(id, 1);
    for (let i = 0; i < allListProxy.length; i++) {
        const originalItem = allListProxy[i];
        allListProxy[i] = {
            id: i,
            text: originalItem.text,
            completed: originalItem.completed,
        }
    }
}

const renderList = (data) => {
    var listHtml = '';
    data.forEach((item) => {
        let checkedOrNot = item.completed ? "checked" : "";
        let checkedStyle = item.completed ? 'class="finished"' : '';
        listHtml +=
            `<li ${checkedStyle}>
            <input type="checkbox" onclick="toggleTodo(${item.id})" ${checkedOrNot}> 
            <span onclick="editContent(${item.id})" id="text-${item.id}"> ${item.text} </span>
            <button onclick="removeTodo(${item.id})" class="del">✖️</button>
            </li>`;
    })
    list.innerHTML = listHtml;
}

addBtn.addEventListener('click', addTodo);
clear.addEventListener('click', clearAll);