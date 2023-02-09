const express = require('express');
const {writeFile, readFile} = require('fs').promises;

const addRouter = express.Router();

addRouter

    .post('/add', async (req, res, next) => {
        try {
                const {newTask, newTaskDeadline} = req.body;
                const nowTimestamp = +(new Date());
                const creationDate = nowTimestamp;
                const id = nowTimestamp;
                const data = await readFile('./data/list.json', 'utf8');
                const list = JSON.parse(data)
                list.push({
                        "content": newTask,
                        "deadline": +(new Date(newTaskDeadline)),
                        creationDate,
                        "id": id,
                        "completed": false
                });
                await writeFile('./data/list.json', JSON.stringify(list, null, 2), 'utf8');
                console.debug(list);
                res.end();
        } catch(err) {
                next(err);
        }
    });

module.exports = {
    addRouter,
};