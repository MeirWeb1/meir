const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
canvas.width = windowWidth;
canvas.height = windowHeight;

let particles = [];
const mouse = { x: null, y: null };
let fadeTimeout; // משתנה שיחזיק את הטיימר

window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;
});

// פונקציה שמפעילה/מחזירה את האפקט
function showCanvas() {
    canvas.style.opacity = '1';
    canvas.style.display = 'block';
}

// פונקציה שמתחילה את הדהייה
function startFade() {
    canvas.style.opacity = '0';
    // אנחנו לא מוחקים את הקנבס מהדף (remove), רק מסתירים ב-CSS
}

window.addEventListener('mousemove', (e) => {
    // 1. ברגע שיש תנועה - מראים את הקנבס מיד
    showCanvas();
    
    mouse.x = e.x;
    mouse.y = e.y;
    
    // 2. יוצרים חלקיקים
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }

    // 3. מנגנון הדהייה: מבטלים את הטיימר הקודם ומתחילים חדש
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
        startFade();
    }, 2000); // האפקט יתחיל לדעוך אחרי 2 שניות של חוסר תנועה
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = `rgba(34, 211, 238, ${Math.random() * 0.7 + 0.3})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.03;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(34, 211, 238, 0.5)";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function animate() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

animate();

// פונקציות הממשק (WhatsApp וגלילה) נשארות אותו דבר...
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function sendToWhatsApp() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    if (name === "") {
        alert("נא להזין שם");
        return;
    }
    window.open(`https://wa.me/972543821419?text=היי, אני ${name}`, '_blank');
}
