const conection = require('../config/db');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { error } = require('console');


const UserModel = {};
const verification = new Map();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS
    }
});
//----------------------------registro--------------------------\\

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Correo de verificación enviado: ' + info.response);
        }
    });
    return verificationCode;
};

UserModel.verificarCodigo = async (correo, codigo, callback) => {
    // Verificar si el correo y el código coinciden
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
//---------------------------------------------------------\\

//----------------------------inicio--------------------------\\

UserModel.iniciarSesion = async (req, correo, contrasenia, callback) => {
    conection.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (error, result) => {
        if (error) throw error
        else {
            if (result.length == 0 || !(await bcryptjs.compare(contrasenia, result[0].contrasenia))) {
                callback({logget: false, message:"Correo y/o contraseña erroneos"});
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
                callback({logget: true, message:`Bienvenido de vuelta ${req.session.usuario}`});
            }
        }
    })
}

//-------------------------------------------------------------\\

module.exports = UserModel;