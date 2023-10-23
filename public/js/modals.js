function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('modal-show');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('modal-show');
}

const activeClick = document.querySelector('.txt--hover');

activeClick.addEventListener('click', (e) => {
  e.stopPropagation();
  !activeClick.classList.contains('active')
    ? activeClick.classList.add('active')
    : activeClick.classList.remove('active');
});
