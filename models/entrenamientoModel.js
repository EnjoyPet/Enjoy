const shar = require('sharp');
const conection = require('../config/db');

const entrenamientoModel = {};

entrenamientoModel.hacerPost = async (req,titulo,contenido,categoria,callback) =>{
    if (req.file) {
        shar(req.file.buffer)
            .resize({ height: 200, fit: shar.fit.contain })
            .toBuffer()
            .then((imagenRedimensionada) => {
                const query =
                    'INSERT INTO post (titulo_post,contenido_post,imagen_post,categoria_post,id_usuario ) VALUES (?,?,?,?,?)';
                conection.query(query, [titulo,contenido,imagenRedimensionada,categoria,req.session.id_usuario], async (error, result, fields) => {
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

entrenamientoModel.renderAprender = async (callback)=>{
    const query = 'SELECT * FROM post ORDER BY id_post DESC LIMIT 50;'
    try {
        conection.query(query, (error, result) => {
            callback({ valid: true, posts: result });
        });
    } catch (error) {
        callback({ valid: false, message: "Ocurrió un error en la consulta: " + error });
    }
}
module.exports = entrenamientoModel;