const getData = (req) => {
  return {
    userData:req.session.userData || null,
    id_usuario:req.session.id_usuario || null,
    usuario:req.session.usuario || null,
    usuario_img:req.session.usuario_img || null,
    tipo_indent:req.session.tipo_indent || null,
    identificacion:req.session.identificacion || null,
    correo:req.session.correo || null,
    celular:req.session.celular || null,
    genero:req.session.genero || null,
    direccion:req.session.direccion || null,
    telefono:req.session.telefono || null,
    rol:req.session.rol || null,
    usuario_img:req.session.usuario_img || null
  };
};

module.exports = {
  getData,
};
