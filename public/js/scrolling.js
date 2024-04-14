// Scrolling
let scrolling = document.querySelectorAll(
  '.petfriendly__grid, .shopinfo__grid, .adoptme__grid'
);

window.onscroll = () => {
  scrolling.forEach((sl) => {
     // Obtener la posición actual del desplazamiento vertical.
    let top = window.scrollY;
    // Obtener la posición superior y la altura de la sección actual.
    let offset = sl.offsetTop - 500;
    let height = sl.offsetHeight;
    // Si la posición actual está dentro de los límites de la sección actual, agregar la clase 'sl-active'.
    if (top >= offset && top < offset + height) {
      sl.classList.add('sl-active');
    } else {
      // Si no, eliminar la clase 'sl-active'.
      sl.classList.remove('sl-active');
    }
  });
};
