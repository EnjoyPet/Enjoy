function toggleMenu() {
    const menu = document.querySelector('.menu');
    const titulo = document.getElementById("titulo");
    menu.classList.toggle('open');

    titulo.style.display = (titulo.style.display === "none") ? "block" : "none"; /* Ocultar el título */

    menu.style.margin = (titulo.style.display === "none") ? "0 auto" : "0";
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