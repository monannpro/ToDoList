const express = require('express');
const {writeFile, readFile} = require('fs').promises;

const deleteRouter = express.Router();

deleteRouter

    .post('/delete', async (req, res, next) => {
        try {
            const {deletedTaskId} = req.body;
            const data = await readFile('./data/list.json', 'utf8');
            const list = JSON.parse(data)

            const searchDeletedTask = (task) => task.id !== deletedTaskId;

            list.forEach(searchDeletedTask);

            const currentList = list.filter(searchDeletedTask);
            console.log(currentList);

            await writeFile('./data/list.json', JSON.stringify(currentList, null, 2), 'utf8');

            res.end();
        } catch(err) {
            next(err);
        }
    });

module.exports = {
    deleteRouter,
};