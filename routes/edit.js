const express = require('express');
const {writeFile, readFile} = require('fs').promises;

const editRouter = express.Router();

editRouter

    .post('/edit', async (req, res) => {
        try {
            const {editedTask, editedTaskDeadline, editedTaskId, editedTaskCompleted} = req.body;
            const data = await readFile('./data/list.json', 'utf8');
            const list = JSON.parse(data)

            const searchEditedTask = (task) => {
                if(task.id === editedTaskId) {
                    task.content = editedTask;
                    task.deadline = +(new Date(editedTaskDeadline));
                    task.completed = editedTaskCompleted;
                } else {
                    console.log("not found");
                }
            };

            list.forEach(searchEditedTask);

            await writeFile('./data/list.json', JSON.stringify(list, null, 2), 'utf8');

            res.end();
        } catch(err) {
            console.error(`Coś poszło nie tak.. Spróbuj ponownie później. ${err}`);
        }
    });






module.exports = {
    editRouter,
};