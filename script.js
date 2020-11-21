let input = document.querySelector(".inputbox");
let addBtn = document.querySelector(".add-btn");
let list = document.querySelector(".todo-list");
let clear = document.querySelector(".clear");

let allList = [];

const addTodo = (e) => {
    e.preventDefault();
    let itemContent = input.value.trim();
    input.value = "";
    let newTodo = {
        id: allList.length,
        text: itemContent,
        completed: false,
    }
    if (itemContent.length !== 0) {
        allList.push(newTodo);
        renderList(allList);
        // 监听数据
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
            allList[id].text = editInput.value.trim();
            renderList(allList);
            // 监听数据
        } else {
            span.innerHTML = oldText;
        }
    }
}

const toggleTodo = (id) => {
    allList[id].completed = !allList[id].completed;
    renderList(allList);
    // 监听数据
}

const clearAll = () => {
    allList = [];
    renderList(allList);
    // 监听数据
}

const removeTodo = (id) => {
    allList.splice(id, 1);
    allList.forEach((item, index) => {
        item.id = index;
    })
    renderList(allList);
    // 监听数据
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