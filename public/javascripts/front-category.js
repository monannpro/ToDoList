import {filterBtns, btnToDo, btnDone, btnAll, title, expiredDiv, expiredCheckbox} from "./front-dom.js";
import {loadTaskListFromLS, showList} from "./front-list.js";
import {daysToDeadline} from "./front-statistics.js";

const deactivateBtns = () => {
    filterBtns.forEach(btn => btn.classList.remove("active"));
    expiredCheckbox.checked = false;
};

export const filters = {
    filter: {
        TODO: () => {
            title.innerText = "Zadania do zrobienia";
            deactivateBtns();
            btnToDo.classList.add("active");
            expiredDiv.classList.remove("hidden");
            return filterTaskList((task) => !task.completed);
        },
        DONE: () => {
            title.innerText = "Zadania zakończone";
            deactivateBtns();
            btnDone.classList.add("active");
            expiredDiv.classList.add("hidden");
            return filterTaskList((task) => task.completed);
        },
        ALL: () => {
            title.innerText = "Wszystkie zadania";
            deactivateBtns();
            btnAll.classList.add("active");

            expiredDiv.classList.add("hidden");
            return filterTaskList(() => true);
        },
        TODO_EXPIRED: () => {
            const now = new Date();
            return filterTaskList((task) => {
                return !task.completed && (!expiredCheckbox.checked || daysToDeadline(now, task.deadline)<0);
            });
        },
    }
}

const filterOnClick = (filterName) => {
    return () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("filter", filterName);
        history.replaceState({}, null, `?${searchParams.toString()}`);
        showList(filters.filter[filterName]());
    };
};

btnToDo.addEventListener('click', filterOnClick("TODO"));

btnDone.addEventListener('click', filterOnClick("DONE"));

btnAll.addEventListener('click', filterOnClick("ALL"));

expiredCheckbox.addEventListener('change', () => {
    if(expiredCheckbox.checked) {
        filterOnClick("TODO_EXPIRED")();
    } else {
        filterOnClick("TODO")();
    }
});

const filterTaskList = (taskFilter) => {
    return loadTaskListFromLS().filter(taskFilter);
};


//1. do kazdego btn + checkbox.eventListener dodac parametr w url
//2. addeventlistenery wywołują showList.
//2. w showList czytam parametry z url.
    //a. jeśli jest parametr to filtruje - filterTaskList
    //b. jesli nie ma parametru showList (pełna lista) ;