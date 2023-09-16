const animatedText = document.getElementById("ejoyIndexText");
animatedText.textContent = "";

// Texto que quieres mostrar letra por letra
const textToShow = [
    "● Proporciona bienestar, calidad, cuidado y respeto \na los nuevos miembros de la familia, satisfaciendo  \n las expectativas de nuestros clientes.  \n  \n \n ● Mejora la calidad de vida de los animales callejeros, \nque actualmente no tienen cuidado y una familia \n para adoptarlos.  \n  \n \n ● Ofrece una tienda de productos atractivos, garantizados \n y de alta calidad"
];
let currentLetterIndex = 0;


function restartText() {
    currentLetterIndex = 0; // Reiniciar el índice
    showNextLetter();
    // Intervalo para mostrar letras cada cierto tiempo (ajusta la velocidad)
}

function showNextLetter() {
    if (currentLetterIndex < textToShow.length) {
        const currentLine = textToShow[currentLetterIndex];
        if (animatedText.textContent !== currentLine) {
            animatedText.textContent = currentLine.substring(0, animatedText.textContent.length + 1);
        } else {
            currentLetterIndex++;
        }
    } else {
        clearInterval(interval);
    }
}

const interval = setInterval(showNextLetter, 50);    

setTimeout(restartText, 5000); // Espera 5 segundos antes de reiniciar



// Función para animar un número gradualmente hasta un valor específico
function animateNumber(targetElementId, targetValue,speed,ratio) {
    let currentNumber = 0;
    const targetElement = document.getElementById(targetElementId);
    const interval = setInterval(() => {
        if (currentNumber < targetValue) {
            currentNumber+=ratio;
            targetElement.textContent = currentNumber;
        } else {
            clearInterval(interval);
        }
    }, speed); // Controla la velocidad de la animación ajustando este valor
}

// Llama a la función para animar los números con los valores deseados
animateNumber("dogsAmount", 66467,1,20); // 66,467
animateNumber("dogsperKM", 165,50,1); // 165
