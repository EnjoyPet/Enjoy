const carousel = document.getElementById('carousel');
const images = carousel.querySelectorAll('.img-carousel');
const text = document.getElementById('carousel-text')

const message = [
    'La gente que realmente aprecia a los animales siempre pregunta sus nombres',
    'Los ojos de un animal tienen el poder de hablar un gran lenguaje',
    'Los animales no son propiedades o cosas, sino organismos vivientes, sujetos de una vida, que merecen nuestra compasión, respeto, amistad y apoyo',
    'El corazón de un animal late al ritmo de la naturaleza.',
    'La presencia de un animal llena de alegría cualquier espacio.',
]

let currentIndex = 0;

function changeImage() {
    images.forEach((image) => {
        image.classList.add('hide');
    });
    images[currentIndex].classList.remove('hide');
    text.textContent = message[currentIndex];

    currentIndex = (currentIndex + 1) % images.length;

}
changeImage();

setInterval(changeImage, 5000);
