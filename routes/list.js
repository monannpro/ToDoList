const express = require('express');
const {readFile} = require('fs').promises;

const listRouter = express.Router();

listRouter
    .get('/list', async (req, res, next) => {
        try {
            const data = JSON.parse(await readFile('data/list.json', 'utf8'));
            res.json(data);
        } catch(err) {
            next(err);
        }
    });

module.exports = {
    listRouter,
};