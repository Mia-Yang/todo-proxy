const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getData = (key) => {
    if (localStorage.getItem(key) !== null) {
        allList = JSON.parse(localStorage.getItem(key));
    } else {
        allList = [];
    }
    return allList;
}

const removeData = (key) => {
    localStorage.removeItem(key);
}

let todoList = document.querySelector(".todo-list");
const renderList = (data) => {
    let listHtml = '';
    data.forEach((item) => {
        let isChecked = item.completed ? "checked" : "";
        let checkedStyle = item.completed ? 'class="finished"' : '';
        listHtml +=
            `<li ${checkedStyle}>
            <input type="checkbox" onclick="toggleTodo(${item.id})" ${isChecked}> 
            <span onclick="editContent(${item.id})" id="text-${item.id}"> ${item.text} </span>
            <button onclick="removeTodo(${item.id})" class="del">✖️</button>
            </li>`;
    })
    todoList.innerHTML = listHtml;
}

const arrayHandler = {
    get: function(target, property) {
        return target[property];
    },
    set: function(target, property, value) {
        console.log(property, "---------")
        console.log(value);
        target[property] = value;
        removeData("allList");
        saveData("allList", target)
        renderList(getData("allList"));
        return true;
    },

    // deleteProperty: function(target, property) {
    //     delete target[property];
    //     return true;
    // }
}

let allList = [];
let allListProxy = new Proxy(allList, arrayHandler);

let input = document.querySelector(".inputbox");

const addTodo = (e) => {
    e.preventDefault();
    let itemContent = input.value.trim();
    input.value = "";
    let newTodo = {
        id: Date.now(),
        text: itemContent,
        completed: false,
    }
    if (itemContent.length !== 0) {
        allListProxy.push(newTodo);
    }
}

function getIndex(arr, value) {
    return arr.findIndex(item => item.id === value);
}

function editContent(id) {
    const textContainer = document.getElementById("text-" + id);
    const oldText = textContainer.innerHTML;
    textContainer.innerHTML = "";
    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput-" + id);
    textContainer.appendChild(editInput);
    editInput.focus();
    editInput.onblur = function() {
        if (editInput.value.length) {
            const index = getIndex(allListProxy, id);
            const originalItem = allListProxy[index];
            allListProxy[index] = {
                ...originalItem,
                text: editInput.value.trim(),
            }
        } else {
            textContainer.innerHTML = oldText;
        }
    }
}

const toggleTodo = (id) => {
    const index = getIndex(allListProxy, id);
    const originalItem = allListProxy[index];
    allListProxy[index] = {
        ...originalItem,
        completed: !originalItem.completed,
    }
}

const clearAll = () => {
    allListProxy.length = 0;
}

const removeTodo = (id) => {
    const index = getIndex(allListProxy, id);
    allListProxy.splice(index, 1);
    // delete allListProxy[index];
}

let addBtn = document.querySelector(".add-btn");
addBtn.addEventListener('click', addTodo);

let clear = document.querySelector(".clear");
clear.addEventListener('click', clearAll);

window.addEventListener("load", renderList(getData("allList")));