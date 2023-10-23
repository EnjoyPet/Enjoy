function toggleMenu() {
  const menu = document.querySelector('.menu');
  const titulo = document.getElementById('titulo');
  const mq = window.matchMedia('(min-width: 768px)');
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
  console.log(link);

  window.location.href = link;
}

function DeplegarSeccion(id) {
  const seccion = document.getElementById(id);

  seccion.style.display = seccion.style.display === 'block' ? 'none' : 'block';
}
