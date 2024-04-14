function toggleMenu() {
  // Obtener elementos del DOM relacionados con el menú y el título.
  const menu = document.querySelector('.menu');
  const titulo = document.getElementById('titulo');
  // Media query para verificar si la ventana tiene un ancho mínimo de 768px.
  const mq = window.matchMedia('(min-width: 768px)');
   // Alternar la clase 'open' para mostrar u ocultar el menú.
  menu.classList.toggle('open');
  titulo.style.display =
    titulo.style.display === 'none' ? 'block' : 'none'; /* Ocultar el título */

  menu.style.margin = titulo.style.display === 'none' ? '0 auto' : '0';
  // Fix menu position on resize
  window.addEventListener('resize', () => {
    if (mq.matches) {
      menu.classList.remove('open');
      titulo.style.display = 'block';
      menu.style.margin = '0';
    }
  });
}

function linkTo(service, section1, section2, section3) {
  let link = '/';
// Construir la URL concatenando los parámetros proporcionados.
  if (service) {
    link += `${service}`;

    if (section1) {
      link += `/${section1}`;

      if (section2) {
        link += `/${section2}`;

        if (section3) {
          link += `/${section3}`;
        }
      }
    }
  }
  // Imprimir la URL en la consola para fines de depuración.
  console.log(link);

  window.location.href = link;
}

function DeplegarSeccion(id) {
  // Obtener el elemento de la sección mediante su identificador.
  const seccion = document.getElementById(id);
// Alternar la visibilidad de la sección entre 'block' y 'none'.
  seccion.style.display = seccion.style.display === 'block' ? 'none' : 'block';
}
