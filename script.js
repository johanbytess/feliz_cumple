const sky = document.querySelector('.sky');
const sparkButton      = document.getElementById('sparkButton');
const letterButton     = document.getElementById('letterButton');
const closeLetterButton = document.getElementById('closeLetterButton');
const envelopeScene    = document.getElementById('envelopeScene');
const letterCard       = document.getElementById('letterCard');

/* ── Sparkles (animated floaters) ─────────────────────── */
function createSparkles(amount = 18) {
    for (let i = 0; i < amount; i += 1) {
        const s = document.createElement('span');
        s.style.left           = `${Math.random() * 100}%`;
        s.style.top            = `${35 + Math.random() * 55}%`;
        s.style.animationDelay = `${i * 0.07}s`;
        s.style.opacity        = String(0.5 + Math.random() * 0.5);
        const size = 5 + Math.random() * 7;
        s.style.width  = `${size}px`;
        s.style.height = `${size}px`;
        sky.appendChild(s);
        window.setTimeout(() => s.remove(), 8300);
    }
}

/* ── Static Starfield (generated once at load) ─────────── */
const STAR_COLORS = ['#ffffff', '#fff8e8', '#e8f0ff', '#ffe8f4', '#f8ffe8'];

function createStarfield() {
    const frag = document.createDocumentFragment();
    /* Layer 1 – tiny dim stars, lots of them */
    for (let i = 0; i < 280; i += 1) {
        const star = document.createElement('div');
        star.className = 'static-star';
        star.style.left              = `${Math.random() * 100}vw`;
        star.style.top               = `${Math.random() * 200}vh`; /* spread across scroll */
        const size = 0.5 + Math.random() * 1.2;
        star.style.width             = `${size}px`;
        star.style.height            = `${size}px`;
        star.style.background        = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        star.style.opacity           = String(0.14 + Math.random() * 0.52);
        star.style.animationDelay    = `${Math.random() * 6}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        frag.appendChild(star);
    }
    /* Layer 2 – medium bright stars */
    for (let i = 0; i < 120; i += 1) {
        const star = document.createElement('div');
        star.className = 'static-star';
        star.style.left              = `${Math.random() * 100}vw`;
        star.style.top               = `${Math.random() * 200}vh`;
        const size = 1.4 + Math.random() * 2;
        star.style.width             = `${size}px`;
        star.style.height            = `${size}px`;
        star.style.background        = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        star.style.opacity           = String(0.38 + Math.random() * 0.52);
        star.style.boxShadow         = `0 0 ${size * 3}px ${STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]}`;
        star.style.animationDelay    = `${Math.random() * 5}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        frag.appendChild(star);
    }
    /* Layer 3 – a few big glowing stars */
    for (let i = 0; i < 22; i += 1) {
        const star = document.createElement('div');
        star.className = 'static-star';
        star.style.left              = `${Math.random() * 100}vw`;
        star.style.top               = `${Math.random() * 200}vh`;
        const size = 2.8 + Math.random() * 2.6;
        star.style.width             = `${size}px`;
        star.style.height            = `${size}px`;
        star.style.background        = '#ffffff';
        star.style.opacity           = String(0.7 + Math.random() * 0.3);
        star.style.boxShadow         = `0 0 ${size * 5}px 1px rgba(255,248,220,0.9), 0 0 ${size * 2}px rgba(255,255,255,0.6)`;
        star.style.animationDelay    = `${Math.random() * 4}s`;
        star.style.animationDuration = `${2 + Math.random() * 2.5}s`;
        frag.appendChild(star);
    }
    sky.appendChild(frag);
}

/* ── Letter / Envelope ─────────────────────────────────── */
if (letterButton) {
    letterButton.addEventListener('click', () => {
        envelopeScene.classList.add('is-open');
        letterCard.setAttribute('tabindex', '-1');
        letterButton.textContent = 'Sobre abierto ✉';
        letterButton.disabled    = true;
        createSparkles(24);
        window.setTimeout(() => letterCard.focus(), 950);
    });
}

if (closeLetterButton) {
    closeLetterButton.addEventListener('click', () => {
        envelopeScene.classList.remove('is-open');
        letterButton.textContent = 'Abrir sobre';
        letterButton.disabled    = false;
        createSparkles(10);
    });
}

/* ── Stars button ──────────────────────────────────────── */
sparkButton.addEventListener('click', () => createSparkles(30));

/* ── Carousel ──────────────────────────────────────────── */
(function initCarousel() {
    const track          = document.getElementById('carouselTrack');
    const dotsContainer  = document.getElementById('carouselDots');
    const prevBtn        = document.getElementById('carouselPrev');
    const nextBtn        = document.getElementById('carouselNext');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel__slide'));
    let current  = 0;
    let timer    = null;

    /* Build pagination dots */
    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', `Frase ${idx + 1}`);
        dot.addEventListener('click', () => { goTo(idx); resetTimer(); });
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        Array.from(dotsContainer.children).forEach((dot, i) =>
            dot.classList.toggle('is-active', i === current));
    }

    function goTo(index) {
        slides[current].classList.remove('is-active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('is-active');
        updateDots();
    }

    function resetTimer() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(() => goTo(current + 1), 4400);
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    /* Pause on hover */
    track.addEventListener('mouseenter', () => window.clearInterval(timer));
    track.addEventListener('mouseleave', resetTimer);

    /* Touch swipe */
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = touchX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 44) goTo(dx > 0 ? current + 1 : current - 1);
        resetTimer();
    }, { passive: true });

    goTo(0);
    resetTimer();
}());

/* ── Init ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
    createStarfield();
    createSparkles(14);
});
