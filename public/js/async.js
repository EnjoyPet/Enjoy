async function meGustaPost(postid) {
    const response = await fetch(`/entrenamiento/aprender/puntuar/meGusta/${postid}`, { method: 'PUT' });
    if (response.ok) {
        const likesCountElement = document.getElementById(`likes-count-${postid}`);
        likesCountElement.textContent = parseInt(likesCountElement.textContent) + 1;
    }
}

async function noMeGustaPost(postid) {
    const response = await fetch(`/entrenamiento/aprender/puntuar/noMeGusta/${postid}`, { method: 'PUT' });
    if (response.ok) {
        const dislikesCountElement = document.getElementById(`dislikes-count-${postid}`);
        dislikesCountElement.textContent = parseInt(dislikesCountElement.textContent) + 1;
    }
}