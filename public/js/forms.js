function cambiarform() {
  const registrarUsuarioForm = document.getElementById("registrar-Usuario-form");
  const validarUsuarioForm = document.getElementById("validar-Usuario-form");
  const espacio_mail = document.getElementById("__registercorreo");

  // Alternar la visibilidad de registrarUsuarioForm
  registrarUsuarioForm.style.display = (registrarUsuarioForm.style.display === "none") ? "flex" : "none";

  // Alternar la visibilidad de validarUsuarioForm
  validarUsuarioForm.style.display = (validarUsuarioForm.style.display === "none") ? "flex" : "none";

  espacio_mail.value = document.getElementById("_registercorreo").value;
}

const inputImagen = document.getElementById("imagen_post");
const imagenPreview = document.getElementById("imagen_preview");
if (inputImagen) {
  inputImagen.addEventListener("change", function () {
    console.log("imagen")
    const file = inputImagen.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        imagenPreview.style.display = "block";
        imagenPreview.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      imagenPreview.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const inputImagen = document.getElementById("imagen_post");
  const eliminarImagenBtn = document.getElementById("eliminar-imagen-btn");

  const contrasena1 = document.getElementById('registercontrasenia');
  const contrasena2 = document.getElementById('registercontrasenia2');
  const EnviarBoton = document.getElementById('submit-btn');


  contrasena2.addEventListener("change", function () {
    console.log(contrasena2.value);
    EnviarBoton.style.display = ((contrasena2.value === '')||(contrasena2.value !== contrasena1.value)) ? 'none' : 'block';
  })
  if (inputImagen) {
    inputImagen.addEventListener("change", function () {
      if (inputImagen.files.length > 0) {
        eliminarImagenBtn.style.display = "block";
      } else {
        eliminarImagenBtn.style.display = "none";
      }
    });
  }
  if (eliminarImagenBtn) {
    eliminarImagenBtn.addEventListener("click", function () {
      inputImagen.value = "";
      imagenPreview.style.display = "none";
      eliminarImagenBtn.style.display = "none";
    });
  }
});
