import {form, list, task, deadline} from "./front-dom.js";
import {statistics} from "./front-statistics.js";
import {saveTaskListToLS, showList} from "./front-list.js";

form.addEventListener('submit', async event => {
    event.preventDefault();

    const newTask = task.value;
    const newTaskDeadline = deadline.valueAsDate;

    const res = await fetch('/todo/add', {
        method: 'POST',
        body: JSON.stringify({
            newTask,
            newTaskDeadline,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch('/todo/list').then((res) => {
        return res.json();
    }).then((data) => {
        saveTaskListToLS(data);
        showList(data);
        statistics(data);
    }).catch(e => alert("Wystąpił błąd. Spróbuj ponownie później."));
});
