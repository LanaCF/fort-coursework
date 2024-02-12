const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');

function scrollToTop() {
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function handleScroll() {
    if (window.pageYOffset > 450) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }

    if (window.pageYOffset < document.body.scrollHeight - window.innerHeight - 150) {
        scrollToBottomBtn.style.display = 'block';
    } else {
        scrollToBottomBtn.style.display = 'none';
    }
}

scrollToTopBtn.style.display = 'none';
scrollToBottomBtn.style.display = 'none';

scrollToTopBtn.addEventListener('click', scrollToTop);
scrollToBottomBtn.addEventListener('click', scrollToBottom);
window.addEventListener('scroll', handleScroll);

