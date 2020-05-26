const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// app.get('/', (req, res) => {
//     res.json('hi');
// });

app.get('/usuario', (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    // {} indica que no hay filtros
    // si queremos un filtro lo ponemos como JSON 
    // Ejemplo {google : true}
    // segundo parámetro indica qué campos queremos devolver para otra traer todo
    Usuario.find({ estado: true }, 'nombre email role')
        .limit(limite) //solo 5 registros
        .skip(desde)
        .exec((err, usuarios) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            // luego de que se ejecuta la primer función .find
            //se ejecuta esta, debe tener el mismo filtro {}
            // y finalmente se retorna todo como un solo objeto
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        })
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'nombre necesario',
    //         err: 'error'
    //     });
    // } else {
    //     res.json({ body });
    // }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre',
        'email',
        'role',
        'estado'
    ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //borrar definitivamente
    // Usuario.findByIdAndDelete(id, (err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (!usuarioDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB
    //     });
    // });

    //actualizar el estado a false
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;