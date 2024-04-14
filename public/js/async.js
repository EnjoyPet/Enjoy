async function meGustaPost(postid) {
    // Realiza una solicitud PUT al servidor para indicar que el usuario le ha dado "Me gusta" al post.
    const response = await fetch(`/entrenamiento/aprender/puntuar/meGusta/${postid}`, { method: 'PUT' });
    // Si la solicitud fue exitosa, actualiza el contador de "Me gusta" en la interfaz de usuario.
    if (response.ok) {
        // Obtiene el elemento del contador de "Me gusta" y lo actualiza.
        const likesCountElement = document.getElementById(`likes-count-${postid}`);
        likesCountElement.textContent = parseInt(likesCountElement.textContent) + 1;
    }
}

async function noMeGustaPost(postid) {
    // Realiza una solicitud PUT al servidor para indicar que el usuario le ha dado "No me gusta" al post.
    const response = await fetch(`/entrenamiento/aprender/puntuar/noMeGusta/${postid}`, { method: 'PUT' });
    // Si la solicitud fue exitosa, actualiza el contador de "No me gusta" en la interfaz de usuario.
    if (response.ok) {
        // Obtiene el elemento del contador de "No me gusta" y lo actualiza.
        const dislikesCountElement = document.getElementById(`dislikes-count-${postid}`);
        dislikesCountElement.textContent = parseInt(dislikesCountElement.textContent) + 1;
    }
}
