const UserModel = require('../models/userModel'); // Asegúrate de que la ruta sea correcta
const indexModel = require('../models/indexModel');


const UserController = {};
const verificationCodes = new Map();

UserController.rederizarformderegistro = (req, res) => {
  if (req.session.usuario)
    res.redirect("/");
  else{
    const data = indexModel.getData(req);
    res.render("sessionform", { tipo: "registro", data });
  }
};
UserController.rederizarformdeinicio = (req, res) => {
  if (req.session.usuario)
    res.redirect("/");
  else{
    const data = indexModel.getData(req);
    res.render("sessionform", { tipo: "inicio", data });
  }
};

//----------------------------registro--------------------------\\
UserController.registrarUsuario = async (req, res) => {
  const { nombre, correo, numero, contrasenia } = req.body;

  try {
    await UserModel.comprobarCorreo(correo, async (correoResult) => {
      if (!correoResult.isValid) {
        res.send(correoResult.message);
      } else if (correoResult.result.length == 0) {
        const verificationCode = await UserModel.registrarUsuario(nombre, correo, numero, contrasenia);
        console.log("Código de verificación generado:", verificationCode);
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

  UserModel.verificarCodigo(correo, codigo, (result) => {
    if (result.error) {
      res.send(result.message);
    } else {
      res.redirect('/');
    }
  });
};
//---------------------------------------------------------\\

//----------------------------inicio--------------------------\\
UserController.iniciarSesion = async (req, res) => {
  const { correo, contrasenia } = req.body;
  UserModel.iniciarSesion(req,correo,contrasenia, (result)=>{
    if(result.logget){
      res.redirect("/");
    }else{
      res.send(result.message);
    }
  })
}
//-------------------------------------------------------------\\

UserController.cerrarSesion = async (req,res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = UserController;
