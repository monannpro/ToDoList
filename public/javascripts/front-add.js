import {form, task, deadline} from "./front-dom.js";
import {statistics} from "./front-statistics.js";
import {loadTaskListFromLS, fetchTaskListAndSaveToLS, showList} from "./front-list.js";

form.addEventListener('submit', async event => {
    event.preventDefault();

    const newTask = task.value;
    const newTaskDeadline = deadline.valueAsDate;

    await fetch('/todo/add', {
        method: 'POST',
        body: JSON.stringify({
            newTask,
            newTaskDeadline,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    await fetchTaskListAndSaveToLS();
    showList(loadTaskListFromLS());
    statistics(loadTaskListFromLS());
    task.value = "";
    deadline.value = "";
});
