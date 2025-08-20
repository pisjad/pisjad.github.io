// --- 1. CUSTOM CURSOR ---
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');
const interactiveElements = document.querySelectorAll('[data-interactive]');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    
    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorTrail.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorTrail.classList.remove('hovered');
    });
});


// --- 2. HERO CANVAS ANIMATION (PIXEL RAIN) ---
const canvas = document.getElementById('pixel-rain');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.floor(canvas.width / 20);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = 0.8 + Math.random() * 1.5;
            this.size = 1.5 + Math.random() * 2;
            this.color = 'rgba(177, 206, 204, 0.6)';
        }
        update() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = 0 - this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}


// --- 3. GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

gsap.set("#pisjad-photo-modal", { autoAlpha: 0, scale: 0.8 });

gsap.from(".main-name", { duration: 1.5, scale: 0.9, opacity: 0, ease: "power3.out", delay: 0.5 });
gsap.from(".hero-subtitles", { duration: 1.5, y: 30, opacity: 0, ease: "power3.out", delay: 0.8 });
gsap.from("#intro-box", { duration: 1, y: -30, x: -30, rotation: -15, opacity: 0, ease: "power3.out", delay: 0.3 });

const titles = document.querySelectorAll('.section-title');
titles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

gsap.from(".skill-item", {
    scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out"
});

gsap.from(".project-card", {
    scrollTrigger: {
        trigger: "#jejak-karsa",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out"
});


// --- 4. PISJAD HOVER ANIMATION ---
const nameElement = document.querySelector('.main-name');
const introBox = document.getElementById('intro-box');
if (nameElement && introBox) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;
    const pisjadModal = document.getElementById('pisjad-photo-modal');

    nameElement.onmouseenter = event => {  
        let iteration = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            event.target.innerText = event.target.innerText
            .split("")
            .map((letter, index) => {
                if(index < iteration) {
                    return event.target.dataset.value[index];
                }
                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");
            
            if(iteration >= event.target.dataset.value.length){ 
                clearInterval(interval);
            }
            
            iteration += 1 / 3;
        }, 30);

        introBox.style.transform = 'rotate(-15deg) translate(-60px, -30px)';

        if (pisjadModal) {
            const rect = event.target.getBoundingClientRect();
            gsap.to(pisjadModal, {
                top: `${rect.top}px`,
                left: `${rect.right + 20}px`,
                autoAlpha: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power3.out'
            });
        }
    }

    nameElement.onmouseleave = () => {
        introBox.style.transform = 'rotate(-8deg) translate(0, 0)';

        if (pisjadModal) {
            gsap.to(pisjadModal, {
                autoAlpha: 0,
                scale: 0.8,
                duration: 0.2,
                ease: 'power3.in'
            });
        }
    }
}


// --- 5. PROJECT CARDS HOVER & MODAL LOGIC ---
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');
const closeModalBtn = document.getElementById('close-modal');

projectCards.forEach(card => {
    const img = card.querySelector('.project-image');
    const staticSrc = card.dataset.image;
    const gifSrc = card.dataset.gif;

    card.addEventListener('mouseenter', () => {
        if (gifSrc) img.src = gifSrc;
    });
    card.addEventListener('mouseleave', () => {
        if (staticSrc) img.src = staticSrc;
    });

    card.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = card.dataset.title;
        document.getElementById('modal-category').textContent = card.dataset.category;
        document.getElementById('modal-narrative').textContent = card.dataset.narrative;
        document.getElementById('modal-image').src = card.dataset.gif || card.dataset.image;
        
        gsap.to(modal, { autoAlpha: 1, duration: 0.3 });
        gsap.fromTo(modal.querySelector('.modal-content'), { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'power3.out' });
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    gsap.to(modal, { 
        autoAlpha: 0, 
        duration: 0.3,
        onComplete: () => {
            document.body.style.overflow = '';
        }
    });
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && gsap.getProperty(modal, "autoAlpha") > 0) {
        closeModal();
    }
});

// --- 6. SOCIAL ICON HOVER ---
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        gsap.to(icon, { y: -5, scale: 1.1, duration: 0.2, ease: 'power2.out' });
    });
    icon.addEventListener('mouseleave', () => {
        gsap.to(icon, { y: 0, scale: 1, duration: 0.2, ease: 'power2.in' });
    });
});
