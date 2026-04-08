// הגדרות קנבס לכוכבים
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

let particles = [];
const mouse = { x: null, y: null };
let isEffectActive = true; 

window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;
});

window.addEventListener('mousemove', (e) => {
    if (!isEffectActive) return; 
    mouse.x = e.x;
    mouse.y = e.y;
    // מוסיף חלקיק אחד בכל תזוזה
    particles.push(new Particle(mouse.x, mouse.y));
});

class Particle {
    constructor(x, y) {
        // אם לא קיבלנו מיקום, ניצור מיקום רנדומלי (לכוכבי רקע)
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
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
    
    // 1. יצירת כוכבי רקע באופן קבוע (גם כשלא מזיזים עכבר)
    if (isEffectActive && Math.random() > 0.7) { 
        particles.push(new Particle()); // יוצר כוכב במיקום רנדומלי
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    // ממשיך את הלופ רק אם האפקט פעיל או שיש עדיין חלקיקים שצריכים להיעלם
    if (isEffectActive || particles.length > 0) {
        requestAnimationFrame(animate);
    }
}

animate();

// --- פונקציות ממשק ---

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const userNameField = document.getElementById('userName');
            if(userNameField) userNameField.focus();
        }, 800);
    }
}

function sendToWhatsApp() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    const phone = "+972543821419";
    
    const message = encodeURIComponent(`היי! ראיתי את האתר שלך. אני מעוניין בדף נחיתה מקצועי בקוד ב-250₪. השם שלי הוא: ${name}`);
    
    if (name === "") {
        nameInput.style.borderColor = "#ef4444";
        alert("נא להזין שם כדי שנדע איך לקרוא לך הודעה וואטסאפ :)");
        return;
    }
    
    nameInput.style.borderColor = "var(--border-glass)";
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// --- מנגנון הדהייה והכיבוי ---
window.addEventListener('load', () => {
    setTimeout(() => {
        isEffectActive = false; // מפסיק יצירת כוכבים חדשים
        canvas.style.opacity = '0'; // דהייה ויזואלית
        
        setTimeout(() => {
            canvas.style.display = 'none'; // העלמה מוחלטת מה-DOM
        }, 2000); 
    }, 3000);
});
