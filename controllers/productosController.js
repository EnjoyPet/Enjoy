const productosModel = require('../models/productosModel');
const indexModel = require('../models/indexModel');

const productosController = {};

productosController.renderProductos = async (req,res)=>{
    const categoria = req.params.categoria;
    const pagina = req.params.pagina;
    const data = indexModel.getData(req);
    productosModel.renderProductos(categoria,pagina,(result)=>{
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
    const data = indexModel.getData(req);
    productosModel.renderInfoProducto(id_producto,(result)=>{
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
    const data = indexModel.getData(req);
    if(data.direccion != null){
        productosModel.comprarProducto(req,id_producto,(result)=>{
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
    productosModel.productoAlCarro(req,id_producto,(result)=>{
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
    productosModel.comprarCarrito(req,id_carrito,id_producto,(result)=>{
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
        productosModel.eliminarCarrito(id_carrito,(result)=>{
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

module.exports = productosController;