const conection = require('../config/db');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const shar = require('sharp');
const { query } = require('express');

const acountModel = {};
const verification = new Map();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS
    }
});

acountModel.getData = async (req, callback) => {
    const correo = req.session.correo;
    const query = 'SELECT * FROM usuario WHERE correo = ?';
    conection.query(query, [correo], (error, result) => {
        if (error) throw error;
        else {
            callback(result)
        }
    });
}

acountModel.actualizarCorreo = async (req, correo, callback) => {
    const lastCorreo = req.session.correo;
    const newCorreo = correo;
    const verificationCode = crypto.randomBytes(2).toString('hex');

    if (!validator.isEmail(correo)) {
        callback({ isValid: false, message: "Este correo no es valido" });
    } else {
        const query = 'SELECT id_usuario FROM usuario WHERE correo = ?';
        try {
            conection.query(query, [correo], (error, result) => {
                if (result.length == 0) {
                    verification.set(newCorreo, {
                        newCorreo: newCorreo,
                        lastCorreo: lastCorreo,
                        Codigo: verificationCode
                    });

                    const mailOptions = {
                        from: process.env.MAILER_MAIL,
                        to: newCorreo,
                        subject: 'Código de verificación',
                        text: `Tu código de verificación es: ${verificationCode}.`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Tu código de verificación es: ' + verificationCode);
                            console.log('Correo de verificación enviado: ' + info.response);
                        }
                    });
                    callback({ isValid: true, message: "Todo Bien" });
                } else {
                    callback({ isValid: false, message: "Este correo ya esta registrado" });
                }
            });
        } catch (error) {
            callback({ isValid: false, message: "Ocurrió un error en la consulta: " + error });
        }
    }
}

acountModel.verificarCodigo = async (correo, codigo, callback) => {
    // Verificar si el correo y el código coinciden
    const DatosdeUsuario = verification.get(correo);

    if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) {
        callback({ error: true, message: "Este código es incorrecto" });
    } else {

        const query = "UPDATE usuario SET correo = ? WHERE correo = ?";
        try {
            conection.query(query, [correo, DatosdeUsuario.lastCorreo], (error, result) => {
                if (error) throw error
                else {
                    verification.delete(correo);
                    callback({ error: false, message: "Éxito al actualizar el usuario" });
                }
            });
        } catch (err) {
            throw err;
            callback({ error: true, message: "Error al actualizar el usuario" });
        }
    }
};

acountModel.actualizarContrasenia = async (req, ant_contrasenia, contrasenia_1, contrasenia_2, callback) => {
    const correo = req.session.correo;

    if (contrasenia_1 === contrasenia_2) {
        conection.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, result) => {
            if (error) throw error
            else {
                if (result.length == 0 || !(await bcryptjs.compare(ant_contrasenia, result[0].contrasenia))) {
                    callback({ valid: false, message: "contraseña erronea" });
                } else {
                    const contrhaash = await bcryptjs.hash(contrasenia_1, 8);
                    const query = 'UPDATE usuario SET contrasenia = ? WHERE correo = ?';
                    try {
                        conection.query(query, [contrhaash, correo], (error, result) => {
                            if (error) throw error
                            else {
                                callback({ valid: true, message: "Éxito al actualizar la contraseña" });
                            }
                        });
                    } catch (err) {
                        throw err;
                        callback({ valid: false, message: "Error al actualizar la contraseña" });
                    }
                }
            }
        })
    } else {
        callback({ valid: false, message: "Las contraseñas no coisiden" });
    }
};

acountModel.actualizarDatos = async (req, datoNombre, datoValor, callback) => {
    const correo = req.session.correo;
    const query = `UPDATE usuario SET ${datoNombre} = ? WHERE correo = ?`
    try {
        conection.query(query, [datoValor, correo], (error, result) => {
            if (error) throw error
            else {
                callback({ error: false, message: "Éxito al actualizar el dato" });
            }
        });
    } catch (err) {
        throw err;
        callback({ error: true, message: "Error al actualizar el dato" });
    }
}

acountModel.actualizarImagen = async (req, callback) => {
    if (req.file) {
        shar(req.file.buffer)
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'UPDATE usuario SET usuario_img = ? WHERE correo = ?';
                conection.query(query, [imagenRedimensionada, req.session.correo], (error, result, fields) => {
                    if (error) {
                        console.error('Error al guardar la imagen:', error);
                        callback({ valid: false, message: `Error al guardar la imagen: ${error}` })
                    } else {
                        console.log('Imagen redimensionada y guardada en la base de datos.');
                        callback({ valid: true, message: `Imagen redimensionada y guardada en la base de datos.` })
                    }
                });
            })
            .catch((error) => {
                console.error('Error al redimensionar la imagen:', error);
                callback({ valid: false, message: `Error al redimensionar la imagen: ${error}` })
            });
    } else {
        callback({ valid: false, message: `No se cargo una imagen` })
    }
}

acountModel.eliminarImagen = async (req, callback) => {
    const query =
        'UPDATE usuario SET usuario_img = NULL WHERE correo = ?';
    conection.query(query, [req.session.correo], (error, result, fields) => {
        if (error) {
            console.error('Error al eliminar la imagen:', error);
            callback({ valid: false, message: `Error al eliminar la imagen: ${error}` })
        } else {
            console.log('Imagen eliminada de la base de datos.');
            callback({ valid: true, message: `Imagen eliminada la base de datos.` })
        }
    });
}

acountModel.renderizarCarrito = async (req,callback)=>{
    const query = 'SELECT carrito.*,  producto.precio,producto.nombre AS producto_nombre FROM carrito INNER JOIN producto ON carrito.producto = producto.id_producto WHERE carrito.comprado_por = ? ORDER BY id_carrito DESC;';
    conection.query(query,[req.session.id_usuario],(error,result)=>{
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', carrito: result });
        }
    });
}

acountModel.renderizarProductos = async (req,callback)=>{
    const query = 'SELECT * FROM `producto` WHERE id_usuario = ?;';
    conection.query(query,[req.session.id_usuario],(error,result)=>{
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result });
        }
    });
}

module.exports = acountModel;
