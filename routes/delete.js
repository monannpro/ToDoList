const express = require('express');
const {writeFile, readFile} = require('fs').promises;

const deleteRouter = express.Router();

deleteRouter

    .post('/delete', async (req, res) => {
        try {
            const {deletedTaskId} = req.body;
            const data = await readFile('./data/list.json', 'utf8');
            const list = JSON.parse(data)

            const searchDeletedTask = (task) => {
                if(task.id === deletedTaskId) {
                    return false;
                } else {
                    return true;
                }
            };

            list.forEach(searchDeletedTask);
            const currentList = list.filter(searchDeletedTask);
            console.log(currentList);

            await writeFile('./data/list.json', JSON.stringify(currentList, null, 2), 'utf8');

            res.end();
        } catch(err) {
            console.error(`Coś poszło nie tak.. Spróbuj ponownie później. ${err}`);
        }
    });






module.exports = {
    deleteRouter,
};