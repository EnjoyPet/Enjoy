const entrenamientoModel = require('../models/entrenamientoModel');
const indexModel = require('../models/indexModel');

const entrenamientoController = {};

entrenamientoController.renderensenarForm = async (req, res) =>{
    const data = indexModel.getData(req);
    if(data.usuario != null)
        res.render('sessionform',{tipo:'ensenar', data })
    else
        res.redirect('/cuenta/iniciar-sesion');
}

entrenamientoController.renderAprender = async (req, res) =>{
    const data = indexModel.getData(req);
    entrenamientoModel.renderAprender((result)=>{
        if(!result.valid){
            console.error(result.message);
            res.send(result.message);
        }else{
            res.render('aprender',{data,posts:result.posts});
        }
    });
}

entrenamientoController.hacerPost = async (req,res) =>{
  const { titulo, contenido_post, Categoria_post } = req.body;
  
  entrenamientoModel.hacerPost(req,titulo,contenido_post,Categoria_post, (result)=>{
    if(!result.valid){
        console.error(result.message);
        res.send(result.message);
    }else{
        res.redirect('/entrenamiento/aprender');
    }
  })
}

module.exports = entrenamientoController;