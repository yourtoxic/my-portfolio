// =============================================
//  iOS 26 LIQUID GLASS PORTFOLIO
//  Multi-Layer Dynamic Background + Glass
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    //  PARTICLE SYSTEM (Canvas Background)
    // =============================================

    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePos = { x: 0, y: 0 };
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;

            // Mouse interaction
            const dx = mousePos.x - this.x;
            const dy = mousePos.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            const pulsedOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${pulsedOpacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animFrame = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // =============================================
    //  CURSOR EFFECTS
    // =============================================

    const cursorGlow = document.getElementById('cursorGlow');
    const cursorRipple = document.getElementById('cursorRipple');
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    function animateGlow() {
        glowX += (mousePos.x - glowX) * 0.06;
        glowY += (mousePos.y - glowY) * 0.06;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Click ripple
    document.addEventListener('click', (e) => {
        cursorRipple.style.left = e.clientX + 'px';
        cursorRipple.style.top = e.clientY + 'px';
        cursorRipple.classList.remove('active');
        void cursorRipple.offsetWidth;
        cursorRipple.classList.add('active');
    });

    // =============================================
    //  BACKGROUND THEME SWITCHER
    // =============================================

    const bgOptions = document.querySelectorAll('.bg-option');

    bgOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            bgOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const theme = btn.getAttribute('data-bg');
            document.body.setAttribute('data-bg', theme);

            // Smooth transition for body background
            document.body.style.transition = 'background-color 1.5s ease';

            // Reinitialize particles with theme color
            initParticles();
        });
    });

    // =============================================
    //  NAVIGATION
    // =============================================

    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Scroll to Top Button Visibility
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === current);
        });
    }, { passive: true });

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile Nav
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =============================================
    //  COUNTER ANIMATION
    // =============================================

    let counterStarted = false;

    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const startTime = performance.now();
            const duration = 2000;

            function update(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(target * eased);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
            }
            requestAnimationFrame(update);
        });
    }

    // =============================================
    //  SKILL BARS
    // =============================================

    function animateSkillBars() {
        document.querySelectorAll('.skill-fill').forEach(fill => {
            fill.style.width = fill.getAttribute('data-width') + '%';
        });
    }

    // =============================================
    //  SCROLL REVEAL
    // =============================================

    const revealElements = document.querySelectorAll(
        '.liquidGlass-wrapper, .section-header, .hero-content, .hero-visual, .scroll-indicator'
    );

    function addStaggerDelays() {
        const grids = ['.skills-grid', '.projects-grid', '.achievements-grid', '.about-cards', '.hero-stats', '.social-links', '.tool-grid'];
        grids.forEach(sel => {
            const grid = document.querySelector(sel);
            if (grid) {
                grid.querySelectorAll(':scope > .liquidGlass-wrapper').forEach((child, i) => {
                    child.dataset.delay = i * 100;
                });
            }
        });
    }
    addStaggerDelays();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => {
        if (el.classList.contains('glass-nav') || el.classList.contains('bg-switcher') || el.classList.contains('hero-roles-glass') || el.classList.contains('roles-wrapper')) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease';
        revealObserver.observe(el);
    });

    // Trigger counters & skill bars
    const statsSection = document.querySelector('.hero-stats');
    const skillsSection = document.getElementById('skills');

    const triggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === statsSection && !counterStarted) {
                    counterStarted = true;
                    animateCounters();
                }
                if (entry.target === skillsSection) {
                    setTimeout(animateSkillBars, 400);
                }
                triggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) triggerObserver.observe(statsSection);
    if (skillsSection) triggerObserver.observe(skillsSection);

    // =============================================
    //  PROJECT FILTER
    // =============================================

    document.querySelectorAll('.filter-btn-glass').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn-glass').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            document.querySelectorAll('.project-card-glass').forEach((card, i) => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, i * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => card.classList.add('hidden'), 350);
                }
            });
        });
    });

    // =============================================
    //  CONTACT FORM
    // =============================================

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn-glass');
            const content = btn.querySelector('.btn-content');
            const original = content.innerHTML;

            content.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.style.pointerEvents = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formsubmit.co/ajax/hereistajriyanrahman@gmail.com', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    content.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    setTimeout(() => {
                        content.innerHTML = original;
                        btn.style.pointerEvents = 'auto';
                        contactForm.reset();
                    }, 3000);
                } else {
                    content.innerHTML = '<span>Failed! Try Again</span><i class="fas fa-exclamation"></i>';
                    setTimeout(() => {
                        content.innerHTML = original;
                        btn.style.pointerEvents = 'auto';
                    }, 3000);
                }
            } catch (error) {
                content.innerHTML = '<span>Error! Try Again</span><i class="fas fa-triangle-exclamation"></i>';
                setTimeout(() => {
                    content.innerHTML = original;
                    btn.style.pointerEvents = 'auto';
                }, 3000);
            }
        });
    }

    // =============================================
    //  3D TILT + DYNAMIC SHINE (Desktop)
    // =============================================

    if (window.innerWidth > 768) {
        const tiltTargets = document.querySelectorAll(
            '.project-card-glass, .achievement-card-glass, .skill-card-glass, .info-card-glass'
        );

        tiltTargets.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 25;
                const rotateY = (rect.width / 2 - x) / 25;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });

        // Dynamic shine
        document.querySelectorAll('.liquidGlass-shine').forEach(shine => {
            const parent = shine.closest('.liquidGlass-wrapper');
            if (!parent) return;

            parent.addEventListener('mousemove', (e) => {
                const rect = parent.getBoundingClientRect();
                const px = ((e.clientX - rect.left) / rect.width) * 100;
                const py = ((e.clientY - rect.top) / rect.height) * 100;

                shine.style.boxShadow = `
                    inset ${2 + (px - 50) * 0.06}px ${2 + (py - 50) * 0.06}px 2px 0 rgba(255,255,255,${0.35 + px / 250}),
                    inset ${-1 - (px - 50) * 0.04}px ${-1 - (py - 50) * 0.04}px 2px 1px rgba(255,255,255,${0.25 + py / 350})
                `;
            });

            parent.addEventListener('mouseleave', () => {
                shine.style.boxShadow = 'inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)';
            });
        });
    }

    // =============================================
    //  TYPING EFFECT
    // =============================================

    const heroName = document.getElementById('heroName');
    const nameText = heroName.textContent;
    heroName.textContent = '';
    heroName.style.borderRight = '3px solid rgba(255,255,255,0.7)';
    heroName.style.animation = 'none';

    let charIndex = 0;
    function typeName() {
        if (charIndex < nameText.length) {
            heroName.textContent += nameText.charAt(charIndex);
            charIndex++;
            setTimeout(typeName, 100 + Math.random() * 50);
        } else {
            setTimeout(() => {
                heroName.style.borderRight = 'none';
                heroName.style.animation = 'shimmer 3s ease-in-out infinite';
            }, 800);
        }
    }
    setTimeout(typeName, 600);

    // =============================================
    //  ROLES ANIMATION
    // =============================================

    const roleText = document.getElementById('roleText');
    const roles = ['EEE Undergrade', 'Bug Bounty Hunter', 'CTF Player', 'Ethical Hacker', 'Coder'];
    let roleIndex = 0;

    if (roleText) {
        roleText.classList.add('fade-in');
        
        setInterval(() => {
            roleText.classList.remove('fade-in');
            roleText.classList.add('fade-out');
            
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleText.textContent = roles[roleIndex];
                roleText.classList.remove('fade-out');
                roleText.classList.add('fade-in');
            }, 400);
        }, 2800);
    }

    // =============================================
    //  ANIMATED SVG TURBULENCE (Liquid Motion)
    // =============================================

    const turbulences = document.querySelectorAll('feTurbulence');
    let turbFrame;

    function animateTurbulence() {
        const time = performance.now() * 0.0001;
        turbulences.forEach((turb, i) => {
            const base = 0.012 + i * 0.003;
            const freq = base + Math.sin(time + i) * 0.003;
            turb.setAttribute('baseFrequency', `${freq} ${freq}`);
        });
        turbFrame = requestAnimationFrame(animateTurbulence);
    }
    animateTurbulence();

    // =============================================
    //  PARALLAX ORBS ON SCROLL
    // =============================================

    const orbs = document.querySelectorAll('.orb');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.015;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });

    // =============================================
    //  PERFORMANCE: Pause when tab hidden
    // =============================================

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animFrame);
            cancelAnimationFrame(turbFrame);
        } else {
            animateParticles();
            animateTurbulence();
        }
    });

});