const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');

// Contadores
let counter = 0;
const size = carouselImages[0].clientWidth;

// Cambiar la posición inicial
carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

// Función para mover el carrusel
function moveCarousel() {
    counter++;
    if (counter >= carouselImages.length) {
        counter = 0; // Reiniciar el contador cuando llegue al final
    }
    carouselSlide.style.transition = "transform 0.5s ease-in-out";
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
}

// Deslizar automáticamente cada 4 segundos
setInterval(moveCarousel, 4000);