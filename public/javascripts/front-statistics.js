import {graph, aside} from "./front-dom.js";

const statisticsDiv = document.createElement("div");
statisticsDiv.classList.add("statistics-div")

const firstStatisticsContent = document.createElement("p");
firstStatisticsContent.classList.add("first-stat");

const secondStatisticsContent = document.createElement("p");
secondStatisticsContent.classList.add("second-stat");

const thirdStatisticsContent = document.createElement("p");
thirdStatisticsContent.classList.add("third-stat");

export const daysToDeadline = (now, deadline) => {
    return -parseInt((now - deadline)/1000/60/60/24);
};

export const statistics = (array) => {

    let expiredTasks = 0;
    let doneTasks = 0;
    let todoTasks = 0;

    const allTasks = array.length;


    const countingExpired = (task) => {
        const now = new Date();
        const deadlineInfo = daysToDeadline(now, task.deadline);
        if (deadlineInfo < 0 && task.completed === false){
            expiredTasks++;
        }
        thirdStatisticsContent.innerText = `Przeterminowane: ${expiredTasks}`;
    }

    const countingDone = (task) => {
        if(task.completed){
            doneTasks++;
        }
        firstStatisticsContent.innerText = `Zakończone: ${doneTasks}`;
    };

    const countingTodo = (task) => {
            if(task.completed === false) {
                todoTasks++;
            }
        secondStatisticsContent.innerText = `Pozostało do zrobienia: ${todoTasks}`;
    };
        const countingGraph = () => {
            if(allTasks === 0){
                graph.style.background = `conic-gradient(#06113C 0deg 360deg, #FF8C32 0deg 0deg)`;
                thirdStatisticsContent.innerText = `Przeterminowane: 0`;
                firstStatisticsContent.innerText = `Zakończone: 0`;
                secondStatisticsContent.innerText = `Pozostało do zrobienia: 0`;
            } else {
                const toDoPercent = (todoTasks / allTasks) * 100 * 3.6;
                const DonePercent = (360 - toDoPercent);
                graph.style.background = `conic-gradient(#06113C 0deg ${DonePercent}deg, #FF8C32 0deg ${toDoPercent}deg)`;
            }
        };

    array.forEach(countingExpired);
    array.forEach(countingDone);
    array.forEach(countingTodo);
    countingGraph();
};


aside.appendChild(statisticsDiv);
statisticsDiv.appendChild(firstStatisticsContent);
statisticsDiv.appendChild(secondStatisticsContent);
statisticsDiv.appendChild(thirdStatisticsContent);

fetch('/todo/list').then((res) => {
    return res.json();
}).then((data) => statistics(data)).catch(e => alert("Wystąpił błąd. Spróbuj ponownie później."));