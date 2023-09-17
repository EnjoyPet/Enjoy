const models = require("./models.js");

/* Acount Contoller */

const acountController = {};

acountController.renderAcountInfo = async (req, res) =>{
    if(req.session.usuario != null){
    models.acountModel.getData(req,(result)=>{
        const data = result[0];
        res.render('acount',{ data })
    });
    }else
        res.redirect('/');
} 

acountController.renderActializacionForm = async (req, res) =>{
    const objetivo = 'actualizar_'+req.params.objetivo;
    const data = models.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:objetivo, data })
    else
        res.redirect('/');
}

acountController.actualizarCorreo = async (req, res) =>{
    const correo = req.body.correo;
    models.acountModel.actualizarCorreo(req,correo, (result) => {
        if(!result.isValid){
            res.send(result.message);
        }
    });
}

acountController.verificarCodigo = async (req,res)=>{
    const { correo, codigo } = req.body;
    models.acountModel.verificarCodigo(correo,codigo,(result)=>{
        if(result.error){
            res.send(result.message);
        }else{
            req.session.correo = correo;
            res.redirect('/usuario/informacion');
        }
    })
}

acountController.actualizarDireccion = async (req,res)=>{
    const direccion = req.body.direccion;
    models.acountModel.actualizarDatos(req,'direccion',direccion,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.direccion = direccion;
            res.redirect('/usuario/informacion');
        }
    });
}

acountController.actualizarNombre = async (req,res)=>{
    const nombre = req.body.nombre;
    models.acountModel.actualizarDatos(req,'nombre',nombre,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.usuario = nombre;
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarContrasenia = async (req,res)=>{
    const {ant_contrasenia,Nuev_contrasenia,Nuev_contrasenia_2}=req.body;
    models.acountModel.actualizarContrasenia(req,ant_contrasenia,Nuev_contrasenia,Nuev_contrasenia_2,(result)=>{
        if(!result.valid)
            res.send(result.message);
        else{
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarCelular = async (req,res)=>{
    const celular = req.body.celular;
    models.acountModel.actualizarDatos(req,'celular',celular,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.celular = celular;
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarIdentificacion = async (req,res)=>{
    const identificacion = req.body.identificacion;
    models.acountModel.actualizarDatos(req,'identificacion',identificacion,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.identificacion = identificacion;
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarTelefono = async (req,res)=>{
    const telefono = req.body.telefono;
    models.acountModel.actualizarDatos(req,"telefono",telefono,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.telefono = telefono;
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarImagen = async (req,res)=>{
    models.acountModel.actualizarImagen(req,(result)=>{
        if(!result.valid){
            res.send(result.message);
        }else{
            res.redirect('/usuario/informacion');
        }
    });
}

acountController.eliminarImagen = async (req,res)=>{
    models.acountModel.eliminarImagen(req,(result)=>{
        if(!result.valid){
            res.send(result.message);
        }else{
            res.redirect('/usuario/informacion');
        }
    });
}

acountController.renderizarCarrito = async (req,res)=>{
    if(req.session.usuario != null && req.session.direccion != null){
        models.acountModel.renderizarCarrito(req,(result)=>{
            const data = models.getData(req);
            if(!result.valid){
                res.send(result.message);
            }else{
                res.render('carrito',{data, carrito:result.carrito});
            }
        })
    }else{
        res.redirect('/');
    }
}

acountController.renderizarProductos = async (req,res)=>{
    if(req.session.usuario != null && req.session.direccion != null){
        models.acountModel.renderizarProductos(req,(result)=>{
            const data = models.getData(req);
            if(!result.valid){
                res.send(result.message);
            }else{
                res.render('usuarioProductos',{data, productos:result.productos});
            }
        })
    }else{
        res.redirect('/');
    }
}




acountController.mostrarMensaje = async (req,res)=>{
    const data = models.getData(req);
    res.render('mensajes',{data, header:'PRONTO LO TENDRAS',body:'La función a la que estás intentando acceder actualmente se encuentra en desarrollo y estamos trabajando arduamente para perfeccionarla. Pronto estará disponible para tu uso y disfrute. Agradecemos profundamente tu paciencia y comprensión mientras trabajamos para brindarte una experiencia excepcional. Tu interés y apoyo son muy importantes para nosotros, y estamos ansiosos por ofrecerte una solución de alta calidad en un futuro cercano. ¡Gracias por ser parte de nuestro viaje de desarrollo!'})
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * entrenamiento * */

const entrenamientoController = {};

entrenamientoController.renderensenarForm = async (req, res) =>{
    const data = models.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:'ensenar', data })
    else
        res.redirect('/cuenta/iniciar-sesion');
}

entrenamientoController.renderAprender = async (req, res) =>{
    const data = models.getData(req);
    models.entrenamientoModel.renderAprender((result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            res.render('aprender',{data,posts:result.posts});
        }
    });
}

entrenamientoController.hacerPost = async (req,res) =>{
  const { titulo, contenido_post, Categoria_post } = req.body;
  
  models.entrenamientoModel.hacerPost(req,titulo,contenido_post,Categoria_post, (result)=>{
    if(!result.valid){
        console.error(result.message);
        res.send(result.message);
    }else{
        res.redirect('/entrenamiento/aprender');
    }
  })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * index * */

const getIndex = (req, res) => {
    const data = models.getData(req);
  
    if(data.usuario != null && data.direccion == null)
    res.redirect('/usuario/informacion');
    else
    res.render('index', { data });
  };

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * productos * */

const productosController = {};

productosController.renderProductos = async (req,res)=>{
    const categoria = req.params.categoria;
    const pagina = req.params.pagina;
    const data = models.getData(req);
    models.productosModel.renderProductos(categoria,pagina,(result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            res.render('productos',{
                data,
                pagina,
                categoria,
                productos:result.productos
            })
        }
    })
}

productosController.renderInfoProducto = async (req,res)=>{
    const id_producto = req.params.id_producto;
    const data = models.getData(req);
    models.productosModel.renderInfoProducto(id_producto,(result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            res.render('productoInfo',{
                data,
                producto:result.producto
            });
        }
    });
}

productosController.comprarProducto = async (req,res)=>{
    const id_producto = req.params.id_producto;
    const data = models.getData(req);
    if(data.direccion != null){
        models.productosModel.comprarProducto(req,id_producto,(result)=>{
            if(!result.valid){
                console.error(result.message);
                res.send(result.message);
            }else{
                res.render('mensajes',{
                    data,
                    header: result.header,
                    body: result.body
                });
            }
        });
    }else{
        res.redirect('/');
    }
}

productosController.productoAlCarro = async (req,res)=>{
    const id_producto = req.params.id_producto;
    models.productosModel.productoAlCarro(req,id_producto,(result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            const link=`/usuario/carrito`;
            res.redirect(link);
        }
    });
}

productosController.comprarCarrito = async (req,res) =>{
    const id_producto = req.params.id_producto;
    const id_carrito = req.params.id_carrito;
    models.productosModel.comprarCarrito(req,id_carrito,id_producto,(result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            const link=`/usuario/carrito`;
            res.redirect(link);
        }
    });
}

productosController.eliminarCarrito = async (req,res) =>{
    const id_carrito = req.params.id_carrito;
    if(req.session.usuario != null){
        models.productosModel.eliminarCarrito(id_carrito,(result)=>{
            if(!result.valid){
                console.error(result.message);
                res.send(result.message);
            }else{
                const link=`/usuario/carrito`;
                res.redirect(link);
            }
        });
    }else{
        res.redirect('/');
    }
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * users * */

const UserController = {};

UserController.rederizarformderegistro = (req, res) => {
  if (req.session.usuario)
    res.redirect("/");
  else{
    const data = models.getData(req);
    res.render("sessionform", { tipo: "registro", data });
  }
};
UserController.rederizarformdeinicio = (req, res) => {
  if (req.session.usuario)
    res.redirect("/");
  else{
    const data = models.getData(req);
    res.render("sessionform", { tipo: "inicio", data });
  }
};

UserController.registrarUsuario = async (req, res) => {
  const { nombre, correo, numero, contrasenia } = req.body;
    const data = models.getData(req);

  try {
    await models.UserModel.comprobarCorreo(correo, async (correoResult) => {
      if (!correoResult.isValid) {
        res.send(correoResult.message);
      } else if (correoResult.result.length == 0) {
        const verificationCode = await models.UserModel.registrarUsuario(nombre, correo, numero, contrasenia);
        console.log("Código de verificación generado:", verificationCode);
        res.render("sessionform",{data,tipo:"verificarCodigo",correo:correo})
      } else {
        console.log(correoResult.result)
        res.send("Este correo ya está registrado");
      }
    });
  } catch (error) {
    res.send("Error en el registro: " + error);
  }
};

UserController.verificarCorreo = async (req, res) => {
  const { correo, codigo } = req.body;

  models.UserModel.verificarCodigo(correo, codigo, (result) => {
    if (result.error) {
      res.send(result.message);
    } else {
      res.redirect('/cuenta/iniciar-sesion');
    }
  });
};

UserController.iniciarSesion = async (req, res) => {
  const { correo, contrasenia } = req.body;
  models.UserModel.iniciarSesion(req,correo,contrasenia, (result)=>{
    if(result.logget){
      res.redirect("/");
    }else{
      res.send(result.message);
    }
  })
}

UserController.cerrarSesion = async (req,res) => {
    req.session.destroy();
    res.redirect("/");
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

/* * ventas * */

const ventasController = {};

ventasController.renderVentasForm = async (req, res) =>{
    const data = models.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:'ventas', data })
    else
        res.redirect('/cuenta/iniciar-sesion');
}

ventasController.publicarVenta = async (req,res) =>{
  const { nombre, descripcion, stock, precio, dimenciones, Categoria } = req.body;
  
  models.ventasModel.publicarVenta(req,nombre,Categoria,descripcion,dimenciones,stock,precio,(result)=>{
    if(!result.valid){
        console.error(result.message);
        res.send(result.message);
    }else{
        res.redirect('/vender');
    }
  })
}

/* *----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------* */

module.exports = {acountController,entrenamientoController,getIndex,productosController,UserController,ventasController}