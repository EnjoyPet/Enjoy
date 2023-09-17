const conection = require('./db.js');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const shar = require('sharp');
const ejs = require('ejs');
const path = require('path');
const { error } = require('console');
const { query } = require('express');


/* * Acount * */
const acountModel = {};
const verification = new Map();

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
                    global.transporter.sendMail(mailOptions, (error, info) => {
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

acountModel.renderizarCarrito = async (req, callback) => {
    const query = 'SELECT carrito.*,  producto.precio,producto.nombre AS producto_nombre FROM carrito INNER JOIN producto ON carrito.producto = producto.id_producto WHERE carrito.comprado_por = ? ORDER BY id_carrito DESC;';
    conection.query(query, [req.session.id_usuario], (error, result) => {
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', carrito: result });
        }
    });
}

acountModel.renderizarProductos = async (req, callback) => {
    const query = 'SELECT * FROM `producto` WHERE id_usuario = ?;';
    conection.query(query, [req.session.id_usuario], (error, result) => {
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result });
        }
    });
}

/* * --------------------------------------------------------------------------------------------------------- * */

/* * entrenamiento * */

const entrenamientoModel = {};

entrenamientoModel.hacerPost = async (req, titulo, contenido, categoria, callback) => {
    if (req.file) {
        shar(req.file.buffer)
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO post (titulo_post,contenido_post,imagen_post,categoria_post,id_usuario ) VALUES (?,?,?,?,?)';
                conection.query(query, [titulo, contenido, imagenRedimensionada, categoria, req.session.id_usuario], async (error, result, fields) => {
                    if (error) {
                        console.error('Error al guardar el post:', error);
                        callback({ valid: false, message: `Error al guardar el post: ${error}` })
                    } else {
                        console.log('post guardado en la base de datos.');
                        callback({ valid: true, message: `post guardado en la base de datos.` })
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

entrenamientoModel.renderAprender = async (callback) => {
    const query = 'SELECT * FROM post ORDER BY id_post DESC LIMIT 50;'
    try {
        conection.query(query, (error, result) => {
            callback({ valid: true, posts: result });
        });
    } catch (error) {
        callback({ valid: false, message: "Ocurrió un error en la consulta: " + error });
    }
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * index * */

const getData = (req) => {
    return {
        userData: req.session.userData || null,
        id_usuario: req.session.id_usuario || null,
        usuario: req.session.usuario || null,
        usuario_img: req.session.usuario_img || null,
        tipo_indent: req.session.tipo_indent || null,
        identificacion: req.session.identificacion || null,
        correo: req.session.correo || null,
        celular: req.session.celular || null,
        genero: req.session.genero || null,
        direccion: req.session.direccion || null,
        telefono: req.session.telefono || null,
        rol: req.session.rol || null,
        usuario_img: req.session.usuario_img || null
    };
};

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * productos * */

const productosModel = {};

productosModel.renderProductos = async (categoria, pagina, callback) => {
    try {
        let query;
        if (categoria !== 'todo') {
            let id_categoria;
            switch (categoria) {
                case 'juguetes':
                    id_categoria = 8;
                    break;
                case 'alimentos':
                    id_categoria = 7;
                    break;
                case 'accesorios':
                    id_categoria = 9;
                    break;
                default:
                    callback({ valid: false, message: 'Categoría no válida' });
                    return;
            }
            query = `SELECT * FROM producto WHERE id_categoria = ? AND stock > 0 LIMIT ?, 10`;
            conection.query(query, [id_categoria, pagina * 10], (error, result) => {
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result });
                }
            });
        } else {
            query = `SELECT * FROM producto WHERE stock > 0 LIMIT ?, 10`;
            conection.query(query, [pagina * 10], (error, result) => {
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result });
                }
            });
        }
    } catch (error) {
        callback({ valid: false, message: `Error en la consulta de la base de datos: ${error.message}` });
    }
}

productosModel.renderInfoProducto = async (id_producto, callback) => {
    const query = 'SELECT * FROM producto WHERE id_producto = ?';
    try {
        conection.query(query, [id_producto], (error, result) => {
            if (error) {
                callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
            } else {
                callback({ valid: true, message: 'Éxito en la consulta de la base de datos', producto: result[0] });
            }
        });
    } catch (error) {
        callback({ valid: false, message: `Error en la consulta de la base de datos: ${error.message}` });
    }
}

const actualizarProducto = async (id) => {
    const query = 'UPDATE producto SET stock = stock - 1 WHERE id_producto = ?';

    try {
        await conection.query(query, id);
        console.log('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
};

productosModel.comprarProducto = async (req, id_producto, callback) => {
    const query = 'SELECT producto.*, usuario.nombre AS vendedor, usuario.correo, usuario.celular, usuario.direccion FROM producto INNER JOIN usuario ON producto.id_usuario = usuario.id_usuario WHERE producto.id_producto = ?;'
    conection.query(query, [id_producto], async (error, result) => {
        if (error)
            callback({ valid: false, message: "error en la base de datos" })
        else {
            const compraTemplate = path.join(__dirname, '..', 'views', 'mailDeCompra.ejs');
            const mailCompra = {
                from: process.env.MAILER_MAIL,
                to: req.session.correo,
                subject: 'hiciste una compra',
                html: await ejs.renderFile(compraTemplate, { usuario: req.session.usuario, producto: result[0].nombre, precio: result[0].precio, numero: result[0].celular })
            };

            const compraTemplate_ = path.join(__dirname, '..', 'views', 'mailDeVenta.ejs');
            const mailVenta = {
                from: process.env.MAILER_MAIL,
                to: result[0].correo,
                subject: 'hiciste una venta',
                html: await ejs.renderFile(compraTemplate_, { usuario: result[0].vendedor, producto: result[0].nombre, precio: result[0].precio, numero: req.session.celular, direccion: result[0].direccion })
            };

            global.transporter.sendMail(mailCompra, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Correo de Compra enviado: ' + info.response);
                }
            });
            global.transporter.sendMail(mailVenta, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Correo de venta enviado: ' + info.response);
                }
            });
            actualizarProducto(id_producto);
            callback({ valid: true, header: "¡Gracias por tu compra!", body: "En tu correo encontraras la informacion de tu compra y vendedor para que termines tu proceso" })
        }
    })
}

productosModel.productoAlCarro = async (req, id_producto, callback) => {
    const query = 'INSERT INTO carrito (cantidad, estado, comprado_por, producto) VALUES (?,?,?,?)'
    conection.query(query, [1, 0, req.session.id_usuario, id_producto], async (error, result) => {
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
        }
    })
}

productosModel.comprarCarrito = async (req, id_carrito, id_producto, callback) => {
    productosModel.comprarProducto(req, id_producto, (result) => {
        if (!result.valid) {
            callback({ valid: result.valid, message: result.message })
            console.error(result.message);
        } else {
            const query = 'UPDATE carrito SET estado = 1 WHERE id_carrito = ?;';
            conection.query(query, [id_carrito], async (error, result) => {
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
                }
            });
        }
    })
}

productosModel.eliminarCarrito = async (id_carrito, callback) => {
    const query = 'DELETE FROM carrito WHERE id_carrito = ?;';
    conection.query(query, [id_carrito], async (error, result) => {
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
        }
    })
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * User * */

const UserModel = {};

UserModel.comprobarCorreo = async (correo, callback) => {
    if (!validator.isEmail(correo)) {
        callback({ isValid: false, message: "Este correo no es valido" });
    } else {
        const query = 'SELECT id_usuario FROM usuario WHERE correo = ?';
        try {
            conection.query(query, [correo], (error, result) => {
                callback({ isValid: true, result: result });
            });
        } catch (error) {
            callback({ isValid: false, message: "Ocurrió un error en la consulta: " + error });
        }
    }
};

UserModel.registrarUsuario = async (nombre, correo, numero, contrasenia) => {
    const contrhaash = await bcryptjs.hash(contrasenia, 8);

    const verificationCode = crypto.randomBytes(2).toString('hex');

    verification.set(correo, {
        Codigo: verificationCode,
        Nombre: nombre,
        Contrasenia: contrhaash,
        Numero: numero,
    });

    const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: correo,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}.`,
    };

    global.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Correo de verificación enviado: ' + info.response);
        }
    });
    return verificationCode;
};

UserModel.verificarCodigo = async (correo, codigo, callback) => {
    const DatosdeUsuario = verification.get(correo);

    if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) {
        callback({ error: true, message: "Este código es incorrecto" });
    } else {
        const nombre = DatosdeUsuario.Nombre;
        const contrasenia = DatosdeUsuario.Contrasenia;
        const celular = DatosdeUsuario.Numero;

        const query = "INSERT INTO usuario (nombre, correo, contrasenia, celular, rol) VALUES (?,?,?,?,2)";
        try {
            conection.query(query, [nombre, correo, contrasenia, celular], (error, result) => {
                if (error) throw error
                else {
                    verification.delete(correo);
                    callback({ error: false, message: "Éxito al crear el usuario" });
                }
            });
        } catch (err) {
            throw err;
            callback({ error: true, message: "Error al crear el usuario" });
        }
    }
};

UserModel.iniciarSesion = async (req, correo, contrasenia, callback) => {
    conection.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, result) => {
        if (error) throw error
        else {
            if (result.length == 0 || !(await bcryptjs.compare(contrasenia, result[0].contrasenia))) {
                callback({ logget: false, message: "Correo y/o contraseña erroneos" });
            } else {
                req.session.id_usuario = result[0].id_usuario;
                req.session.usuario_img = result[0].usuario_img;
                req.session.usuario = result[0].nombre;
                req.session.tipo_indent = result[0].tipo_identificacion;
                req.session.identificacion = result[0].identificacion;
                req.session.correo = result[0].correo;
                req.session.celular = result[0].celular;
                req.session.genero = result[0].genero;
                req.session.direccion = result[0].direccion;
                req.session.telefono = result[0].telefono;
                req.session.rol = result[0].rol;
                req.session.usuario_img = result[0].usuario_img;
                callback({ logget: true, message: `Bienvenido de vuelta ${req.session.usuario}` });
            }
        }
    })
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * ventas * */

const ventasModel = {};

ventasModel.publicarVenta = async (req, nombre, categoria, descripcion, dimenciones, stock, precio, callback) => {
    if (req.file) {
        shar(req.file.buffer)
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO producto (id_usuario,nombre,id_categoria,imagen_producto,descripcion,dimensiones,stock,precio) VALUES (?,?,?,?,?,?,?,?)';
                conection.query(query, [req.session.id_usuario, nombre, categoria, imagenRedimensionada, descripcion, dimenciones, stock, precio], async (error, result, fields) => {
                    if (error) {
                        console.error('Error al guardar el producto:', error);
                        callback({ valid: false, message: `Error al guardar el producto: ${error}` })
                    } else {
                        console.log('producto guardado en la base de datos.');
                        callback({ valid: true, message: `producto guardado en la base de datos.` })
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

/* * ---------------------------------------------------------------------------------------------------------- * */

module.exports = { acountModel, entrenamientoModel, getData, productosModel, UserModel, ventasModel };
                                                                           