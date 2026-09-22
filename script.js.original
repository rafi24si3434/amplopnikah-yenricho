// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initCover();
    initPetals();
    initParticles();
    initCountdown();
    initGallery();
    initRSVP();
    initWishes();
    initMusic();
    initScrollReveal();
    initNavigation();
    parseGuestName();
});

// ===== PARSE GUEST NAME FROM URL =====
function parseGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('to') || params.get('kepada');
    if (guest) {
        document.getElementById('guest-name').textContent = guest;
    }
}

// ===== COVER / OPENING =====
function initCover() {
    const cover = document.getElementById('cover');
    const btn = document.getElementById('btn-open-invitation');
    const main = document.getElementById('main-content');

    btn.addEventListener('click', () => {
        cover.classList.add('fade-out');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            cover.style.display = 'none';
            main.classList.remove('hidden');
            lucide.createIcons();
            // Try to play music
            const music = document.getElementById('bg-music');
            if (music.src || music.querySelector('source')) {
                music.play().then(() => {
                    document.getElementById('music-toggle').classList.add('playing');
                }).catch(() => {});
            }
            // Trigger reveals
            setTimeout(() => triggerReveals(), 300);
        }, 800);
    });

    document.body.style.overflow = 'hidden';
}

// ===== FLOATING PETALS =====
function initPetals() {
    const container = document.getElementById('petals-container');
    const colors = ['#C9A96E', '#E8D5B7', '#B76E79', '#D4AF37', '#87A878'];
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (6 + Math.random() * 8) + 's';
        petal.style.animationDelay = Math.random() * 10 + 's';
        petal.style.width = (8 + Math.random() * 10) + 'px';
        petal.style.height = petal.style.width;
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];
        petal.style.opacity = '0';
        container.appendChild(petal);
    }
}

// ===== HERO PARTICLES =====
function initParticles() {
    const container = document.getElementById('hero-particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('hero-particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 4 + 's';
        p.style.animationDuration = (3 + Math.random() * 4) + 's';
        container.appendChild(p);
    }
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const weddingDate = new Date('2026-10-03T10:00:00+07:00').getTime();

    function update() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ===== GALLERY & LIGHTBOX =====
function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    let currentIndex = 0;
    const images = [];

    items.forEach((item, i) => {
        const img = item.querySelector('img');
        images.push(img.src);
        item.addEventListener('click', () => {
            currentIndex = i;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
}

// ===== RSVP =====
function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const success = document.getElementById('rsvp-success');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name').value;
        const attendance = form.querySelector('input[name="attendance"]:checked')?.value;
        const guests = document.getElementById('rsvp-guests').value;

        // Store in localStorage
        const rsvpData = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
        rsvpData.push({ name, attendance, guests, time: new Date().toISOString() });
        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));

        form.classList.add('hidden');
        success.classList.remove('hidden');
        lucide.createIcons();
    });
}

// ===== WISHES =====
function initWishes() {
    const form = document.getElementById('wishes-form');
    const list = document.getElementById('wishes-list');

    // Load existing wishes
    loadWishes();

    // Add default wishes if empty
    const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    if (wishes.length === 0) {
        const defaults = [
            { name: 'Maria', message: 'Selamat menempuh hidup baru! Tuhan memberkati keluarga kalian. Horas! 🙏❤️', time: new Date().toISOString() },
            { name: 'Parulian', message: 'Bahagia selalu Yenricho & Veni! Semoga menjadi keluarga yang diberkati Tuhan. 💒✨', time: new Date().toISOString() }
        ];
        localStorage.setItem('wedding_wishes', JSON.stringify(defaults));
        loadWishes();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('wish-name').value.trim();
        const message = document.getElementById('wish-message').value.trim();

        if (!name || !message) return;

        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        wishes.unshift({ name, message, time: new Date().toISOString() });
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

        form.reset();
        loadWishes();
    });

    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        list.innerHTML = '';

        if (wishes.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:var(--gold-light);opacity:.5;">Belum ada ucapan. Jadilah yang pertama!</p>';
            return;
        }

        wishes.forEach(wish => {
            const card = document.createElement('div');
            card.classList.add('wish-card');
            const initial = wish.name.charAt(0).toUpperCase();
            const timeAgo = getTimeAgo(new Date(wish.time));
            card.innerHTML = `
                <div class="wish-card-header">
                    <div class="wish-avatar">${initial}</div>
                    <div>
                        <div class="wish-author">${escapeHtml(wish.name)}</div>
                        <div class="wish-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="wish-text">${escapeHtml(wish.message)}</div>
            `;
            list.appendChild(card);
        });
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + ' menit yang lalu';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + ' jam yang lalu';
    const days = Math.floor(hours / 24);
    if (days < 30) return days + ' hari yang lalu';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== MUSIC =====
function initMusic() {
    const toggle = document.getElementById('music-toggle');
    const music = document.getElementById('bg-music');
    let isPlaying = false;

    toggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggle.classList.remove('playing');
        } else {
            music.play().then(() => {
                toggle.classList.add('playing');
            }).catch(() => {});
        }
        isPlaying = !isPlaying;
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function triggerReveals() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('active');
        }
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = ['home', 'couple', 'event', 'gallery', 'location', 'rsvp', 'wishes'];

    // Smooth scroll on click
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(dot.dataset.section);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) current = id;
            }
        });
        dots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === current);
        });
    });
}
