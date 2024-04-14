// Obtiene el elemento del carrusel y las imágenes dentro de él.
const carousel = document.getElementById("carousel");
const images = carousel.querySelectorAll(".img-carousel");

// Obtiene el elemento de texto dentro del carrusel.
const text = document.querySelector("#carousel-text h1");

// Mensajes que se mostrarán junto con las imágenes.
const message = [
  "La gente que realmente aprecia a los animales siempre pregunta sus nombres",
  "Los ojos de un animal tienen el poder de hablar un gran lenguaje",
  "Los animales no son propiedades o cosas, sino organismos vivientes, sujetos de una vida, que merecen nuestra compasión, respeto, amistad y apoyo",
  "El corazón de un animal late al ritmo de la naturaleza.",
  "La presencia de un animal llena de alegría cualquier espacio.",
];

// Índice actual de la imagen y el mensaje mostrado.
let currentIndex = 0;

// Función para cambiar la imagen y el mensaje.
function changeImage() {
  // Oculta todas las imágenes.
  images.forEach((image) => {
    image.classList.add("hide");
  });
  // Muestra la imagen actual y su mensaje correspondiente.
  images[currentIndex].classList.remove("hide");
  text.textContent = message[currentIndex];

  // Incrementa el índice para la próxima imagen y mensaje.
  currentIndex = (currentIndex + 1) % images.length;
}

// Inicializa el carrusel mostrando la primera imagen y mensaje.
changeImage();

// Establece un intervalo para cambiar automáticamente la imagen y el mensaje cada 5 segundos.
setInterval(changeImage, 5000);
