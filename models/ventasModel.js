const shar = require('sharp');
const conection = require('../config/db');

const ventasModel = {};

ventasModel.publicarVenta = async (req,nombre,categoria,descripcion,dimenciones,stock,precio,callback) =>{
    if (req.file) {
        shar(req.file.buffer)
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO producto (id_usuario,nombre,id_categoria,imagen_producto,descripcion,dimensiones,stock,precio) VALUES (?,?,?,?,?,?,?,?)';
                conection.query(query, [req.session.id_usuario,nombre,categoria,imagenRedimensionada,descripcion,dimenciones,stock,precio], async (error, result, fields) => {
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

module.exports = ventasModel;