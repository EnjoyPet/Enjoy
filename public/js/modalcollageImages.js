const images_adopcion = document.querySelectorAll('.img_collage');
let IndexImg = 0;
let startX;
let touchDirection = null;

const changeImage_adopcion = (direction) => {
    // Realiza un cambio de imagen según la dirección proporcionada.
    switch (direction) {
        default:
            // No hace nada si la dirección no es reconocida.
            IndexImg = IndexImg;
            break;
        case 'left':
            // Cambia a la imagen anterior si hay una disponible, de lo contrario, cambia a la última imagen.
            if (IndexImg > 0) IndexImg--;
            else IndexImg = images_adopcion.length - 1;
            break;
        case 'right':
            // Cambia a la siguiente imagen si hay una disponible, de lo contrario, cambia a la primera imagen.
            if (IndexImg < images_adopcion.length - 1) IndexImg++;
            else IndexImg = 0;
            break;
    }
    // Actualiza la visibilidad de la imagen según el índice actual.
    updateImageVisibility();
}
/**
 * Actualiza la visibilidad de las imágenes en la galería de adopción, mostrando solo la imagen actual y ocultando las demás.
 */
const updateImageVisibility = () => {
    // Oculta todas las imágenes de la galería.
    images_adopcion.forEach((image) => {
        image.classList.add('hide');
    });
    // Muestra la imagen actual de acuerdo al índice almacenado en 'IndexImg'.
    images_adopcion[IndexImg].classList.remove('hide');
}

// Evento 'touchstart' para registrar la posición inicial del toque.
document.addEventListener('touchstart', (e) => {
    // Almacena la posición inicial del toque en el eje X.
    startX = e.touches[0].clientX;
    // Restablece la dirección del toque.
    touchDirection = null;
});

// Evento 'touchmove' para detectar el movimiento del toque y determinar su dirección.
document.addEventListener('touchmove', (e) => {
    // Obtiene la posición actual del toque en el eje X.
    const currentX = e.touches[0].clientX;
    // Calcula la diferencia entre la posición inicial y la posición actual del toque.
    const deltaX = startX - currentX;

    // Determina la dirección del movimiento del toque.
    if (deltaX > 100) {
        touchDirection = 'right';
    } else if (deltaX < -100) {
        touchDirection = 'left';
    }
});

// Evento 'touchend' para aplicar el cambio de imagen al finalizar el toque.
document.addEventListener('touchend', () => {
    // Si se detecta una dirección de desplazamiento, cambia la imagen correspondiente.
    if (touchDirection !== null) {
        changeImage_adopcion(touchDirection);
    }
});
