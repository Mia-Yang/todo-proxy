const saveDataToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getDataFromLocalStorage = (key) => {
    if (localStorage.getItem(key) !== null) {
        allList = JSON.parse(localStorage.getItem(key));
    } else {
        allList = [];
    }
    return allList;
}

const removeDataFromLocalStorage = (key) => {
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
            <span id="text-${item.id}"  onfocus="editContent(${item.id})" class="single-line" contenteditable > ${item.text} </span>
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
        removeDataFromLocalStorage("allList");
        saveDataToLocalStorage("allList", target)
        renderList(getDataFromLocalStorage("allList"));
        return true;
    },
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
    const textSpan = document.getElementById("text-" + id);
    const originalText = textSpan.innerText;
    textSpan.addEventListener('blur', function() {
        const newText = textSpan.innerText
        if (newText.trim().length) {
            const index = getIndex(allListProxy, id);
            const originalItem = allListProxy[index];
            allListProxy[index] = {
                ...originalItem,
                text: newText.trim(),
            }
        } else {
            textSpan.innerText = originalText;
        }
    })
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

window.addEventListener("load", renderList(getDataFromLocalStorage("allList")));