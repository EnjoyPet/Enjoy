const images_adopcion = document.querySelectorAll('.img_collage');
let IndexImg = 0;
let startX;
let touchDirection = null;

const changeImage_adopcion = (direction) => {
    switch (direction) {
        default:
            IndexImg = IndexImg;
            break;
        case 'left':
            if (IndexImg > 0) IndexImg--;
            else IndexImg = images_adopcion.length - 1;
            break;
        case 'right':
            if (IndexImg < images_adopcion.length - 1) IndexImg++;
            else IndexImg = 0;
            break;
    }
    updateImageVisibility();
}

const updateImageVisibility = () => {
    images_adopcion.forEach((image) => {
        image.classList.add('hide');
    });
    images_adopcion[IndexImg].classList.remove('hide');
}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    touchDirection = null;
});

document.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const deltaX = startX - currentX;

    if (deltaX > 100) {
        touchDirection = 'right';
    } else if (deltaX < -100) {
        touchDirection = 'left';
    }
});

document.addEventListener('touchend', () => {
    if (touchDirection !== null) {
        changeImage_adopcion(touchDirection);
    }
});
