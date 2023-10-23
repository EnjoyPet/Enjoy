const input_imagen_mascota = document.querySelectorAll('.imagen_mascota');
const preview_imagen_mascota = document.querySelectorAll('.imagen_mascota_preview');
const registrarMascotaForm = document.getElementById('registrarMascotaForm');

let count = 0;

registrarMascotaForm.addEventListener('reset', () =>{
    input_imagen_mascota.forEach(element => {
        element.style.display = "none";
    });
    preview_imagen_mascota.forEach(element => {
        element.style.display = "none";
    });
    input_imagen_mascota[0].style.display = "block";
    count = 0;
});

input_imagen_mascota.forEach(element => {
    element.addEventListener('change', () => {
        const file = element.files[0];

        console.log(preview_imagen_mascota[count].id)

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview_imagen_mascota[count].src = e.target.result;
                preview_imagen_mascota[count].style.display = "block";
            };
            count ++;
            reader.readAsDataURL(file);
            input_imagen_mascota[count].style.display = "block";
        } else {
            preview_imagen_mascota[count].style.display = "none";
            input_imagen_mascota[count].style.display = "none";
            count ++;
        }
    })
});