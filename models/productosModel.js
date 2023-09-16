const { query } = require('express');
const conection = require('../config/db');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path'); 
const { error } = require('console');

const productosModel = {};
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS
    }
});

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
            conection.query(query, [id_categoria, pagina*10], (error, result) => {
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos', productos: result });
                }
            });
        } else {
            query = `SELECT * FROM producto WHERE stock > 0 LIMIT ?, 10`;
            conection.query(query, [pagina*10], (error, result) => {
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

productosModel.renderInfoProducto = async (id_producto, callback) =>{
    const query = 'SELECT * FROM producto WHERE id_producto = ?';
    try{
        conection.query(query,[id_producto], (error,result) =>{
            if (error) {
                callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
            } else {
                callback({ valid: true, message: 'Éxito en la consulta de la base de datos', producto: result[0] });
            }
        });
    }catch (error) {
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

productosModel.comprarProducto = async(req,id_producto, callback)=>{
    const query = 'SELECT producto.*, usuario.nombre AS vendedor, usuario.correo, usuario.celular, usuario.direccion FROM producto INNER JOIN usuario ON producto.id_usuario = usuario.id_usuario WHERE producto.id_producto = ?;'
    conection.query(query,[id_producto], async (error,result)=>{
        if(error)
            callback({valid:false, message: "error en la base de datos"})
        else{
            const compraTemplate = path.join(__dirname, '..', 'views', 'mailDeCompra.ejs'); 
            const mailCompra = {
                from: process.env.MAILER_MAIL,
                to: req.session.correo,
                subject: 'hiciste una compra',
                html: await ejs.renderFile(compraTemplate, { usuario:req.session.usuario,producto: result[0].nombre, precio: result[0].precio, numero: result[0].celular})
            };

            const compraTemplate_ = path.join(__dirname, '..', 'views', 'mailDeVenta.ejs');
            const mailVenta = {
                from: process.env.MAILER_MAIL,
                to: result[0].correo,
                subject: 'hiciste una venta',
                html: await ejs.renderFile(compraTemplate_, { usuario:result[0].vendedor,producto: result[0].nombre, precio: result[0].precio, numero: req.session.celular, direccion:result[0].direccion})
            };

            transporter.sendMail(mailCompra, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Correo de Compra enviado: ' + info.response);
                }
            });
            transporter.sendMail(mailVenta, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Correo de venta enviado: ' + info.response);
                }
            });
            actualizarProducto(id_producto);
            callback({valid:true, header: "¡Gracias por tu compra!", body:"En tu correo encontraras la informacion de tu compra y vendedor para que termines tu proceso"})
        }
    })
}

productosModel.productoAlCarro = async (req,id_producto,callback)=>{
    const query =  'INSERT INTO carrito (cantidad, estado, comprado_por, producto) VALUES (?,?,?,?)'
    conection.query(query,[1,0,req.session.id_usuario,id_producto],async(error,result)=>{
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
        }
    })
}

productosModel.comprarCarrito = async (req,id_carrito,id_producto,callback)=>{
    productosModel.comprarProducto(req,id_producto,(result)=>{
        if(!result.valid){
            callback({valid:result.valid,message:result.message})
            console.error(result.message);
        }else{
            const query = 'UPDATE carrito SET estado = 1 WHERE id_carrito = ?;';
            conection.query(query,[id_carrito],async (error,result)=>{
                if (error) {
                    callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
                } else {
                    callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
                }
            });
        }
    })
}

productosModel.eliminarCarrito = async(id_carrito,callback)=>{
    const query = 'DELETE FROM carrito WHERE id_carrito = ?;';
    conection.query(query,[id_carrito],async(error,result)=>{
        if (error) {
            callback({ valid: false, message: `Error en la consulta de la base de datos: ${error}` });
        } else {
            callback({ valid: true, message: 'Éxito en la consulta de la base de datos' });
        }
    })
}

module.exports = productosModel;