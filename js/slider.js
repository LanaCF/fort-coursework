let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

// Додати слухач події touchstart до контейнера слайдера
document.querySelector(".slideshow-container").addEventListener("touchstart", function(event) {
    // Отримати початкову позицію дотику
    var startTouchX = event.touches[0].clientX;

    // Додати слухач події touchmove до контейнера слайдера
    document.querySelector(".slideshow-container").addEventListener("touchmove", function(event) {
    // Отримати поточну позицію дотику
    var currentTouchX = event.touches[0].clientX;

    // Розрахувати відстань прокручування
    var swipeDistance = startTouchX - currentTouchX;

    // Якщо відстань прокручування більша за 50 пікселів, змінити слайд
    if (swipeDistance > 50) {
        plusSlides(1);
    } else if (swipeDistance < -50) {
        plusSlides(-1);
    }
    });

    // Додати слухач події touchend до контейнера слайдера, щоб видалити слухача touchmove
    document.querySelector(".slideshow-container").addEventListener("touchend", function(event) {
    document.querySelector(".slideshow-container").removeEventListener("touchmove", function(event) {});
    });
});