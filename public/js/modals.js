function openModal(id) {
  // Obtener el elemento del modal mediante su identificador.
  const modal = document.getElementById(id);
  // Agregar la clase 'modal-show' para mostrar el modal.
  modal.classList.add('modal-show');
}

function closeModal(id) {
  // Obtener el elemento del modal mediante su identificador.
  const modal = document.getElementById(id);
  // Eliminar la clase 'modal-show' para ocultar el modal.
  modal.classList.remove('modal-show');
}
// Obtener el primer elemento con la clase 'txt--hover'.
const activeClick = document.querySelector('.txt--hover');
// Escuchar clics en el elemento 'txt--hover' y prevenir la propagación del evento
activeClick.addEventListener('click', (e) => {
  e.stopPropagation();
  !activeClick.classList.contains('active')
    ? activeClick.classList.add('active')
    : activeClick.classList.remove('active');
});
