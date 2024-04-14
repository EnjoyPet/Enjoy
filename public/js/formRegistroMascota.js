// Obtener elementos del DOM relacionados con la entrada de imágenes de la mascota y la vista previa.
const input_imagen_mascota = document.querySelectorAll('.imagen_mascota');
const preview_imagen_mascota = document.querySelectorAll('.imagen_mascota_preview');

// Obtener el formulario de registro de mascotas.
const registrarMascotaForm = document.getElementById('registrarMascotaForm');

// Contador para realizar un seguimiento de las imágenes seleccionadas.
let count = 0;

// Restablecer el formulario de registro de mascotas.
registrarMascotaForm.addEventListener('reset', () => {
    // Ocultar todas las entradas de imágenes y vistas previas de imágenes.
    input_imagen_mascota.forEach(element => {
        element.style.display = "none";
    });
    preview_imagen_mascota.forEach(element => {
        element.style.display = "none";
    });
    // Mostrar la primera entrada de imagen y restablecer el contador.
    input_imagen_mascota[0].style.display = "block";
    count = 0;
});

// Escuchar cambios en las entradas de imágenes de la mascota.
input_imagen_mascota.forEach(element => {
    element.addEventListener('change', () => {
        // Obtener el archivo seleccionado.
        const file = element.files[0];

        // Mostrar el ID de la vista previa de la imagen para fines de depuración.
        console.log(preview_imagen_mascota[count].id)

        // Si se selecciona un archivo.
        if (file) {
            // Crear un objeto FileReader para leer el contenido del archivo.
            const reader = new FileReader();

            // Cuando se complete la lectura del archivo.
            reader.onload = function (e) {
                // Mostrar la vista previa de la imagen cargada.
                preview_imagen_mascota[count].src = e.target.result;
                preview_imagen_mascota[count].style.display = "block";
            };
            // Incrementar el contador y leer el archivo como un enlace de datos URL.
            count ++;
            reader.readAsDataURL(file);
            // Mostrar la siguiente entrada de imagen.
            input_imagen_mascota[count].style.display = "block";
        } else {
            // Si no se selecciona un archivo, ocultar la vista previa de la imagen y la entrada de imagen.
            preview_imagen_mascota[count].style.display = "none";
            input_imagen_mascota[count].style.display = "none";
            count ++;
        }
    })
});

// Obtener el elemento select para la especie de mascota.
const especie_select = document.getElementById('especie-select');

// Si el elemento de especie de mascota existe.
if(especie_select){
    // Escuchar cambios en la selección de especie.
    especie_select.addEventListener('change', () => {
        // Obtener todas las opciones de raza.
        const raza_options = document.querySelectorAll('#raza-select option');

        // Iterar sobre las opciones de raza y mostrar o ocultar según la especie seleccionada.
        raza_options.forEach(raza => {
            if (!raza.classList.contains(especie_select.value)) {
                raza.style.display = 'none';
            } else {
                raza.style.display = 'block';
            }
        });
    });
}
