const indexModel = require('../models/indexModel');

// Controlador para la página de inicio
const getIndex = (req, res) => {
  // Lógica del controlador
  const data = indexModel.getData(req);

  if(data.usuario != null && data.direccion == null)
  res.redirect('/usuario/informacion');
  else
  res.render('index', { data });
};

module.exports = {
  getIndex,
};