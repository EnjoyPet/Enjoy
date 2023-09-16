const ventasModel = require('../models/ventasModel');
const indexModel = require('../models/indexModel');

const ventasController = {};

ventasController.renderVentasForm = async (req, res) =>{
    const data = indexModel.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:'ventas', data })
    else
        res.redirect('/cuenta/iniciar-sesion');
}

ventasController.publicarVenta = async (req,res) =>{
  const { nombre, descripcion, stock, precio, dimenciones, Categoria } = req.body;
  
  ventasModel.publicarVenta(req,nombre,Categoria,descripcion,dimenciones,stock,precio,(result)=>{
    if(!result.valid){
        console.error(result.message);
        res.send(result.message);
    }else{
        res.redirect('/vender');
    }
  })
}

module.exports = ventasController;
