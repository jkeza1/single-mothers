// Smooth scrolling for single-page navigation
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (document.querySelector(targetId)) {
            const targetSection = document.querySelector(targetId);
            const sectionPosition = targetSection.offsetTop;
            window.scrollTo({
                top: sectionPosition - document.querySelector('header').offsetHeight, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// Sticky navigation behavior
window.addEventListener('scroll', function () {
    const navBar = document.querySelector('header');
    const navHeight = navBar.offsetHeight;
    const scrollY = window.scrollY;

    if (scrollY > navHeight) {
        navBar.classList.add('fixed-nav');
    } else {
        navBar.classList.remove('fixed-nav');
    }
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevents default link behavior
        });
    });
    
    // Ensure the nav stays sticky when sections are visible
    const sections = ['#home', '#features', '#about', '#training', '#mentorship', '#contact'];
    sections.forEach(section => {
        const sectionElement = document.querySelector(section);
        if (sectionElement) {
            const sectionTop = sectionElement.offsetTop;
            const sectionHeight = sectionElement.offsetHeight;
            if (scrollY >= sectionTop - navHeight && scrollY < sectionTop + sectionHeight) {
                navBar.classList.add('fixed-nav');
            } else {
                navBar.classList.remove('fixed-nav');
            }
        }
    });
});

// Intersection Observer for scroll-triggered animations (visibility effects)
const visibilityObserverOptions = {
    threshold: 0.3 // Trigger when 30% of the element is visible
};

const handleVisibility = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add visible class to start CSS transition
            observer.unobserve(entry.target); // Stop observing to keep the element visible once shown
        }
    });
};

const visibilityObserver = new IntersectionObserver(handleVisibility, visibilityObserverOptions);
document.querySelectorAll('.about-us-text, .about-us-image, .stat').forEach(el => {
    visibilityObserver.observe(el);
});

// Intersection Observer for triggering count-up animation when stats are in view
const countObserverOptions = {
    threshold: 0.3 // Trigger when 30% of the element is visible
};

const startCounting = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.count');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target'); // Final count
                counter.innerText = 0; // Start counting from 0

                const updateCount = () => {
                    const count = +counter.innerText; // Current count
                    const increment = Math.ceil(target / 200); // Speed of count-up

                    if (count < target) {
                        counter.innerText = count + increment;
                        setTimeout(updateCount, 30); // Update every 30ms
                    } else {
                        counter.innerText = target; // Set to target on completion
                    }
                };
                updateCount(); // Start counting
            });
            observer.unobserve(entry.target); // Stop observing once animation is complete
        }
    });
};

const countObserver = new IntersectionObserver(startCounting, countObserverOptions);
document.querySelectorAll('.impact-stats .stat').forEach(stat => countObserver.observe(stat));

// Carousel Functionality for News and Updates Section
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.news-item');
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
let index = 0;

function showSlide(newIndex) {
    index = newIndex;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

nextButton.addEventListener('click', () => showSlide(index + 1));
prevButton.addEventListener('click', () => showSlide(index - 1));
