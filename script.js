// הגדרות קנבס לכוכבים
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
canvas.width = windowWidth;
canvas.height = windowHeight;

let particles = [];
const mouse = { x: null, y: null };
let fadeTimeout;

// עדכון גודל קנבס בשינוי חלון
window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;
});

// פונקציות עזר לאפקט
function showCanvas() {
    canvas.style.opacity = '1';
    canvas.style.display = 'block';
}

function startFade() {
    canvas.style.opacity = '0';
    // אחרי סיום הדהייה, מנקים פיזית את הקנבס ומרוקנים את רשימת הכוכבים
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = []; 
    }, 1000); // 1000ms תואם ל-transition ב-CSS
}

// לוגיקת תנועת העכבר
window.addEventListener('mousemove', (e) => {
    // אם האפקט כבוי, מנקים את המערך כדי למנוע שאריות
    if (canvas.style.opacity === '0' || canvas.style.display === 'none') {
        particles = [];
    }
    
    showCanvas();
    mouse.x = e.x;
    mouse.y = e.y;
    
    // יצירת חלקיקים
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }

    // רענון טיימר הדהייה
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
        startFade();
    }, 1000); // האפקט יתחיל לדעוך שנייה אחת אחרי הפסקת התנועה
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

// --- פונקציות ממשק ---

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const field = document.getElementById('userName');
            if(field) field.focus();
        }, 800);
    }
}

function sendToWhatsApp() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    const phone = "+972543821419";
    
    if (name === "") {
        nameInput.style.borderColor = "#ef4444";
        alert("נא להזין שם כדי שנדע איך לקרוא לך הודעה וואטסאפ :)");
        return;
    }
    
    const message = encodeURIComponent(`היי! ראיתי את האתר שלך. אני מעוניין בדף נחיתה מקצועי בקוד ב-250₪. השם שלי הוא: ${name}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}
