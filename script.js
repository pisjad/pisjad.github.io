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
    const particleCount = Math.floor(canvas.width / 20); // More particles

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = 0.8 + Math.random() * 1.5;
            this.size = 1.5 + Math.random() * 2; // Slightly bigger
            this.color = 'rgba(177, 206, 204, 0.6)'; // More opaque
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

// Hero text animation
gsap.from(".main-name", { duration: 1.5, scale: 0.9, opacity: 0, ease: "power3.out", delay: 0.5 });
gsap.from(".hero-subtitles", { duration: 1.5, y: 30, opacity: 0, ease: "power3.out", delay: 0.8 });
gsap.from("#intro-box", { duration: 1, y: -30, x: -30, rotation: -15, opacity: 0, ease: "power3.out", delay: 0.3 });


// General section fade-in animation
const sections = document.querySelectorAll('.anim-section');
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });
});

// --- 4. PISJAD HOVER ANIMATION ---
const nameElement = document.querySelector('.main-name');
const introBox = document.getElementById('intro-box');
if (nameElement && introBox) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;

    nameElement.addEventListener('mouseenter', event => {  
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
    });

    nameElement.addEventListener('mouseleave', () => {
        introBox.style.transform = 'rotate(-8deg) translate(0, 0)';
    });
}


// --- 5. PROJECT CARDS HOVER & MODAL LOGIC ---
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');
const closeModalBtn = document.getElementById('close-modal');

projectCards.forEach(card => {
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
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('invisible');
        document.body.style.overflow = '';
    }, 300);
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && !modal.classList.contains('invisible')) {
        closeModal();
    }
});