// ===== CSRF HELPER =====
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
    });
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== TYPING EFFECT =====
const typedTextSpan = document.querySelector('.typed-text');
const textArray = ['Full Stack Developer','Data Analyst','ML Engineer','Python Developer'];
const typingDelay = 100, erasingDelay = 50, newTextDelay = 2000;
let textArrayIndex = 0, charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else setTimeout(erase, newTextDelay);
}
function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex = (textArrayIndex+1) % textArray.length;
        setTimeout(type, typingDelay + 1100);
    }
}
document.addEventListener('DOMContentLoaded', () => setTimeout(type, newTextDelay + 250));

// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.skill-progress');
const observerOptions = { threshold: 0.5, rootMargin: '0px 0px -100px 0px' };
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.style.animation='progressBar 1.5s ease-out forwards'; });
}, observerOptions);
skillBars.forEach(bar => skillObserver.observe(bar));

// ===== SCROLL ANIMATIONS =====
const animateOnScroll = () => {
    document.querySelectorAll('.skill-category, .project-card, .timeline-item, .contact-card').forEach(el => {
        const top = el.getBoundingClientRect().top;
        const bottom = el.getBoundingClientRect().bottom;
        if(top < window.innerHeight-100 && bottom>0){el.style.opacity='1'; el.style.transform='translateY(0)';}
    });
};
document.querySelectorAll('.skill-category, .project-card, .timeline-item, .contact-card').forEach(el=>{
    el.style.opacity='0'; el.style.transform='translateY(30px)'; el.style.transition='opacity 0.6s ease, transform 0.6s ease';
});
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ===== CONTACT FORM HANDLING WITH CSRF =====
// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
let selectedRating = null;

// Star rating
document.querySelectorAll('.star-rating input').forEach(star => {
    star.addEventListener('change', () => {
        selectedRating = star.value;
        document.querySelector('.rating-text').textContent = `${selectedRating} star${selectedRating > 1 ? 's' : ''} selected`;
    });
});

contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    if (selectedRating) formData.set('rating', selectedRating);

    // CSRF token for AJAX
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';

    try {
        const response = await fetch(contactForm.action || window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            }
        });

        if (response.ok) {
            formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
            formMessage.className = 'form-message success';
            contactForm.reset();
            selectedRating = null;
            document.querySelector('.rating-text').textContent = 'No rating selected';
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        formMessage.textContent = 'Oops! Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});



// ===== PARTICLES =====
function createParticle(){
    const p=document.createElement('div');
    p.className='particle';
    p.style.cssText=`
        position:absolute;
        width:${Math.random()*4+1}px;
        height:${Math.random()*4+1}px;
        background:rgba(0,102,255,${Math.random()*0.5+0.2});
        border-radius:50%;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation:float ${Math.random()*10+10}s ease-in-out infinite;
        pointer-events:none;
    `;
    return p;
}
const heroParticles=document.querySelector('.hero-particles');
if(heroParticles) for(let i=0;i<30;i++) heroParticles.appendChild(createParticle());

// ===== CURSOR TRAIL =====
let cursorTrail=[],trailLength=20;
document.addEventListener('mousemove',e=>{
    if(window.innerWidth>768){
        cursorTrail.push({x:e.clientX,y:e.clientY,time:Date.now()});
        if(cursorTrail.length>trailLength) cursorTrail.shift();
    }
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load',()=>{ document.body.style.opacity='1'; });
document.body.style.transition='opacity 0.5s ease';

// ===== LAZY LOADING IMAGES =====
if('IntersectionObserver' in window){
    const imageObserver=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const img=entry.target;
                if(img.dataset.src){ img.src=img.dataset.src; img.removeAttribute('data-src'); }
                observer.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img=>imageObserver.observe(img));
}

// ===== MAILTO LINKS TO GMAIL =====
document.querySelectorAll('a[href^="mailto:"]').forEach(link=>{
    link.addEventListener('click',(e)=>{
        e.preventDefault();
        const href=link.href;
        const email=href.replace('mailto:','').split('?')[0];
        const params=href.includes('?')?href.split('?')[1]:'';
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&${params}`,'_blank');
    });
});

// ===== FADEOUT ANIMATION =====
const style=document.createElement('style');
style.textContent=`@keyframes fadeOut{0%{opacity:1}70%{opacity:1}100%{opacity:0}}`;
document.head.appendChild(style);

// ===== SCROLL TO TOP BUTTON =====
const createScrollToTop=()=>{
    const button=document.createElement('button');
    button.innerHTML='<i class="fas fa-arrow-up"></i>';
    button.className='scroll-to-top';
    button.style.cssText=`
        position:fixed;bottom:30px;right:30px;width:50px;height:50px;
        background:linear-gradient(135deg,#0066ff,#00d9ff);color:white;
        border:none;border-radius:50%;cursor:pointer;display:none;
        align-items:center;justify-content:center;font-size:20px;
        z-index:1000;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(0,102,255,0.3);
    `;
    button.addEventListener('click',()=>{ window.scrollTo({top:0,behavior:'smooth'}); });
    button.addEventListener('mouseenter',()=>{ button.style.transform='translateY(-5px) scale(1.1)'; });
    button.addEventListener('mouseleave',()=>{ button.style.transform='translateY(0) scale(1)'; });
    window.addEventListener('scroll',()=>{
        if(window.scrollY>500) button.style.display='flex';
        else button.style.display='none';
    });
    document.body.appendChild(button);
};
createScrollToTop();

console.log('%c Portfolio Website Loaded Successfully! ','background: linear-gradient(135deg, #0066ff, #00d9ff); color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('%c Made with ❤️ by Nagesh ','color: #0066ff; font-size: 14px;');




