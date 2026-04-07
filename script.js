// הגדרות קנבס לכוכבים (שחזור ושדרוג התוכנה הקודמת)
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

let particles = [];
const mouse = { x: null, y: null };

// עדכון גודל קנבס בשינוי גודל חלון
window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    // יצירת חלקיקים בזמן תזוזה (קצת פחות מבעבר כדי לא להכביד)
    for (let i = 0; i < 1; i++) {
        particles.push(new Particle());
    }
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        // כוכבים בגדלים שונים
        this.size = Math.random() * 2 + 0.5;
        // מהירות פיזור
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        // צבע טורקיז עם שקיפות משתנה
        this.color = `rgba(34, 211, 238, ${Math.random() * 0.7 + 0.3})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // דעיכה חלקה
        if (this.size > 0.1) this.size -= 0.03;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // הוספת אפקט זוהר קל
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(34, 211, 238, 0.5)";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // ביטול ה-Shadow לשאר הציורים
    }
}

function animate() {
    // ניקוי הקנבס עם אפקט "שבילים" (Fading trail)
    ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        // הסרת חלקיקים קטנים מידי
        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();

// --- פונקציות ממשק ---

// פונקציה לגלילה חלקה לאיזור יצירת הקשר
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // פוקוס על שדה השם אחרי הגלילה
        setTimeout(() => {
            document.getElementById('userName').focus();
        }, 800);
    }
}

// פונקציית וואטסאפ (0543821419)
function sendToWhatsApp() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    const phone = "+972543821419";
    
    // ניסוח הודעה שיווקית ומניעה לפעולה
    const message = encodeURIComponent(`היי! ראיתי את האתר שלך. אני מעוניין בדף נחיתה מקצועי בקוד ב-250₪. השם שלי הוא: ${name}`);
    
    if (name === "") {
        // הוספת סימון אדום אם השדה ריק
        nameInput.style.borderColor = "#ef4444";
        alert("נא להזין שם כדי שנדע איך לקרוא לך הודעה וואטסאפ :)");
        return;
    }
    
    // ניקוי סימון אדום
    nameInput.style.borderColor = "var(--border-glass)";
    
    // פתיחת וואטסאפ בחלון חדש
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}
