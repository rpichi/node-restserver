require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json('hi');
});

app.get('/usuario', (req, res) => {
    res.json('hi get');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'nombre necesario',
            err: 'error'
        });
    } else {
        res.json({ body });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
});

app.delete('/usuario', (req, res) => {
    res.json('hi delete');
});


app.listen(process.env.PORT, () => {
    console.log('escuchando..');
});