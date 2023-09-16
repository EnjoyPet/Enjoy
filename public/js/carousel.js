const carousel = document.getElementById('carousel');
const images = carousel.querySelectorAll('.imagecontainer');
let currentIndex = 0;

function changeImage() {
    images.forEach((image) => {
        image.style.display = "none";
    });
    images[currentIndex].style.display = "block"

    currentIndex = (currentIndex + 1) % images.length;

}

setInterval(changeImage, 10000);
