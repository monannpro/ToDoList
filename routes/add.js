const express = require('express');
const {writeFile, readFile} = require('fs').promises;

const addRouter = express.Router();

addRouter

    .post('/add', async (req, res) => {
        try {
                const {newTask, newTaskDeadline} = req.body;
                const creationDate = +(new Date());
                const id = +(new Date());
                const data = await readFile('./data/list.json', 'utf8');
                const list = JSON.parse(data)
                list.push({
                        "content": newTask,
                        "deadline": +(new Date(newTaskDeadline)),
                        "creationDate": creationDate,
                        "id": id,
                        "completed": false
                });
                await writeFile('./data/list.json', JSON.stringify(list, null, 2), 'utf8');
                console.log(list);
                res.end();
        } catch(err) {
                console.error("Coś poszło nie tak.. Spróbuj ponownie później.");
        }
    });






module.exports = {
    addRouter,
};