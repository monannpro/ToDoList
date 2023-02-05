const express = require('express');
const {addRouter} = require("./routes/add");
const {listRouter} = require("./routes/list");
const {deleteRouter} = require("./routes/delete");
const {editRouter} = require("./routes/edit");

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/todo', addRouter);
app.use('/todo', listRouter);
app.use('/todo', deleteRouter);
app.use('/todo', editRouter);

app.listen(3000, 'localhost');

