const conection = require('./db.js'); // Importando el módulo de conexión a la base de datos
const validator = require('validator'); // Importando el módulo de validación de datos
const bcryptjs = require('bcryptjs'); // Importando el módulo de encriptación bcrypt
const crypto = require('crypto'); // Importando el módulo de criptografía
const shar = require('sharp'); // Importando el módulo para manipulación de imágenes
const ejs = require('ejs'); // Importando el módulo de generación de HTML con EJS
const path = require('path'); // Importando el módulo para manejo de rutas de archivo
const { query } = require('express'); // Importando la función de consulta de Express
const { error } = require('console'); // Importando la función de manejo de errores de la consola

/* * Acount * */
const acountModel = {}; // Objeto para definir funciones relacionadas con la cuenta de usuario
const verification = new Map(); // Creando un mapa para almacenar datos de verificación de cuenta

// Función para obtener datos de usuario
acountModel.getData = async (req, callback) => {
    const correo = req.session.correo; // Obteniendo el correo electrónico de la sesión
    const query = 'SELECT * FROM usuario WHERE correo = ?'; // Consulta SQL para obtener datos del usuario por correo electrónico
    conection.query(query, [correo], (error, result) => { // Ejecutando la consulta en la base de datos
        if (error) throw error; // Manejo de error en caso de fallo en la consulta
        else {
            callback(result); // Llamando a la función de devolución de llamada con los resultados de la consulta
        }
    });
}
acountModel.actualizarCorreo = async (req, correo, callback) => {
    const lastCorreo = req.session.correo; // Obteniendo el correo electrónico actual de la sesión
    const newCorreo = correo; // Nuevo correo electrónico proporcionado
    const verificationCode = crypto.randomBytes(2).toString('hex'); // Generando un código de verificación aleatorio

    if (!validator.isEmail(correo)) { // Validando el nuevo correo electrónico
        callback({ isValid: false, message: "Este correo no es válido" }); // Devolviendo un mensaje de error si el correo no es válido
    } else {
        const query = 'SELECT id_usuario FROM usuario WHERE correo = ?'; // Consulta SQL para verificar si el nuevo correo ya está registrado
        try {
            conection.query(query, [correo], (error, result) => { // Ejecutando la consulta en la base de datos
                if (result.length == 0) { // Verificando si el nuevo correo no está registrado
                    verification.set(newCorreo, { // Almacenando los datos de verificación en el mapa
                        newCorreo: newCorreo,
                        lastCorreo: lastCorreo,
                        Codigo: verificationCode
                    });

                    const mailOptions = { // Configurando opciones para el correo de verificación
                        from: process.env.MAILER_MAIL,
                        to: newCorreo,
                        subject: 'Código de verificación',
                        text: `Tu código de verificación es: ${verificationCode}.`,
                    };
                    global.transporter.sendMail(mailOptions, (error, info) => { // Enviando el correo de verificación
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Tu código de verificación es: ' + verificationCode);
                            console.log('Correo de verificación enviado: ' + info.response);
                        }
                    });
                    callback({ isValid: true, message: "Todo Bien" }); // Devolviendo un mensaje de éxito
                } else {
                    callback({ isValid: false, message: "Este correo ya está registrado" }); // Devolviendo un mensaje de error si el correo ya está registrado
                }
            });
        } catch (error) {
            callback({ isValid: false, message: "Ocurrió un error en la consulta: " + error }); // Manejando errores en la consulta
        }
    }
}

acountModel.verificarCodigo = async (correo, codigo, callback) => {
    // Verificar si el correo y el código coinciden
    const DatosdeUsuario = verification.get(correo); // Obteniendo los datos de verificación del mapa

    if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) { // Verificando si el correo y el código coinciden
        callback({ error: true, message: "Este código es incorrecto" }); // Devolviendo un mensaje de error si el código es incorrecto
    } else {

        const query = "UPDATE usuario SET correo = ? WHERE correo = ?"; // Consulta SQL para actualizar el correo del usuario
        try {
            conection.query(query, [correo, DatosdeUsuario.lastCorreo], (error, result) => { // Ejecutando la consulta en la base de datos
                if (error) throw error; // Manejando errores en la consulta
                else {
                    verification.delete(correo); // Eliminando los datos de verificación del mapa
                    callback({ error: false, message: "Éxito al actualizar el usuario" }); // Devolviendo un mensaje de éxito
                }
            });
        } catch (err) {
            throw err;
            callback({ error: true, message: "Error al actualizar el usuario" }); // Manejando errores al actualizar el usuario
        }
    }
};

acountModel.actualizarContrasenia = async (req, ant_contrasenia, contrasenia_1, contrasenia_2, callback) => {
    const correo = req.session.correo; // Obteniendo el correo electrónico de la sesión

    if (contrasenia_1 === contrasenia_2) { // Verificando si las contraseñas coinciden
        conection.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, result) => { // Consulta SQL para obtener datos del usuario
            if (error) throw error; // Manejando errores en la consulta
            else {
                if (result.length == 0 || !(await bcryptjs.compare(ant_contrasenia, result[0].contrasenia))) { // Verificando si la contraseña actual es correcta
                    callback({ valid: false, message: "contraseña incorrecta" }); // Devolviendo un mensaje de error si la contraseña actual es incorrecta
                } else {
                    const contrhaash = await bcryptjs.hash(contrasenia_1, 8); // Encriptando la nueva contraseña
                    const query = 'UPDATE usuario SET contrasenia = ? WHERE correo = ?'; // Consulta SQL para actualizar la contraseña
                    try {
                        conection.query(query, [contrhaash, correo], (error, result) => { // Ejecutando la consulta en la base de datos
                            if (error) throw error; // Manejando errores en la consulta
                            else {
                                callback({ valid: true, message: "Éxito al actualizar la contraseña" }); // Devolviendo un mensaje de éxito
                            }
                        });
                    } catch (err) {
                        throw err;
                        callback({ valid: false, message: "Error al actualizar la contraseña" }); // Manejando errores al actualizar la contraseña
                    }
                }
            }
        })
    } else {
        callback({ valid: false, message: "Las contraseñas no coinciden" }); // Devolviendo un mensaje de error si las contraseñas no coinciden
    }
};
acountModel.actualizarDatos = async (req, datoNombre, datoValor, callback) => {
    const correo = req.session.correo; // Obteniendo el correo electrónico de la sesión
    const query = `UPDATE usuario SET ${datoNombre} = ? WHERE correo = ?`; // Construyendo la consulta SQL dinámicamente
    try {
        conection.query(query, [datoValor, correo], (error, result) => { // Ejecutando la consulta en la base de datos
            if (error) throw error; // Manejando errores en la consulta
            else {
                callback({ error: false, message: "Éxito al actualizar el dato" }); // Devolviendo un mensaje de éxito
            }
        });
    } catch (err) {
        throw err;
        callback({ error: true, message: "Error al actualizar el dato" }); // Manejando errores al actualizar el dato
    }
}

acountModel.actualizarImagen = async (req, callback) => {
    if (req.file) { // Verificando si se cargó un archivo en la solicitud
        shar(req.file.buffer) // Redimensionando la imagen
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'UPDATE usuario SET usuario_img = ? WHERE correo = ?'; // Consulta SQL para actualizar la imagen de usuario
                conection.query(query, [imagenRedimensionada, req.session.correo], (error, result, fields) => { // Ejecutando la consulta en la base de datos
                    if (error) {
                        console.error('Error al guardar la imagen:', error);
                        callback({ valid: false, message: `Error al guardar la imagen: ${error}` }); // Manejando errores al guardar la imagen
                    } else {
                        console.log('Imagen redimensionada y guardada en la base de datos.');
                        callback({ valid: true, message: `Imagen redimensionada y guardada en la base de datos.` }); // Devolviendo un mensaje de éxito
                    }
                });
            })
            .catch((error) => {
                console.error('Error al redimensionar la imagen:', error);
                callback({ valid: false, message: `Error al redimensionar la imagen: ${error}` }); // Manejando errores al redimensionar la imagen
            });
    } else {
        callback({ valid: false, message: `No se cargó una imagen` }); // Devolviendo un mensaje de error si no se cargó ninguna imagen
    }
}
acountModel.eliminarImagen = async (req, callback) => {
    const query =
        'UPDATE usuario SET usuario_img = NULL WHERE correo = ?'; // Consulta SQL para eliminar la imagen de perfil del usuario
    conection.query(query, [req.session.correo], (error, result, fields) => { // Ejecutando la consulta en la base de datos
        if (error) {
            console.error('Error al eliminar la imagen:', error);
            callback({ valid: false, message: `Error al eliminar la imagen: ${error}` }); // Manejando errores al eliminar la imagen
        } else {
            console.log('Imagen eliminada de la base de datos.');
            callback({ valid: true, message: `Imagen eliminada de la base de datos.` }); // Devolviendo un mensaje de éxito
        }
    });
}

acountModel.renderizarCarrito = async (req, callback) => {
    const query = 'SELECT carrito.*,  producto.precio,producto.nombre AS producto_nombre FROM carrito INNER JOIN producto ON carrito.producto = producto.id_producto WHERE carrito.comprado_por = ? ORDER BY id_carrito DESC;'; // Consulta SQL para obtener los productos en el carrito de un usuario
    conection.query(query, [req.session.id_usuario], (error, result) => { // Ejecutando la consulta en la base de datos
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', carrito: result }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
        }
    });
}

acountModel.renderizarProductos = async (req, callback) => {
    const query = 'SELECT * FROM `producto` WHERE id_usuario = ?;'; // Consulta SQL para obtener los productos de un usuario
    conection.query(query, [req.session.id_usuario], (error, result) => { // Ejecutando la consulta en la base de datos
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
        }
    });
}

/* * --------------------------------------------------------------------------------------------------------- * */

/* * entrenamiento * */

const entrenamientoModel = {};

entrenamientoModel.hacerPost = async (req, titulo, contenido, categoria, callback) => {
    if (req.file) { // Verificando si se cargó un archivo en la solicitud
        shar(req.file.buffer) // Redimensionando la imagen
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO post (titulo_post,contenido_post,imagen_post,categoria_post,id_usuario ) VALUES (?,?,?,?,?)'; // Consulta SQL para insertar un nuevo post en la base de datos
                conection.query(query, [titulo, contenido, imagenRedimensionada, categoria, req.session.id_usuario], async (error, result, fields) => { // Ejecutando la consulta en la base de datos
                    if (error) {
                        console.error('Error al guardar el post:', error);
                        callback({ valid: false, message: `Error al guardar el post: ${error}` }); // Manejando errores al guardar el post
                    } else {
                        console.log('Post guardado en la base de datos.');
                        callback({ valid: true, message: `Post guardado en la base de datos.` }); // Devolviendo un mensaje de éxito
                    }
                });
            })
            .catch((error) => {
                console.error('Error al redimensionar la imagen:', error);
                callback({ valid: false, message: `Error al redimensionar la imagen: ${error}` }); // Manejando errores al redimensionar la imagen
            });
    } else {
        callback({ valid: false, message: `No se cargó una imagen` }); // Devolviendo un mensaje de error si no se cargó ninguna imagen
    }
}

entrenamientoModel.renderAprender = async (callback) => {
    const query = 'SELECT * FROM post ORDER BY id_post DESC LIMIT 50;'; // Consulta SQL para obtener los últimos 50 posts
    try {
        conection.query(query, (error, result) => { // Ejecutando la consulta en la base de datos
            callback({ valid: true, posts: result }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
        });
    } catch (error) {
        callback({ valid: false, message: "Ocurrió un error en la consulta: " + error }); // Manejando errores en la consulta
    }
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * index * */
const getData = (req) => {
    return {
        userData: req.session.userData || null, // Datos del usuario
        id_usuario: req.session.id_usuario || null, // ID del usuario
        usuario: req.session.usuario || null, // Nombre de usuario
        usuario_img: req.session.usuario_img || null, // Imagen de perfil del usuario
        tipo_indent: req.session.tipo_indent || null, // Tipo de identificación del usuario
        identificacion: req.session.identificacion || null, // Número de identificación del usuario
        correo: req.session.correo || null, // Correo electrónico del usuario
        celular: req.session.celular || null, // Número de celular del usuario
        genero: req.session.genero || null, // Género del usuario
        direccion: req.session.direccion || null, // Dirección del usuario
        telefono: req.session.telefono || null, // Número de teléfono del usuario
        rol: req.session.rol || null, // Rol del usuario
        usuario_img: req.session.usuario_img || null // Imagen de perfil del usuario
    };
};

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * productos * */
const productosModel = {};

productosModel.renderProductos = async (categoria, pagina, callback) => {
    try {
        let query;
        if (categoria !== 'todo') { // Verificando si se especificó una categoría
            let id_categoria;
            switch (categoria) { // Asignando el ID de categoría correspondiente
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
                    callback({ valid: false, message: 'Categoría no válida' }); // Devolviendo un mensaje de error si la categoría no es válida
                    return;
            }
            query = `SELECT * FROM producto WHERE id_categoria = ? AND stock > 0 LIMIT ?, 10`; // Consulta SQL para obtener productos por categoría
            conection.query(query, [id_categoria, pagina * 10], (error, result) => { // Ejecutando la consulta en la base de datos
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
                }
            });
        } else { // Si no se especifica una categoría, se obtienen todos los productos
            query = `SELECT * FROM producto WHERE stock > 0 LIMIT ?, 10`; // Consulta SQL para obtener todos los productos
            conection.query(query, [pagina * 10], (error, result) => { // Ejecutando la consulta en la base de datos
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
                }
            });
        }
    } catch (error) {
        callback({ valid: false, message: `Error en la consulta de la base de datos: ${error.message}` }); // Manejando errores en caso de excepción
    }
}

productosModel.renderInfoProducto = async (id_producto, callback) => {
    const query = 'SELECT * FROM producto WHERE id_producto = ?'; // Consulta SQL para obtener información de un producto por su ID
    try {
        conection.query(query, [id_producto], (error, result) => { // Ejecutando la consulta en la base de datos
            if (error) {
                callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
            } else {
                callback({ valid: true, message: 'Éxito en la consulta de la base de datos', producto: result[0] }); // Devolviendo un mensaje de éxito junto con los resultados de la consulta
            }
        });
    } catch (error) {
        callback({ valid: false, message: `Error en la consulta de la base de datos: ${error.message}` }); // Manejando errores en caso de excepción
    }
}
const actualizarProducto = async (id) => {
    const query = 'UPDATE producto SET stock = stock - 1 WHERE id_producto = ?'; // Consulta SQL para actualizar el stock de un producto

    try {
        await conection.query(query, id); // Ejecutando la consulta en la base de datos
        console.log('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el producto:', error); // Manejando errores al actualizar el producto
    }
};

productosModel.comprarProducto = async (req, id_producto, callback) => {
    const query = 'SELECT producto.*, usuario.nombre AS vendedor, usuario.correo, usuario.celular, usuario.direccion FROM producto INNER JOIN usuario ON producto.id_usuario = usuario.id_usuario WHERE producto.id_producto = ?;'; // Consulta SQL para obtener información del producto y su vendedor

    conection.query(query, [id_producto], async (error, result) => { // Ejecutando la consulta en la base de datos
        if (error)
            callback({ valid: false, message: "error en la base de datos" }); // Manejando errores en la consulta
        else {
            const compraTemplate = path.join(__dirname, '..', 'views', 'mailDeCompra.ejs'); // Ruta al archivo de plantilla de correo de compra
            const mailCompra = {
                from: process.env.MAILER_MAIL,
                to: req.session.correo,
                subject: 'hiciste una compra',
                html: await ejs.renderFile(compraTemplate, { usuario: req.session.usuario, producto: result[0].nombre, precio: result[0].precio, numero: result[0].celular })
            }; // Configuración del correo de compra

            const compraTemplate_ = path.join(__dirname, '..', 'views', 'mailDeVenta.ejs'); // Ruta al archivo de plantilla de correo de venta
            const mailVenta = {
                from: process.env.MAILER_MAIL,
                to: result[0].correo,
                subject: 'hiciste una venta',
                html: await ejs.renderFile(compraTemplate_, { usuario: result[0].vendedor, producto: result[0].nombre, precio: result[0].precio, numero: req.session.celular, direccion: result[0].direccion })
            }; // Configuración del correo de venta

            global.transporter.sendMail(mailCompra, (error, info) => { // Enviando el correo de compra
                if (error) {
                    console.error(error); // Manejando errores al enviar el correo
                } else {
                    console.log('Correo de Compra enviado: ' + info.response);
                }
            });
            global.transporter.sendMail(mailVenta, (error, info) => { // Enviando el correo de venta
                if (error) {
                    console.error(error); // Manejando errores al enviar el correo
                } else {
                    console.log('Correo de venta enviado: ' + info.response);
                }
            });
            actualizarProducto(id_producto); // Actualizando el stock del producto
            callback({ valid: true, header: "¡Gracias por tu compra!", body: "En tu correo encontraras la informacion de tu compra y vendedor para que termines tu proceso" }); // Devolviendo un mensaje de éxito
        }
    })
}
productosModel.productoAlCarro = async (req, id_producto, callback) => {
    const query = 'INSERT INTO carrito (cantidad, estado, comprado_por, producto) VALUES (?,?,?,?)'; // Consulta SQL para agregar un producto al carrito de compras
    conection.query(query, [1, 0, req.session.id_usuario, id_producto], async (error, result) => { // Ejecutando la consulta en la base de datos
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' }); // Devolviendo un mensaje de éxito
        }
    })
}

productosModel.comprarCarrito = async (req, id_carrito, id_producto, callback) => {
    productosModel.comprarProducto(req, id_producto, (result) => { // Llamando a la función comprarProducto para realizar la compra del producto
        if (!result.valid) { // Si la compra del producto no fue exitosa
            callback({ valid: result.valid, message: result.message }) // Devolviendo un mensaje de error
            console.error(result.message); // Imprimiendo el mensaje de error en la consola
        } else { // Si la compra del producto fue exitosa
            const query = 'UPDATE carrito SET estado = 1 WHERE id_carrito = ?;'; // Consulta SQL para marcar el estado del producto en el carrito como comprado
            conection.query(query, [id_carrito], async (error, result) => { // Ejecutando la consulta en la base de datos
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos' }); // Devolviendo un mensaje de éxito
                }
            });
        }
    })
}

productosModel.eliminarCarrito = async (id_carrito, callback) => {
    const query = 'DELETE FROM carrito WHERE id_carrito = ?;'; // Consulta SQL para eliminar un producto del carrito de compras
    conection.query(query, [id_carrito], async (error, result) => { // Ejecutando la consulta en la base de datos
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` }); // Manejando errores en la consulta
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' }); // Devolviendo un mensaje de éxito
        }
    })
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * User * */
const UserModel = {};

UserModel.comprobarCorreo = async (correo, contrasenia, contrasenia2, callback) => {
    if (contrasenia === contrasenia2) { // Verificando si las contraseñas coinciden
        if (!validator.isEmail(correo)) { // Verificando si el correo electrónico es válido
            callback({ isValid: false, message: "Este correo no es valido" }); // Devolviendo un mensaje de error si el correo no es válido
        } else {
            const query = 'SELECT id_usuario FROM usuario WHERE correo = ?'; // Consulta SQL para verificar si el correo ya está registrado en la base de datos
            try {
                conection.query(query, [correo], (error, result) => {
                    callback({ isValid: true, result: result }); // Devolviendo el resultado de la consulta si no hay errores
                });
            } catch (error) {
                callback({ isValid: false, message: "Ocurrió un error en la consulta: " + error }); // Manejando errores en la consulta
            }
        }
    } else callback({ isValid: false, message: "Las Conteseñas No Coinsiden" }); // Devolviendo un mensaje de error si las contraseñas no coinciden
};

UserModel.registrarUsuario = async (nombre, correo, numero, contrasenia) => {
    const contrhaash = await bcryptjs.hash(contrasenia, 8); // Generando el hash de la contraseña

    const verificationCode = crypto.randomBytes(2).toString('hex'); // Generando un código de verificación

    verification.set(correo, { // Guardando los datos del usuario y el código de verificación en el mapa de verificación
        Codigo: verificationCode,
        Nombre: nombre,
        Contrasenia: contrhaash,
        Numero: numero,
    });

    const mailOptions = { // Configuración del correo electrónico de verificación
        from: process.env.MAILER_MAIL,
        to: correo,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}.`,
    };

    global.transporter.sendMail(mailOptions, (error, info) => { // Enviando el correo electrónico de verificación
        if (error) {
            console.error(error); // Manejando errores al enviar el correo electrónico
        } else {
            console.log('Correo de verificación enviado: ' + info.response);
        }
    });
    return verificationCode; // Devolviendo el código de verificación generado
};

UserModel.verificarCodigo = async (correo, codigo, callback) => {
    const DatosdeUsuario = verification.get(correo); // Obteniendo los datos del usuario desde el mapa de verificación

    if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) { // Verificando si el código de verificación es correcto
        callback({ error: true, message: "Este código es incorrecto" }); // Devolviendo un mensaje de error si el código es incorrecto
    } else {
        const nombre = DatosdeUsuario.Nombre;
        const contrasenia = DatosdeUsuario.Contrasenia;
        const celular = DatosdeUsuario.Numero;

        const query = "INSERT INTO usuario (nombre, correo, contrasenia, celular, rol) VALUES (?,?,?,?,2)"; // Consulta SQL para insertar un nuevo usuario en la base de datos
        try {
            conection.query(query, [nombre, correo, contrasenia, celular], (error, result) => {
                if (error) throw error // Manejando errores en la consulta
                else {
                    verification.delete(correo); // Eliminando los datos del usuario del mapa de verificación después de crear el usuario
                    callback({ error: false, message: "Éxito al crear el usuario" }); // Devolviendo un mensaje de éxito
                }
            });
        } catch (err) {
            throw err;
            callback({ error: true, message: "Error al crear el usuario" }); // Manejando errores al crear el usuario
        }
    }
};
UserModel.iniciarSesion = async (req, correo, contrasenia, callback) => {
    conection.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, result) => { // Consulta SQL para obtener los datos del usuario con el correo proporcionado
        if (error) throw error // Manejando errores en la consulta
        else {
            if (result.length == 0 || !(await bcryptjs.compare(contrasenia, result[0].contrasenia))) { // Verificando si el correo y la contraseña son válidos
                callback({ logget: false, message: "Correo y/o contraseña erroneos" }); // Devolviendo un mensaje de error si el correo y/o contraseña son incorrectos
            } else {
                req.session.id_usuario = result[0].id_usuario; // Almacenando el ID de usuario en la sesión
                req.session.usuario_img = result[0].usuario_img; // Almacenando la imagen de usuario en la sesión
                req.session.usuario = result[0].nombre; // Almacenando el nombre de usuario en la sesión
                req.session.tipo_indent = result[0].tipo_identificacion; // Almacenando el tipo de identificación de usuario en la sesión
                req.session.identificacion = result[0].identificacion; // Almacenando la identificación de usuario en la sesión
                req.session.correo = result[0].correo; // Almacenando el correo de usuario en la sesión
                req.session.celular = result[0].celular; // Almacenando el número de celular de usuario en la sesión
                req.session.genero = result[0].genero; // Almacenando el género de usuario en la sesión
                req.session.direccion = result[0].direccion; // Almacenando la dirección de usuario en la sesión
                req.session.telefono = result[0].telefono; // Almacenando el número de teléfono de usuario en la sesión
                req.session.rol = result[0].rol; // Almacenando el rol de usuario en la sesión
                req.session.usuario_img = result[0].usuario_img; // Almacenando la imagen de usuario en la sesión
                callback({ logget: true, message: `Bienvenido de vuelta ${req.session.usuario}` }); // Devolviendo un mensaje de éxito
            }
        }
    })
}

UserModel.renderIndicarCorreoParaRecuperar = async (req) => {
    const correo = req.body.correo; // Obteniendo el correo electrónico proporcionado por el usuario
    const verificationCode = crypto.randomBytes(2).toString('hex'); // Generando un código de recuperación

    verification.set(correo, { // Guardando el correo electrónico y el código de recuperación en el mapa de verificación
        Codigo: verificationCode,
        corr: correo,
    });

    const mailOptions = { // Configuración del correo electrónico de recuperación
        from: process.env.MAILER_MAIL,
        to: correo,
        subject: 'Código de recuperacion',
        text: `Tu código de recuperacion es: ${verificationCode}.`,
    };

    global.transporter.sendMail(mailOptions, (error, info) => { // Enviando el correo electrónico de recuperación
        if (error) {
            console.error(error); // Manejando errores al enviar el correo electrónico
        } else {
            console.log('Correo de recuperacion enviado: ' + info.response);
        }
    });
}

UserModel.actualizarContraseniaOlvidada = async (req, codigo, correo, contrasenia_1, contrasenia_2, callback) => {
    if (contrasenia_1 === contrasenia_2) { // Verificando si las contraseñas coinciden
        const DatosdeUsuario = verification.get(correo); // Obteniendo los datos del usuario desde el mapa de verificación
        if (!DatosdeUsuario || DatosdeUsuario.Codigo !== codigo) { // Verificando si el código de recuperación es correcto
            callback({ error: true, message: "Este código es incorrecto" }); // Devolviendo un mensaje de error si el código es incorrecto
        } else {
            const contrasenia = await bcryptjs.hash(contrasenia_1, 8); // Generando el hash de la nueva contraseña

            const query = "UPDATE usuario SET contrasenia = ? WHERE correo = ?"; // Consulta SQL para actualizar la contraseña en la base de datos
            try {
                conection.query(query, [contrasenia, correo], (error, result) => {
                    if (error) throw error // Manejando errores en la consulta
                    else {
                        verification.delete(correo); // Eliminando los datos del usuario del mapa de verificación después de actualizar la contraseña
                        callback({ error: false, message: "Éxito al actualizar la contraseña" }); // Devolviendo un mensaje de éxito
                    }
                });
            } catch (err) {
                throw err;
                callback({ error: true, message: "Error al actualizar la contraseña" }); // Manejando errores al actualizar la contraseña
            }
        }
    } else {
        callback({ error: true, message: "Las Contraseñas No Coinsiden" }); // Devolviendo un mensaje de error si las contraseñas no coinciden
    }
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * ventas * */

const ventasModel = {};

ventasModel.publicarVenta = async (req, nombre, categoria, descripcion, dimenciones, stock, precio, callback) => {
    if (req.file) { // Verificando si se cargó una imagen
        shar(req.file.buffer) // Redimensionando la imagen
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO producto (id_usuario, nombre, id_categoria, imagen_producto, descripcion, dimensiones, stock, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                conection.query(query, [req.session.id_usuario, nombre, categoria, imagenRedimensionada, descripcion, dimenciones, stock, precio], async (error, result, fields) => {
                    if (error) {
                        console.error('Error al guardar el producto:', error); // Manejando errores al guardar el producto
                        callback({ valid: false, message: `Error al guardar el producto: ${error}` }); // Devolviendo un mensaje de error
                    } else {
                        console.log('producto guardado en la base de datos.'); // Registrando el éxito al guardar el producto en la consola
                        callback({ valid: true, message: `producto guardado en la base de datos.` }); // Devolviendo un mensaje de éxito
                    }
                });
            })
            .catch((error) => {
                console.error('Error al redimensionar la imagen:', error); // Manejando errores al redimensionar la imagen
                callback({ valid: false, message: `Error al redimensionar la imagen: ${error}` }); // Devolviendo un mensaje de error
            });
    } else {
        callback({ valid: false, message: `No se cargó una imagen` }); // Devolviendo un mensaje de error si no se cargó una imagen
    }
}

/* * ---------------------------------------------------------------------------------------------------------- * */

/* * adopciones * */

const adopcionesModel = {};

// Función para obtener información de razas y especies de mascotas
adopcionesModel.getInfoRazaEspecieMascota = async (callback) => {
    const query = 'SELECT idmascota_raza as id, raza, especie from mascota_raza ORDER  BY raza ASC';
    conection.query(query, (error, result) => {
        if (error) {
            callback({ error: true, message: "Error en la consulta de la Base De datos" });
        } else {
            callback({ error: false, result: result });
        }
    });
};

// Función para registrar una mascota
adopcionesModel.registrarmascota = async (req, callback) => {
    const { Nombre, Edad, Especie, Raza, Sexo, Personalidad, Historia, C_Ninos, C_Animales, Requisitos } = req.body;
    const id_usuario = req.session.id_usuario;

    if (req.files) { // Verificando si se cargaron archivos
        const images = [];
        const totalImages = req.files.length;

        // Procesamiento de cada imagen
        const imagePromises = req.files.map(async (file) => {
            const imagenRedimensionada = await shar(file.buffer)
                .resize({ height: 200, fit: shar.fit.contain })
                .toBuffer();
            images.push(imagenRedimensionada);
        });

        try {
            await Promise.all(imagePromises); // Esperar a que se redimensionen todas las imágenes

            const query = "INSERT INTO mascota (nombre, edad, especie, raza, sexo, usuario_mascota, personalidad, historia, comportamiento_niños, comportamiento_animales, requisitos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            conection.query(query, [Nombre, Edad, Especie, Raza, Sexo, id_usuario, Personalidad, Historia, C_Ninos, C_Animales, Requisitos], async (error, result, fields) => {
                if (!error) {
                    const lastInsertedId = result.insertId;

                    // Procesamiento de cada imagen insertándolas en la base de datos
                    const insertImagePromises = images.map(async (imagen) => {
                        const imageQuery = "INSERT INTO mascota_imagenes (idmascota, imagen) VALUES (?, ?)";
                        return new Promise((resolve, reject) => {
                            conection.query(imageQuery, [lastInsertedId, imagen], (error, result, fields) => {
                                if (!error) {
                                    resolve('Imagen registrada');
                                } else {
                                    reject(`Error al registrar la imagen: ${error}`);
                                }
                            });
                        });
                    });

                    try {
                        await Promise.all(insertImagePromises); // Esperar a que se registren todas las imágenes
                        callback({ error: null, message: 'Mascota y sus imágenes registradas con éxito' });
                    } catch (error) {
                        callback({ error: true, message: `Error al registrar imágenes: ${error}` });
                    }
                } else {
                    callback({ error: true, message: `Error al registrar la mascota: ${error}` });
                }
            });
        } catch (error) {
            callback({ error: true, message: `Error al redimensionar imágenes: ${error}` });
        }
    } else {
        callback({ error: true, message: 'Hay problemas con las imágenes' });
    }
};
const adopcionesModel = {};

// Función para renderizar las mascotas según diferentes filtros y categorías
adopcionesModel.rendermascotas = async (categoria, filtro, pagina, callback) => {
    let query = '';
    let params = [pagina * 10, 10];
    switch (categoria) {
        case 'TODO':
            query = `SELECT mascota.id_mascota, mascota.nombre, mascota.sexo, mascota_especie.nombre AS especie, mascota_raza.raza, mascota.edad, MAX(mascota_imagenes.imagen) AS imagen FROM mascota JOIN mascota_especie ON mascota.especie = mascota_especie.id_especie JOIN mascota_raza ON mascota.raza = mascota_raza.idmascota_raza LEFT JOIN mascota_imagenes ON mascota_imagenes.idmascota = mascota.id_mascota GROUP BY mascota.id_mascota LIMIT ?, ?`;
            break;

        case 'Especie':
            query = `SELECT mascota.id_mascota, mascota.nombre, mascota.sexo, mascota_especie.nombre AS especie, mascota_raza.raza, mascota.edad, MAX(mascota_imagenes.imagen) AS imagen FROM mascota JOIN mascota_especie ON mascota.especie = mascota_especie.id_especie JOIN mascota_raza ON mascota.raza = mascota_raza.idmascota_raza LEFT JOIN mascota_imagenes ON mascota_imagenes.idmascota = mascota.id_mascota WHERE mascota.especie = ? GROUP BY mascota.id_mascota LIMIT ?, ?`;
            params.unshift(filtro);
            break;

        case 'Raza':
            query = `SELECT mascota.id_mascota, mascota.nombre, mascota.sexo, mascota_especie.nombre AS especie, mascota_raza.raza, mascota.edad, MAX(mascota_imagenes.imagen) AS imagen FROM mascota JOIN mascota_especie ON mascota.especie = mascota_especie.id_especie JOIN mascota_raza ON mascota.raza = mascota_raza.idmascota_raza LEFT JOIN mascota_imagenes ON mascota_imagenes.idmascota = mascota.id_mascota WHERE mascota.raza = ? GROUP BY mascota.id_mascota LIMIT ?, ?`;
            params.unshift(filtro);
            break;

        case 'Edad':
            query = `SELECT mascota.id_mascota, mascota.nombre, mascota.sexo, mascota_especie.nombre AS especie, mascota_raza.raza, mascota.edad, MAX(mascota_imagenes.imagen) AS imagen FROM mascota JOIN mascota_especie ON mascota.especie = mascota_especie.id_especie JOIN mascota_raza ON mascota.raza = mascota_raza.idmascota_raza LEFT JOIN mascota_imagenes ON mascota_imagenes.idmascota = mascota.id_mascota WHERE mascota.edad <= ? GROUP BY mascota.id_mascota LIMIT ?, ?`;
            params.unshift(filtro);
            break;
    }

    conection.query(query, params, async (error, result, fields) => {
        if (error) {
            console.log(error);
            callback({ error: true, message: `Error en la consulta: ${error}` });
        } else {
            callback({ error: false, result: result });
        }
    });
};

// Función para obtener información detallada de una mascota
adopcionesModel.verInfoAvanzada = async (req, callback) => {
    const idmascota = req.params.idmascota;
    const query = 'SELECT mascota.usuario_mascota as idDueno, mascota.nombre as Nombre, mascota_especie.nombre as Especie, mascota_raza.raza as Raza, mascota.edad as Edad, mascota.sexo as Sexo, mascota.personalidad as Personalidad, mascota.historia as Historia, mascota.comportamiento_niños as C_Ninos, mascota.comportamiento_animales as C_Animales, mascota.requisitos as Requisitos FROM mascota JOIN mascota_especie ON mascota.especie = mascota_especie.id_especie JOIN mascota_raza ON mascota.raza = mascota_raza.idmascota_raza WHERE mascota.id_mascota = ?';

    conection.query(query, idmascota, async (error, result, fields) => {
        if (error) {
            callback({ error: true, message: `Error en la consulta de información: ${error}` });
            console.log(error);
        } else {
            const mascota = result;
            const query = 'SELECT mascota_imagenes.imagen FROM mascota_imagenes WHERE mascota_imagenes.idmascota = ?';
            conection.query(query, idmascota, async (error, result, fields) => {
                if (error) {
                    callback({ error: true, message: `Error en la consulta de imágenes: ${error}` });
                    console.log(error);
                } else {
                    const imagenes = result;
                    callback({ error: false, mascota: mascota, imagenes: imagenes });
                }
            });
        }
    });
};
adopcionesModel.adoptar = async (req, callback) => {
    // Obtener los parámetros necesarios
    const idmascota = req.params.idmascota;
    const iddueno = req.params.iddueno;

    // Obtener la información del usuario actual
    const usuario_correo = req.session.correo;
    const usuario_celular = req.session.celular;

    // Consultar la información del dueño de la mascota
    const query = 'SELECT correo, nombre FROM usuario WHERE id_usuario = ?';
    conection.query(query, iddueno, async (error, result) => {
        if (error) {
            // Manejar errores en la consulta
            callback({ error: true, message: `Error en la consulta de imágenes: ${error}` });
            console.log(error);
        } else {
            // Destinatario del correo (dueño de la mascota)
            const destino = result[0].correo;
            // Configurar el contenido del correo
            const mailOptions = {
                from: process.env.MAILER_MAIL,
                to: destino,
                subject: 'Alguien quiere adoptar a tu mascota',
                text: `Hola ${result[0].nombre},\n\nParece que alguien está interesado en adoptar a tu mascota. Por favor, contáctate con él o ella al siguiente correo: ${usuario_correo}\n\nTambién puedes comunicarte a través de WhatsApp haciendo clic en el siguiente enlace: https://api.whatsapp.com/send?phone=${usuario_celular}\n\nAtentamente,\nEnjoyYourPet Team`,
            };
            // Enviar el correo electrónico
            global.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    // Manejar errores al enviar el correo
                    console.error(error);
                    callback({ error: true, message: `Error al enviar el correo: ${error}` });
                } else {
                    // Confirmar el envío exitoso
                    console.log('Correo de información enviado: ' + info.response);
                    callback({ error: false });
                }
            });
        }
    });
};

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

module.exports = {
    // Modelos relacionados con la cuenta de usuario
    acountModel,

    // Modelos relacionados con el entrenamiento
    entrenamientoModel,

    // Función para obtener los datos de la sesión del usuario
    getData,

    // Modelos relacionados con los productos
    productosModel,

    // Modelos relacionados con el usuario
    UserModel,

    // Modelos relacionados con las ventas
    ventasModel,

    // Modelos relacionados con las adopciones de mascotas
    adopcionesModel
};

