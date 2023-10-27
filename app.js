const path = require("path");
const nodemailer = require("nodemailer");

const controllers = require("./controllers.js");
const conection = require("./db.js");

global.dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASS,
  },
});

global.transporter = transporter;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "PantallaZapatoMause2213",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
      // secure: true, descomentar cunado tenga https
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Ahora puedes usar la variable modelsPath en otros scripts

const { send } = require("process");

// INDEX
app.get("/", (req, res) => {
  const data = {
    userData: req.session.userData || null,
    id_usuario: req.session.id_usuario || null,
    usuario: req.session.usuario || null,
    usuario_img: req.session.usuario_img || null,
    tipo_indent: req.session.tipo_indent || null,
    identificacion: req.session.identificacion || null,
    correo: req.session.correo || null,
    celular: req.session.celular || null,
    genero: req.session.genero || null,
    direccion: req.session.direccion || null,
    telefono: req.session.telefono || null,
    rol: req.session.rol || null,
    usuario_img: req.session.usuario_img || null,
  };
  const productosModel = require("./models.js");
  if (data.usuario === null) {
    res.render("index", { data });
  } else if (data.usuario != null && data.direccion == null)
    res.redirect("/usuario/informacion");
  else {
    productosModel.productosModel.renderProductos("todo", 0, (result) => {
      if (!result.valid) {
        console.error(result.message);
        res.send(result.message);
      } else {
        res.render("indexInSession", { data, productos: result.productos });
      }
    });
  }
});
//

//REGISTRO
app.get(
  "*/cuenta/registrarse",
  controllers.UserController.rederizarformderegistro
);
app.post("/registrar-usuario", controllers.UserController.registrarUsuario);
app.post("*/verificar-mail", controllers.UserController.verificarCorreo);
//

//INICIO
app.get(
  "*/cuenta/iniciar-sesion",
  controllers.UserController.rederizarformdeinicio
);
app.post("*/inciar", controllers.UserController.iniciarSesion);
app.get(
  "*/usuario/recuperar-contrasenia",
  controllers.UserController.RecuperarContrasenia
);
app.post(
  "*/usuario/recuperar-contrasenia/verificar",
  controllers.UserController.renderizarverificarCodContrasenia
);
app.post(
  "*/usuario/recuperar-contrasenia/verificar/actualizar-contrasenia",
  controllers.UserController.actualizarContraseniaOlvidada
);

//

//CERRAR
app.get("*/usuario/cerrar-sesion", controllers.UserController.cerrarSesion);
//

//IFORMACION DE LA CUENTA
app.get("*/usuario/informacion", controllers.acountController.renderAcountInfo);
app.get(
  "/usuario/informacion/actualizar/:objetivo",
  controllers.acountController.renderActializacionForm
);
app.get("/usuario/carrito", controllers.acountController.renderizarCarrito);
app.get("/usuario/productos", controllers.acountController.renderizarProductos);

app.post(
  "/verificar-actualizar-correo",
  controllers.acountController.verificarCodigo
);

app.post("/actualizar-correo", controllers.acountController.actualizarCorreo);
app.post(
  "/actualizar-direccion",
  controllers.acountController.actualizarDireccion
);
app.post("/actualizar-nombre", controllers.acountController.actualizarNombre);
app.post(
  "/actualizar-contrasenia",
  controllers.acountController.actualizarContrasenia
);
app.post("/actualizar-celular", controllers.acountController.actualizarCelular);
app.post(
  "/actualizar-identificacion",
  controllers.acountController.actualizarIdentificacion
);
app.post(
  "/actualizar-telefono",
  controllers.acountController.actualizarTelefono
);
app.post(
  "/actualizar-imagen_usuario",
  upload.single("imagen_post"),
  controllers.acountController.actualizarImagen
);

app.post(
  "/eliminar-imagen_usuario",
  controllers.acountController.eliminarImagen
);
//

//PRODUCTOS
app.get(
  "/productos/:categoria/:pagina",
  controllers.productosController.renderProductos
);
app.get(
  "/ver/producto/:id_producto",
  controllers.productosController.renderInfoProducto
);
app.get(
  "/producto/comprar/:id_producto",
  controllers.productosController.comprarProducto
);
app.get(
  "/producto/al-carro/:id_producto",
  controllers.productosController.productoAlCarro
);
app.get(
  "/carrito/:id_carrito/producto/comprar/:id_producto",
  controllers.productosController.comprarCarrito
);
app.get(
  "/carrito/:id_carrito/producto/eliminar/:id_producto",
  controllers.productosController.eliminarCarrito
);
//

//VENTAS
app.get("/vender", controllers.ventasController.renderVentasForm);
app.post(
  "/PublicarUnaVenta",
  upload.single("imagen_post"),
  controllers.ventasController.publicarVenta
);
//

//TIPS DE ENTRENAMIENTO
app.get(
  "/entrenamiento/ensenar",
  controllers.entrenamientoController.renderensenarForm
);
app.get(
  "/entrenamiento/aprender",
  controllers.entrenamientoController.renderAprender
);
app.post(
  "/hacerUnPost",
  upload.single("imagen_post"),
  controllers.entrenamientoController.hacerPost
);
app.put("/entrenamiento/aprender/puntuar/noMeGusta/:id", (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET noMeGusta_post = noMeGusta_post + 1 WHERE id_post = ?`;
  conection.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "No se pudo actualizar la base de datos." });
    } else {
      res
        .status(200)
        .json({ message: "No Me Gusta actualizado en la base de datos." });
    }
  });
});
app.put("/entrenamiento/aprender/puntuar/meGusta/:id", (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET meGusta_post = meGusta_post + 1 WHERE id_post = ?`;
  conection.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "No se pudo actualizar la base de datos." });
    } else {
      res
        .status(200)
        .json({ message: "Me Gusta actualizado en la base de datos." });
    }
  });
});
//

//adopciones

app.get(
  "/usuario/adopciones/adoptar/:categoria/:filtro/:pagina",
  controllers.adopcionesController.rendermascotas
);
app.get(
  "/usuario/adopciones/dar",
  controllers.adopcionesController.rendermascotasform
);
app.post(
  "/usuario/adopciones/dar/registrarmascota",
  upload.array("imagen_mascota", 3),
  controllers.adopcionesController.registrarmascota
);

app.get(
  "/ver/mascota/:idmascota",
  controllers.adopcionesController.verInfoAvanzada
);

app.get(
  "/usuario/adoptar/mascota/:idmascota/:iddueno",
  controllers.adopcionesController.adoptar
);

//

//Sin Implementar
app.get("/Pronto-Implementado", controllers.acountController.mostrarMensaje);

//

app.listen(port, () => {
  console.log(`Levantando el Servidor ${port}`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/resources", express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});
