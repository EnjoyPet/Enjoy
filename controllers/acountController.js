const acountModel = require('../models/acountModel');
const indexModel = require('../models/indexModel');


const acountController = {};

acountController.renderAcountInfo = async (req, res) =>{
    if(req.session.usuario != null){
    acountModel.getData(req,(result)=>{
        const data = result[0];
        res.render('acount',{ data })
    });
    }else
        res.redirect('/');
} 

acountController.renderActializacionForm = async (req, res) =>{
    const objetivo = 'actualizar_'+req.params.objetivo;
    const data = indexModel.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:objetivo, data })
    else
        res.redirect('/');
}

acountController.actualizarCorreo = async (req, res) =>{
    const correo = req.body.correo;
    acountModel.actualizarCorreo(req,correo, (result) => {
        if(!result.isValid){
            res.send(result.message);
        }
    });
}

acountController.verificarCodigo = async (req,res)=>{
    const { correo, codigo } = req.body;
    acountModel.verificarCodigo(correo,codigo,(result)=>{
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
    acountModel.actualizarDatos(req,'direccion',direccion,(result)=>{
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
    acountModel.actualizarDatos(req,'nombre',nombre,(result)=>{
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
    acountModel.actualizarContrasenia(req,ant_contrasenia,Nuev_contrasenia,Nuev_contrasenia_2,(result)=>{
        if(!result.valid)
            res.send(result.message);
        else{
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarCelular = async (req,res)=>{
    const celular = req.body.celular;
    acountModel.actualizarDatos(req,'celular',celular,(result)=>{
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
    acountModel.actualizarDatos(req,'identificacion',identificacion,(result)=>{
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
    acountModel.actualizarDatos(req,"telefono",telefono,(result)=>{
        if(result.error)
            res.send(result.message);
        else{
            req.session.telefono = telefono;
            res.redirect('/usuario/informacion');
        }
    });
};

acountController.actualizarImagen = async (req,res)=>{
    acountModel.actualizarImagen(req,(result)=>{
        if(!result.valid){
            res.send(result.message);
        }else{
            res.redirect('/usuario/informacion');
        }
    });
}

acountController.eliminarImagen = async (req,res)=>{
    acountModel.eliminarImagen(req,(result)=>{
        if(!result.valid){
            res.send(result.message);
        }else{
            res.redirect('/usuario/informacion');
        }
    });
}

acountController.renderizarCarrito = async (req,res)=>{
    if(req.session.usuario != null && req.session.direccion != null){
        acountModel.renderizarCarrito(req,(result)=>{
            const data = indexModel.getData(req);
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
        acountModel.renderizarProductos(req,(result)=>{
            const data = indexModel.getData(req);
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
    const data = indexModel.getData(req);
    res.render('mensajes',{data, header:'PRONTO LO TENDRAS',body:'La función a la que estás intentando acceder actualmente se encuentra en desarrollo y estamos trabajando arduamente para perfeccionarla. Pronto estará disponible para tu uso y disfrute. Agradecemos profundamente tu paciencia y comprensión mientras trabajamos para brindarte una experiencia excepcional. Tu interés y apoyo son muy importantes para nosotros, y estamos ansiosos por ofrecerte una solución de alta calidad en un futuro cercano. ¡Gracias por ser parte de nuestro viaje de desarrollo!'})
}

module.exports = acountController;