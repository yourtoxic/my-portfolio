// ============================================
// LIQUID GLASS PORTFOLIO - Main JavaScript
// Author: tajriyan_rahman
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- Navigation Toggle ----
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Toggle mobile menu
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // ---- Active Nav Link on Scroll ----
    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---- Typing Effect ----
    const typingTexts = [
        'Cybersecurity Enthusiast',
        'Ethical Hacker',
        'Bug Bounty Hunter',
        'CTF Player',
        'Python Developer',
        'EEE Undergraduate',
        'Penetration Tester',
        'Security Researcher'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typingText');

    function type() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            updateCounter();
        });
    }

    // ---- Scroll Reveal ----
    function setupScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.skill-card, .project-card, .ctf-card, .contact-card, .contact-form, .about-card, .about-terminal, .about-image-wrapper'
        );

        revealElements.forEach(el => {
            el.classList.add('reveal');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger counter animation when about section is visible
                    if (entry.target.classList.contains('about-card')) {
                        animateCounters();
                    }

                    // Animate skill bars
                    if (entry.target.classList.contains('skill-card')) {
                        const bar = entry.target.querySelector('.level-bar');
                        if (bar) {
                            const level = bar.getAttribute('data-level');
                            setTimeout(() => {
                                bar.style.width = level + '%';
                            }, 300);
                        }
                    }
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    setupScrollReveal();

    // ---- Particle System ----
    function initParticles() {
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const particleCount = 60;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                const alpha = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
                ctx.fillStyle = `rgba(0, 128, 255, ${alpha})`;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const alpha = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = `rgba(0, 128, 255, ${alpha})`;

                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();
    }

    initParticles();

    // ---- Matrix Rain Effect ----
    function initMatrixRain() {
        const container = document.getElementById('matrixRain');
        if (!container) return;

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = Math.floor(container.offsetWidth / 16);

        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${i * 16}px;
                top: ${Math.random() * -100}%;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                line-height: 1.4;
                color: #00ff00;
                writing-mode: vertical-rl;
                animation: matrixFall ${3 + Math.random() * 5}s linear infinite;
                animation-delay: ${Math.random() * 3}s;
            `;

            let text = '';
            for (let j = 0; j < 20; j++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            column.textContent = text;
            container.appendChild(column);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes matrixFall {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(500px); }
            }
        `;
        document.head.appendChild(style);
    }

    initMatrixRain();

    // ---- Tilt Effect for Cards ----
    function initTiltEffect() {
        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    initTiltEffect();

    // ---- Contact Form Handler ----
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.btn-submit');
        const originalContent = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
            
            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 2000);
    });

    // ---- Smooth Scroll for Nav Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---- Staggered Reveal for Grid Items ----
    function staggerReveal() {
        const grids = document.querySelectorAll('.skills-grid, .projects-grid, .ctf-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.reveal');
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
            });
        });
    }

    staggerReveal();

    // ---- Magnetic Effect for Social Icons ----
    const magneticElements = document.querySelectorAll('.glass-icon, .glass-badge');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ---- Console Easter Egg ----
    console.log('%c🔒 tajriyan_rahman Portfolio', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
    console.log('%cHacking is not a crime, it\'s a skill! 🚀', 'font-size: 14px; color: #7b61ff;');
    console.log('%cLooking for vulnerabilities? Good luck! 😎', 'font-size: 12px; color: #ff6b9d;');

    // ---- Preloader (simple) ----
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
