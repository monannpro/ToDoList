import {main, toDoList, list} from "./front-dom.js";
import {statistics} from "./front-statistics.js";
import {filters} from "./front-category.js";


const taskListKey = "MP#taskList";

export const loadTaskListFromLS = () => {
    return JSON.parse(localStorage.getItem(taskListKey) ?? "[]");
};

export const saveTaskListToLS = () => {
    return fetch('/todo/list').then((res) => {
        return res.json();
    }).then((data) => {


        localStorage.setItem(taskListKey, JSON.stringify(data));

        return data;
    }).catch(() => alert("Wystąpił błąd. Spróbuj ponownie później."));
};

await saveTaskListToLS();

main.appendChild(toDoList);
toDoList.appendChild(list);

const saveTask = async (editedTask, editedTaskDeadline, editedTaskId, editedTaskCompleted) => {

    await fetch('/todo/edit', {
        method: 'POST',
        body: JSON.stringify({
            editedTask,
            editedTaskDeadline,
            editedTaskId,
            editedTaskCompleted,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    await saveTaskListToLS();
    showList(loadTaskListFromLS());
    statistics(loadTaskListFromLS());
};

const showListRow = (task) => {

    const listLi = document.createElement("li");
    listLi.classList.add("list-li");
    listLi.addEventListener('click', () => {
        list.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        listLi.classList.add("active");
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener('change', async () => {

        await saveTask(task.content, task.deadline, task.id, checkbox.checked);
    });

    const content = document.createElement("span");
    content.innerText = task.content;
    content.classList.add("task-content");
    content.title = task.content;

    const btnDel = document.createElement("button");
    btnDel.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    btnDel.classList.add("btn-del");
    btnDel.addEventListener('click', async (event) => {
        event.preventDefault();
        if (confirm('Czy na pewno chcesz usunąć zadanie?')) {
            const deletedTaskId = task.id;



            await fetch('/todo/delete', {
                method: 'POST',
                body: JSON.stringify({
                    deletedTaskId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await saveTaskListToLS();
            showList(loadTaskListFromLS());
        }
        statistics(loadTaskListFromLS());
    });

    const btnEdit = document.createElement("button");
    btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    btnEdit.classList.add("btn-edit");

    btnEdit.addEventListener('click', async () => {

        btnDel.classList.add("hidden");
        btnEdit.classList.add("hidden");
        content.innerText = "";
        content.classList.add("hidden");

        const editForm = document.createElement("form");
        editForm.classList.add("edit-form");

        const editInput = document.createElement("input");
        editInput.classList.add("edit-input");
        editInput.type = "text";
        editInput.size = 40;
        editInput.id = task.id;
        editInput.placeholder = task.content;

        const editDeadline = document.createElement("input");
        editDeadline.classList.add("edit-input");
        editDeadline.type = "date";

        const btnEditSubmit = document.createElement("button");
        btnEditSubmit.classList.add("btn-edit-submit");
        btnEditSubmit.type = "submit";
        btnEditSubmit.innerText = "Edytuj";

        editForm.addEventListener('submit', async event => {
            event.preventDefault();
            const editedTask = editInput.value;
            const editedTaskDeadline = editDeadline.valueAsDate;
            const editedTaskId = task.id;
            const editedTaskCompleted = checkbox.checked;

           await saveTask(editedTask, editedTaskDeadline, editedTaskId, editedTaskCompleted);

        });

        listLi.appendChild(editForm);
        editForm.appendChild(editInput);
        editForm.appendChild(editDeadline);
        editForm.appendChild(btnEditSubmit);
    });


    const deadlineIcon = document.createElement("button");
    deadlineIcon.classList.add("deadline-icon");
    deadlineIcon.innerHTML = '<i class="fa-regular fa-clock"></i>';

    const deadline = document.createElement("span");
    deadline.classList.add("task-deadline");
    const now = new Date();
    const deadlineInfo = -parseInt(`${(now - task.deadline) / 1000 / 60 / 60 / 24}`);
    if (deadlineInfo === 0) {
        deadline.innerText = "do jutra!";
    } else {
        deadline.innerText = `${deadlineInfo} dni`;
    }

    if (deadlineInfo < 0) {
        listLi.setAttribute("id", "expired");
        deadlineIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }


    listLi.appendChild(checkbox);
    listLi.appendChild(content);
    listLi.appendChild(btnDel);
    listLi.appendChild(btnEdit);
    listLi.appendChild(deadline);
    listLi.appendChild(deadlineIcon);
    list.appendChild(listLi);
};

export const showList = (array) => {
    let tasks = array;
    const filterName = new URLSearchParams(location.search).get("filter");
    if(filterName){
        tasks = filters.filter[filterName]();
    }
    list.innerHTML = '';
    if (tasks.length === 0) {
        const info = document.createElement("h1");
        info.innerText = "Brak zadań do wyświetlenia.";
        list.appendChild(info);
    } else {
       tasks.forEach(showListRow);
    }

};

showList(loadTaskListFromLS());



