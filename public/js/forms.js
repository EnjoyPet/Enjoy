function cambiarform() {
  // Obtener elementos del DOM relacionados con los formularios y el espacio de correo electrónico.
  const registrarUsuarioForm = document.getElementById("registrar-Usuario-form");
  const validarUsuarioForm = document.getElementById("validar-Usuario-form");
  const espacio_mail = document.getElementById("__registercorreo");

  // Alternar la visibilidad del formulario de registro de usuario.
  registrarUsuarioForm.style.display = (registrarUsuarioForm.style.display === "none") ? "flex" : "none";

  // Alternar la visibilidad del formulario de validación de usuario.
  validarUsuarioForm.style.display = (validarUsuarioForm.style.display === "none") ? "flex" : "none";

  // Actualizar el valor del campo de correo electrónico de validación con el valor del campo de correo electrónico de registro.
  espacio_mail.value = document.getElementById("_registercorreo").value;
}

// Obtener elementos del DOM relacionados con la entrada de imagen y la vista previa de la imagen.
const inputImagen = document.getElementById("imagen_post");
const imagenPreview = document.getElementById("imagen_preview");

// Si la entrada de imagen existe...
if (inputImagen) {
  // Escuchar cambios en la selección de la imagen.
  inputImagen.addEventListener("change", function () {
    console.log("imagen")
    const file = inputImagen.files[0];

    // Si se selecciona un archivo...
    if (file) {
      // Crear un objeto FileReader para leer el contenido del archivo.
      const reader = new FileReader();

      // Cuando se complete la lectura del archivo, mostrar la vista previa de la imagen.
      reader.onload = function (e) {
        imagenPreview.style.display = "block";
        imagenPreview.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      // Si no se selecciona ningún archivo, ocultar la vista previa de la imagen.
      imagenPreview.style.display = "none";
    }
  });
}

// Esperar a que el DOM esté completamente cargado.
document.addEventListener("DOMContentLoaded", function () {
  // Obtener elementos del DOM relacionados con la entrada de imagen y el botón para eliminar la imagen.
  const eliminarImagenBtn = document.getElementById("eliminar-imagen-btn");
  const contrasena1 = document.getElementById('registercontrasenia');
  const contrasena2 = document.getElementById('registercontrasenia2');
  const EnviarBoton = document.getElementById('submit-btn');

  // Escuchar cambios en el campo de confirmación de contraseña.
  contrasena2.addEventListener("change", function () {
    // Si el campo de confirmación de contraseña está vacío o no coincide con la contraseña principal, ocultar el botón de envío.
    EnviarBoton.style.display = ((contrasena2.value === '')||(contrasena2.value !== contrasena1.value)) ? 'none' : 'block';
  })

  // Si la entrada de imagen existe.
  if (inputImagen) {
    // Escuchar cambios en la selección de la imagen.
    inputImagen.addEventListener("change", function () {
      // Si se selecciona un archivo, mostrar el botón para eliminar la imagen.
      if (inputImagen.files.length > 0) {
        eliminarImagenBtn.style.display = "block";
      } else {
        // Si no se selecciona ningún archivo, ocultar el botón para eliminar la imagen.
        eliminarImagenBtn.style.display = "none";
      }
    });
  }

  // Si el botón para eliminar la imagen existe...
  if (eliminarImagenBtn) {
    // Escuchar clics en el botón para eliminar la imagen.
    eliminarImagenBtn.addEventListener("click", function () {
      // Limpiar el valor de la entrada de imagen, ocultar la vista previa de la imagen y ocultar el botón para eliminar la imagen.
      inputImagen.value = "";
      imagenPreview.style.display = "none";
      eliminarImagenBtn.style.display = "none";
    });
  }
});