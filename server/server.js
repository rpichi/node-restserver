require('./config/config');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    userCreateIndex: true
}, (err, res) => {
    if (err)
        throw err;
    console.log('bd online');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando.. ' + process.env.PORT);
});