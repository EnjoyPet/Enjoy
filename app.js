const path = require("path");
const conection = require('./config/db');

global.dotenv = require("dotenv");
dotenv.config({ path: './env/.env' });

const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const multer = require('multer');
const sharp = require('sharp');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'PantallaZapatoMause2213',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000,
    // secure: true, descomentar cunado tenga https
    httpOnly: true,
    sameSite: 'strict'
  }
}));


const indexController = require('./controllers/indexController');
const UserController = require("./controllers/usercontroller");
const acountController = require("./controllers/acountController");
const productosController = require("./controllers/productosController");
const ventasController = require("./controllers/ventasController");
const entrenamientoController = require("./controllers/entrenamientoController");
const { send } = require("process");

// INDEX
app.get('/',indexController.getIndex);
//

//REGISTRO
app.get('*/cuenta/registrarse',UserController.rederizarformderegistro);
app.post('*/registrar-usuario',UserController.registrarUsuario);
app.post('*/verificar-mail',UserController.verificarCorreo);
//

//INICIO
app.get('*/cuenta/iniciar-sesion',UserController.rederizarformdeinicio);
app.post('*/inciar',UserController.iniciarSesion);
//

//CERRAR
app.get('*/usuario/cerrar-sesion',UserController.cerrarSesion);
//

//IFORMACION DE LA CUENTA
app.get('*/usuario/informacion',acountController.renderAcountInfo);
app.get('/usuario/informacion/actualizar/:objetivo',acountController.renderActializacionForm);
app.get('/usuario/carrito',acountController.renderizarCarrito);
app.get('/usuario/productos',acountController.renderizarProductos);

app.post('/verificar-actualizar-correo',acountController.verificarCodigo);

app.post('/actualizar-correo',acountController.actualizarCorreo);
app.post('/actualizar-direccion',acountController.actualizarDireccion);
app.post('/actualizar-nombre',acountController.actualizarNombre);
app.post('/actualizar-contrasenia',acountController.actualizarContrasenia);
app.post('/actualizar-celular',acountController.actualizarCelular);
app.post('/actualizar-identificacion',acountController.actualizarIdentificacion);
app.post('/actualizar-telefono',acountController.actualizarTelefono);
app.post('/actualizar-imagen_usuario', upload.single('imagen_post'),acountController.actualizarImagen);

app.post('/eliminar-imagen_usuario',acountController.eliminarImagen);
//

//PRODUCTOS
app.get('/productos/:categoria/:pagina',productosController.renderProductos);
app.get('/ver/producto/:id_producto',productosController.renderInfoProducto);
app.get('/producto/comprar/:id_producto',productosController.comprarProducto);
app.get('/producto/al-carro/:id_producto',productosController.productoAlCarro);
app.get('/carrito/:id_carrito/producto/comprar/:id_producto',productosController.comprarCarrito);
app.get('/carrito/:id_carrito/producto/eliminar/:id_producto',productosController.eliminarCarrito);
//

//VENTAS
app.get('/vender',ventasController.renderVentasForm);
app.post('/PublicarUnaVenta', upload.single('imagen_post'),ventasController.publicarVenta);
//

//TIPS DE ENTRENAMIENTO
app.get('/entrenamiento/ensenar',entrenamientoController.renderensenarForm);
app.get('/entrenamiento/aprender',entrenamientoController.renderAprender);
app.post('/hacerUnPost' ,upload.single('imagen_post'),entrenamientoController.hacerPost);
app.put('/entrenamiento/aprender/puntuar/noMeGusta/:id', (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET noMeGusta_post = noMeGusta_post + 1 WHERE id_post = ?`;
  conection.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo actualizar la base de datos.' });
    } else {
      res.status(200).json({ message: 'No Me Gusta actualizado en la base de datos.' });
    }
  });
});
app.put('/entrenamiento/aprender/puntuar/meGusta/:id', (req, res) => {
  const postId = req.params.id;

  const sqlQuery = `UPDATE post SET meGusta_post = meGusta_post + 1 WHERE id_post = ?`;
  conection.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo actualizar la base de datos.' });
    } else {
      res.status(200).json({ message: 'Me Gusta actualizado en la base de datos.' });
    }
  });
});
//

//Sin Implementar
app.get('/Pronto-Implementado',acountController.mostrarMensaje);

//

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")
