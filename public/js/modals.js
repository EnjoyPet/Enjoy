function openModal(id){
    const modal = document.getElementById(id);
    modal.classList.add('modal-show');
}

function closeModal(id){
    const modal = document.getElementById(id);
    modal.classList.remove('modal-show');
}