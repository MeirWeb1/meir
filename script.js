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

// ... (הגדרות בסיסיות נשארות אותו דבר)

function startFade() {
    canvas.style.opacity = '0';
    
    // איפוס מיידי של המערך כדי שה-animate לא יצייר כלום יותר
    particles = []; 
    
    // ניקוי פיזי של כל הקנבס כדי שלא יישאר "צל"
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 100); // ניקוי מהיר מאוד מיד אחרי תחילת הדהייה
}

window.addEventListener('mousemove', (e) => {
    // אם האפקט חוזר מדהייה, מנקים הכל כדי להתחיל דף חלק
    if (parseFloat(canvas.style.opacity) < 0.1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }

    canvas.style.opacity = '1';
    mouse.x = e.x;
    mouse.y = e.y;
    
    // יצירת חלקיקים
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
        startFade();
    }, 1000); 
});

function animate() {
    // אם אין חלקיקים והאפקט בדהייה, אין טעם לצייר "שובלים" של רקע
    if (particles.length > 0) {
        ctx.fillStyle = 'rgba(3, 7, 18, 0.15)'; // השובל השחור
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
    } else {
        // אם המערך ריק, אנחנו מוודאים שהקנבס נקי לגמרי
        // זה מונע מה"היסטוריה" להיתקע
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    requestAnimationFrame(animate);
}

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
