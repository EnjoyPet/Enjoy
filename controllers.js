// trae los metodos de los modelos para su posterior uso
const models = require("./models.js");

/* Controlador de Cuenta */

const acountController = {};

// Método para renderizar la información de la cuenta del usuario
acountController.renderAcountInfo = async (req, res) => {
    // Verifica si el usuario está autenticado
    if (req.session.usuario != null) {
        // Obtiene los datos de la cuenta del usuario
        models.acountModel.getData(req, (result) => {
            const data = result[0];
            // Renderiza la vista 'acount' con los datos obtenidos
            res.render('acount', { data });
        });
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para renderizar el formulario de actualización de información
acountController.renderActializacionForm = async (req, res) => {
    const objetivo = 'actualizar_' + req.params.objetivo;
    // Obtiene los datos del usuario
    const data = models.getData(req);
    if (data.usuario != null) {
        // Renderiza el formulario de actualización de sesión con los datos obtenidos
        res.render('sessionform', { tipo: objetivo, data });
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para actualizar el correo electrónico del usuario
acountController.actualizarCorreo = async (req, res) => {
    const correo = req.body.correo;
    // Llama al método correspondiente del modelo para actualizar el correo electrónico
    models.acountModel.actualizarCorreo(req, correo, (result) => {
        if (!result.isValid) {
            res.send(result.message);
        }
    });
}

// Método para verificar el código de verificación enviado al correo electrónico
acountController.verificarCodigo = async (req, res) => {
    const { correo, codigo } = req.body;
    // Llama al método correspondiente del modelo para verificar el código
    models.acountModel.verificarCodigo(correo, codigo, (result) => {
        if (result.error) {
            res.send(result.message);
        } else {
            req.session.correo = correo;
            res.redirect('/usuario/informacion');
        }
    })
}

// Método para actualizar la dirección del usuario
acountController.actualizarDireccion = async (req, res) => {
    const direccion = req.body.direccion;
    // Llama al método correspondiente del modelo para actualizar la dirección
    models.acountModel.actualizarDatos(req, 'direccion', direccion, (result) => {
        if (result.error)
            res.send(result.message);
        else {
            req.session.direccion = direccion;
            res.redirect('/usuario/informacion');
        }
    });
}

// Método para actualizar el nombre del usuario
acountController.actualizarNombre = async (req, res) => {
    const nombre = req.body.nombre;
    // Llama al método correspondiente del modelo para actualizar el nombre
    models.acountModel.actualizarDatos(req, 'nombre', nombre, (result) => {
        if (result.error)
            res.send(result.message);
        else {
            req.session.usuario = nombre;
            res.redirect('/usuario/informacion');
        }
    });
};

// Método para actualizar la contraseña del usuario
acountController.actualizarContrasenia = async (req, res) => {
    const { ant_contrasenia, Nuev_contrasenia, Nuev_contrasenia_2 } = req.body;
    // Llama al método correspondiente del modelo para actualizar la contraseña
    models.acountModel.actualizarContrasenia(req, ant_contrasenia, Nuev_contrasenia, Nuev_contrasenia_2, (result) => {
        if (!result.valid)
            res.send(result.message);
        else {
            res.redirect('/usuario/informacion');
        }
    });
};

// Método para actualizar el celular del usuario
acountController.actualizarCelular = async (req, res) => {
    const celular = req.body.celular;
    // Llama al método correspondiente del modelo para actualizar el celular
    models.acountModel.actualizarDatos(req, 'celular', celular, (result) => {
        if (result.error)
            res.send(result.message);
        else {
            req.session.celular = celular;
            res.redirect('/usuario/informacion');
        }
    });
};

// Método para actualizar la identificacion del usuario
acountController.actualizarIdentificacion = async (req, res) => {
    const identificacion = req.body.identificacion;
    // Llama al método correspondiente del modelo para actualizar la identificación
    models.acountModel.actualizarDatos(req, 'identificacion', identificacion, (result) => {
        if (result.error)
            res.send(result.message);
        else {
            req.session.identificacion = identificacion;
            res.redirect('/usuario/informacion');
        }
    });
};

// Método para actualizar el telefono del usuario
acountController.actualizarTelefono = async (req, res) => {
    const telefono = req.body.telefono;
    // Llama al método correspondiente del modelo para actualizar el teléfono
    models.acountModel.actualizarDatos(req, "telefono", telefono, (result) => {
        if (result.error)
            res.send(result.message);
        else {
            req.session.telefono = telefono;
            res.redirect('/usuario/informacion');
        }
    });
};

// Método para actualizar la imagen del usuario
acountController.actualizarImagen = async (req, res) => {
    // Llama al método correspondiente del modelo para actualizar la imagen
    models.acountModel.actualizarImagen(req, (result) => {
        if (!result.valid) {
            res.send(result.message);
        } else {
            res.redirect('/usuario/informacion');
        }
    });
}

// Método para eliminar la imagen del usuario
acountController.eliminarImagen = async (req, res) => {
    // Llama al método correspondiente del modelo para eliminar la imagen
    models.acountModel.eliminarImagen(req, (result) => {
        if (!result.valid) {
            res.send(result.message);
        } else {
            res.redirect('/usuario/informacion');
        }
    });
}

// Método para renderizar el carrito del usuario
acountController.renderizarCarrito = async (req, res) => {
    // Verifica si el usuario está autenticado y tiene una dirección
    if (req.session.usuario != null && req.session.direccion != null) {
        // Renderiza el carrito de compras del usuario
        models.acountModel.renderizarCarrito(req, (result) => {
            const data = models.getData(req);
            if (!result.valid) {
                res.send(result.message);
            } else {
                res.render('carrito', { data, carrito: result.carrito });
            }
        })
    } else {
        // Si el usuario no está autenticado o no tiene una dirección, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para renderizar los productos
acountController.renderizarProductos = async (req, res) => {
    // Verifica si el usuario está autenticado y tiene una dirección
    if (req.session.usuario != null && req.session.direccion != null) {
        // Renderiza los productos del usuario
        models.acountModel.renderizarProductos(req, (result) => {
            const data = models.getData(req);
            if (!result.valid) {
                res.send(result.message);
            } else {
                res.render('usuarioProductos', { data, productos: result.productos });
            }
        })
    } else {
        // Si el usuario no está autenticado o no tiene una dirección, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para renderizar mensage de placeholde para vistas en proceso
acountController.mostrarMensaje = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Renderiza un mensaje informativo
    res.render('mensajes', { data, header: 'PRONTO LO TENDRAS', body: 'La función a la que estás intentando acceder actualmente se encuentra en desarrollo y estamos trabajando arduamente para perfeccionarla. Pronto estará disponible para tu uso y disfrute. Agradecemos profundamente tu paciencia y comprensión mientras trabajamos para brindarte una experiencia excepcional. Tu interés y apoyo son muy importantes para nosotros, y estamos ansiosos por ofrecerte una solución de alta calidad en un futuro cercano. ¡Gracias por ser parte de nuestro viaje de desarrollo!' })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * entrenamiento * */
const entrenamientoController = {};

// Método para renderizar el formulario de enseñar
entrenamientoController.renderensenarForm = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    if (data.usuario != null)
        // Renderiza el formulario de sesión con el tipo 'ensenar' y los datos obtenidos
        res.render('sessionform', { tipo: 'ensenar', data })
    else
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        res.redirect('/cuenta/iniciar-sesion');
}

// Método para renderizar la página de aprendizaje
entrenamientoController.renderAprender = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Renderiza la página de aprender
    models.entrenamientoModel.renderAprender((result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            res.render('aprender', { data, posts: result.posts });
        }
    });
}

// Método para realizar un post en la página de aprendizaje
entrenamientoController.hacerPost = async (req, res) => {
    const { titulo, contenido_post, Categoria_post } = req.body;

    // Llama al método correspondiente del modelo para realizar un post
    models.entrenamientoModel.hacerPost(req, titulo, contenido_post, Categoria_post, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            res.redirect('/entrenamiento/aprender');
        }
    })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * index * */

// Función para obtener el índice (página de inicio)
const getIndex = (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);

    // Verifica si el usuario está autenticado y no tiene dirección
    if (data.usuario != null && data.direccion == null)
        // Redirige a la página de información del usuario
        res.redirect('/usuario/informacion');
    else
        // Renderiza la página de inicio con los datos obtenidos
        res.render('index', { data });
};

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * productos * */
const productosController = {};

// Método para renderizar la página de productos
productosController.renderProductos = async (req, res) => {
    const categoria = req.params.categoria;
    const pagina = req.params.pagina;
    const data = models.getData(req);
    // Renderiza la página de productos con la categoría y la página especificadas
    models.productosModel.renderProductos(categoria, pagina, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            res.render('productos', {
                data,
                pagina,
                categoria,
                productos: result.productos
            })
        }
    })
}

// Método para renderizar la información de un producto específico
productosController.renderInfoProducto = async (req, res) => {
    const id_producto = req.params.id_producto;
    const data = models.getData(req);
    // Renderiza la información del producto con el ID especificado
    models.productosModel.renderInfoProducto(id_producto, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            res.render('productoInfo', {
                data,
                producto: result.producto
            });
        }
    });
}

// Método para comprar un producto específico
productosController.comprarProducto = async (req, res) => {
    const id_producto = req.params.id_producto;
    const data = models.getData(req);
    // Verifica si el usuario tiene una dirección
    if (data.direccion != null) {
        // Realiza la compra del producto con el ID especificado
        models.productosModel.comprarProducto(req, id_producto, (result) => {
            if (!result.valid) {
                console.error(result.message);
                res.send(result.message);
            } else {
                res.render('mensajes', {
                    data,
                    header: result.header,
                    body: result.body
                });
            }
        });
    } else {
        // Si el usuario no tiene una dirección, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para agregar un producto al carrito
productosController.productoAlCarro = async (req, res) => {
    const id_producto = req.params.id_producto;
    // Agrega el producto con el ID especificado al carrito
    models.productosModel.productoAlCarro(req, id_producto, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            // Redirige a la página del carrito de compras del usuario
            const link = `/usuario/carrito`;
            res.redirect(link);
        }
    });
}

// Método para comprar los productos en el carrito
productosController.comprarCarrito = async (req, res) => {
    const id_producto = req.params.id_producto;
    const id_carrito = req.params.id_carrito;
    // Realiza la compra de los productos en el carrito con los IDs especificados
    models.productosModel.comprarCarrito(req, id_carrito, id_producto, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            // Redirige a la página del carrito de compras del usuario
            const link = `/usuario/carrito`;
            res.redirect(link);
        }
    });
}

// Método para eliminar un producto del carrito
productosController.eliminarCarrito = async (req, res) => {
    const id_carrito = req.params.id_carrito;
    // Verifica si el usuario está autenticado
    if (req.session.usuario != null) {
        // Elimina el producto del carrito con el ID especificado
        models.productosModel.eliminarCarrito(id_carrito, (result) => {
            if (!result.valid) {
                console.error(result.message);
                res.send(result.message);
            } else {
                // Redirige a la página del carrito de compras del usuario
                const link = `/usuario/carrito`;
                res.redirect(link);
            }
        });
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio
        res.redirect('/');
    }
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * users * */
const UserController = {};

// Método para renderizar el formulario de registro
UserController.rederizarformderegistro = (req, res) => {
    // Verifica si el usuario está autenticado
    if (req.session.usuario)
        // Si el usuario está autenticado, redirige a la página de inicio
        res.redirect("/");
    else {
        // Obtiene los datos del usuario
        const data = models.getData(req);
        // Renderiza el formulario de sesión con el tipo 'registro' y los datos obtenidos
        res.render("sessionform", { tipo: "registro", data });
    }
};

// Método para renderizar el formulario de inicio de sesión
UserController.rederizarformdeinicio = (req, res) => {
    // Verifica si el usuario está autenticado
    if (req.session.usuario)
        // Si el usuario está autenticado, redirige a la página de inicio
        res.redirect("/");
    else {
        // Obtiene los datos del usuario
        const data = models.getData(req);
        // Renderiza el formulario de sesión con el tipo 'inicio' y los datos obtenidos
        res.render("sessionform", { tipo: "inicio", data });
    }
};

// Método para registrar un nuevo usuario
UserController.registrarUsuario = async (req, res) => {
    const { nombre, correo, numero, contrasenia, contrasenia2 } = req.body;
    const data = models.getData(req);

    try {
        // Comprueba si el correo ya está registrado y realiza el registro si es válido
        await models.UserModel.comprobarCorreo(correo, contrasenia, contrasenia2, async (correoResult) => {
            if (!correoResult.isValid) {
                res.send(correoResult.message);
            } else if (correoResult.result.length == 0) {
                const verificationCode = await models.UserModel.registrarUsuario(nombre, correo, numero, contrasenia);
                console.log("Código de verificación generado:", verificationCode);
                res.render("sessionform", { data, tipo: "verificarCodigo", correo: correo })
            } else {
                console.log(correoResult.result)
                res.send("Este correo ya está registrado");
            }
        });
    } catch (error) {
        res.send("Error en el registro: " + error);
    }
};

// Método para verificar el código de verificación enviado al correo electrónico del usuario
UserController.verificarCorreo = async (req, res) => {
    const { correo, codigo } = req.body;
    // Verifica el código de verificación
    models.UserModel.verificarCodigo(correo, codigo, (result) => {
        if (result.error) {
            res.send(result.message);
        } else {
            res.redirect('/cuenta/iniciar-sesion');
        }
    });
};

// Método para iniciar sesión
UserController.iniciarSesion = async (req, res) => {
    const { correo, contrasenia } = req.body;
    // Inicia sesión con el correo electrónico y la contraseña proporcionados
    models.UserModel.iniciarSesion(req, correo, contrasenia, (result) => {
        if (result.logget) {
            res.redirect("/");
        } else {
            res.send(result.message);
        }
    })
}

// Método para cerrar sesión
UserController.cerrarSesion = async (req, res) => {
    // Destruye la sesión del usuario
    req.session.destroy();
    res.redirect("/");
}

// Método para solicitar recuperar la contraseña
UserController.RecuperarContrasenia = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Renderiza el formulario para indicar el correo electrónico para recuperar la contraseña
    res.render('sessionform', { tipo: 'indicarcorreo', data });
}

// Método para renderizar el formulario de verificar código para recuperar contraseña
UserController.renderizarverificarCodContrasenia = async (req, res) => {
    // Renderiza el formulario para verificar el código para recuperar la contraseña
    models.UserModel.renderIndicarCorreoParaRecuperar(req);
    const data = models.getData(req);
    res.render('sessionform', { tipo: 'recuperarcontrasenia', correo: req.body.correo, data });
}

// Método para actualizar la contraseña olvidada
UserController.actualizarContraseniaOlvidada = async (req, res) => {
    const { codigo, correo, Nuev_contrasenia, Nuev_contrasenia_2 } = req.body;
    // Actualiza la contraseña olvidada con el código, correo y nuevas contraseñas proporcionados
    models.UserModel.actualizarContraseniaOlvidada(req, codigo, correo, Nuev_contrasenia, Nuev_contrasenia_2, (result) => {
        if (result.error) {
            console.error(result.message);
            res.send(result.message);
        } else {
            // Obtiene los datos del usuario
            const data = models.getData(req);
            // Renderiza el formulario de inicio de sesión
            res.render('sessionform', { tipo: 'inicio', data });
        }
    });

}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * ventas * */
const ventasController = {};

// Método para renderizar el formulario de ventas
ventasController.renderVentasForm = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Verifica si el usuario está autenticado
    if (data.usuario != null)
        // Renderiza el formulario de sesión con el tipo 'ventas' y los datos obtenidos
        res.render('sessionform', { tipo: 'ventas', data })
    else
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        res.redirect('/cuenta/iniciar-sesion');
}

// Método para publicar una venta
ventasController.publicarVenta = async (req, res) => {
    const { nombre, descripcion, stock, precio, dimenciones, Categoria } = req.body;

    // Publica la venta con los datos proporcionados
    models.ventasModel.publicarVenta(req, nombre, Categoria, descripcion, dimenciones, stock, precio, (result) => {
        if (!result.valid) {
            console.error(result.message);
            res.send(result.message);
        } else {
            // Redirige a la página de venta
            res.redirect('/vender');
        }
    })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * adopciones * */const adopcionesController = {};

// Método para renderizar la página de mascotas en adopción
adopcionesController.rendermascotas = async (req, res) => {
    const categoria = req.params.categoria;
    const filtro = req.params.filtro;
    const pagina = req.params.pagina;

    // Obtiene los datos del usuario
    const data = models.getData(req);

    // Renderiza la página de mascotas en adopción con la categoría, filtro y página especificados
    models.adopcionesModel.rendermascotas(categoria, filtro, pagina, (result) => {
        if (result.error) {
            res.send(result.message);
        } else
            res.render('mascotasEnAdopcion', { data, mascotas: result.result, categoria, filtro, pagina });
    })
}

// Método para renderizar el formulario de registro de mascotas
adopcionesController.rendermascotasform = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Verifica si el usuario está autenticado
    if (data.usuario != null) {
        // Obtiene información sobre la raza y especie de las mascotas
        models.adopcionesModel.getInfoRazaEspecieMascota((result) => {
            if (result.error) {
                res.send(result.message);
            } else {
                console.log(result.result[0])
                res.render('sessionform', { tipo: 'registrarmascota', Info: result.result, data })
            }
        })
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio
        res.redirect('/');
    }
}

// Método para registrar una nueva mascota en adopción
adopcionesController.registrarmascota = async (req, res) => {
    // Registra una nueva mascota en adopción con los datos proporcionados
    models.adopcionesModel.registrarmascota(req, (result) => {
        if (result.error)
            res.send('Error: ' + result.message);
        else
            // Redirige a la página de adopciones de mascotas
            res.redirect('/usuario/adopciones/adoptar/TODO/0/0');

    });
}

// Método para ver la información avanzada de una mascota en adopción
adopcionesController.verInfoAvanzada = async (req, res) => {
    // Obtiene los datos del usuario
    const data = models.getData(req);
    // Verifica si el usuario está autenticado
    if (data.usuario != null)
        // Obtiene la información avanzada de una mascota en adopción con el ID especificado
        models.adopcionesModel.verInfoAvanzada(req, (result) => {
            if (result.error) {
                console.log(result.error);
                res.send(`algo salio mal: ${result.message}`);
            }
            else {
                console.log(result.mascota[0])
                res.render('infoMascotaAvanzada', { data, mascota: result.mascota[0], imagenes: result.imagenes, id: req.params.idmascota })
            }
        })
    else
        // Si el usuario no está autenticado, redirige a la página de inicio
        res.redirect('/');
}

// Método para adoptar una mascota
adopcionesController.adoptar = async (req, res) => {
    // Adopta una mascota con el ID especificado
    models.adopcionesModel.adoptar(req, (result) => {
        if (result.error) {
            console.log(result.error);
            res.send(`algo salio mal: ${result.message}`);
        }
        else {
            // Redirige a la página de inicio
            res.redirect('/')
        }
    })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */
// Exporta los controladores de cuenta, entrenamiento, productos, usuario, ventas y adopciones, así como la función getIndex
module.exports = {
    acountController,  // Controlador de cuenta
    entrenamientoController,  // Controlador de entrenamiento
    getIndex,  // Función para manejar solicitudes de la página principal
    productosController,  // Controlador de productos
    UserController,  // Controlador de usuario
    ventasController,  // Controlador de ventas
    adopcionesController  // Controlador de adopciones
};
