// SỬA LỖI TẠI ĐÂY
document.addEventListener('DOMContentLoaded', function() {
    // --- KHỞI TẠO BAN ĐẦU ---
    const music = document.getElementById("bg-music");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const messageBackdrop = document.getElementById("message-backdrop");
    const messageCard = document.getElementById("message-card");

    // --- CÁC BIẾN TOÀN CỤC ---
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = [];
    const heartStars = [];
    let meteors = [];
    let fallingTexts = [];
    const clickTexts = [];

    let mouseX = width / 2;
    let mouseY = height / 2;
    let heartBeat = 1;
    let heartScale = Math.min(width, height) * 0.015;

    let heartClickCount = 0;
    const requiredClicks = 10;
    let isMessageVisible = false;

    let fallingTextInterval;
    let meteorInterval;

    const messages = [
        "Cammm gayyyy", "Thùyyyy gayyyy", "Manhh gayyyy", "Suplo gayyyy", "Trunnn gayyyy x2",
        "VMC GAYYYYYYYYYYY", "Híuuu gayyyyyyyy", "Phonggg gayyyyy", "Đạtt gayyyyy", "Luânn gayyyyyy",
        "Đứcc gayyyyy", "Như gayyyy", "Quỳnhh gayyyy", "Gianggg gayyyy"
    ];

    // --- CÁC HÀM TẠO HIỆU ỨNG ---
    function heartShape(t, scale = 1) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x: x * scale, y: y * scale };
    }
    function createHeartStars(count = 1600) {
        const centerX = width / 2;
        const centerY = height / 2 + 20;
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const heart = heartShape(t, heartScale);
            const offsetX = (Math.random() - 0.5) * 15;
            const offsetY = (Math.random() - 0.5) * 15;
            const targetX = centerX + heart.x + offsetX;
            const targetY = centerY + heart.y + offsetY;
            heartStars.push({x: Math.random() * width, y: Math.random() * height, targetX, targetY, originalX: targetX, originalY: targetY, size: Math.random() * 3 + 1, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.02 + 0.01, brightness: Math.random() * 0.5 + 0.5, hue: Math.random() * 60 + 300, mode: "flying"});
        }
    }
    function createBackgroundStars(count = 200) {
        for (let i = 0; i < count; i++) {
            stars.push({x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + 0.5, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.01 + 0.005, brightness: Math.random() * 0.3 + 0.2});
        }
    }
    function createMeteor() {
        meteors.push({x: Math.random() * width, y: -50, length: Math.random() * 80 + 50, speed: Math.random() * 6 + 6, angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, alpha: 1});
    }
    function createFallingText() {
        const text = messages[Math.floor(Math.random() * messages.length)];
        const fontSize = Math.random() * 10 + 10;
        ctx.font = `bold ${fontSize}px Pacifico`;
        const textWidth = ctx.measureText(text).width;
        const x = Math.random() * (width - textWidth);
        fallingTexts.push({text, x, y: -10, speed: Math.random() * 2 + 2, alpha: 1, fontSize, hue: Math.random() * 360});
    }
    
    // --- VÒNG LẶP CHÍNH (ANIMATE) ---
    function animate() {
        ctx.clearRect(0, 0, width, height);
        heartBeat += 0.03;
        stars.forEach(star => {
            star.twinkle += star.twinkleSpeed;
            const flicker = Math.random() < 0.005 ? 1 : 0;
            const baseOpacity = star.brightness * (0.4 + 0.6 * Math.sin(star.twinkle));
            const opacity = Math.min(1, baseOpacity + flicker);
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = flicker ? 20 : 0;
            ctx.shadowColor = flicker ? "#fff" : "transparent";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });
        meteors.forEach((m, i) => {
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.alpha -= 0.005;
            if (m.alpha <= 0) meteors.splice(i, 1);
            else {
                const dx = Math.cos(m.angle) * m.length;
                const dy = Math.sin(m.angle) * m.length;
                ctx.save();
                ctx.globalAlpha = m.alpha;
                const gradient = ctx.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy);
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x - dx, m.y - dy);
                ctx.stroke();
                ctx.restore();
            }
        });
        fallingTexts.forEach((t, i) => {
            t.y += t.speed;
            t.alpha -= 0.002;
            if (t.y > height + 30 || t.alpha <= 0) fallingTexts.splice(i, 1);
            else {
                ctx.save();
                ctx.font = `bold ${t.fontSize}px Pacifico`;
                ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
                ctx.shadowBlur = 5;
                ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
                ctx.fillText(t.text, t.x, t.y);
                ctx.restore();
            }
        });
        clickTexts.forEach((t, i) => {
            t.alpha -= 0.02;
            if (t.alpha <= 0) clickTexts.splice(i, 1);
            else {
                ctx.save();
                ctx.font = `bold ${t.fontSize}px ${t.font || 'Poppins'}`;
                ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(t.text, t.x, t.y);
                ctx.restore();
            }
        });
        heartStars.forEach(star => {
            star.twinkle += star.twinkleSpeed;
            const centerX = width / 2, centerY = height / 2 + 20;
            if (star.mode === "flying") {
                const dx = star.targetX - star.x, dy = star.targetY - star.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 1) {
                    star.x += dx * 0.07;
                    star.y += dy * 0.07;
                } else star.mode = "heart";
            } else {
                const deltaX = star.originalX - centerX, deltaY = star.originalY - centerY;
                const beatScale = 1 + Math.sin(heartBeat) * 0.05;
                star.x = centerX + deltaX * beatScale;
                star.y = centerY + deltaY * beatScale;
                const distanceToMouse = Math.hypot(mouseX - star.x, mouseY - star.y);
                if (distanceToMouse < 100) {
                    const force = (100 - distanceToMouse) / 100;
                    const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
                    star.x += Math.cos(angle) * force * 10;
                    star.y += Math.sin(angle) * force * 10;
                }
            }
            let twinkleOpacity = star.brightness * (0.3 + 0.5 * Math.sin(star.twinkle));
            if (isMessageVisible) {
                twinkleOpacity *= 0.1;
            }
            ctx.save();
            ctx.globalAlpha = twinkleOpacity;
            ctx.fillStyle = `hsl(${star.hue}, 70%, 80%)`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${star.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });
        requestAnimationFrame(animate);
    }
    
    // --- CÁC HÀM ĐỂ BẮT ĐẦU/DỪNG HIỆU ỨNG NỀN ---
    function startBackgroundEffects() {
        if (!fallingTextInterval) fallingTextInterval = setInterval(createFallingText, 2000);
        if (!meteorInterval) meteorInterval = setInterval(createMeteor, 3000);
    }
    function stopBackgroundEffects() {
        clearInterval(fallingTextInterval);
        clearInterval(meteorInterval);
        fallingTextInterval = null;
        meteorInterval = null;
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const playMusicOnce = () => {
        music.play().catch(e => console.log("Music play blocked:", e));
        window.removeEventListener("click", playMusicOnce, { once: true });
    };
    window.addEventListener("click", playMusicOnce, { once: true });

    canvas.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener("click", e => {
        const randomNameText = messages[Math.floor(Math.random() * messages.length)];
        clickTexts.push({
            text: randomNameText, 
            x: e.clientX, 
            y: e.clientY, 
            alpha: 1.0, 
            fontSize: Math.random() * 20 + 15, 
            hue: Math.random() * 360, 
            font: 'Pacifico'
        });

        if (isMessageVisible) {
            messageBackdrop.classList.add("hidden");
            messageCard.classList.add("hidden");
            isMessageVisible = false;
            startBackgroundEffects();
            heartClickCount = 0;
        } else {
            heartClickCount++;
            
            if (heartClickCount >= requiredClicks) {
                isMessageVisible = true;
                messageBackdrop.classList.remove("hidden");
                messageCard.classList.remove("hidden");
                stopBackgroundEffects();
            } else {
                const centerX = width / 2, centerY = height / 2 + 20;
                heartScale *= 1.015;
                heartStars.forEach((star, i) => {
                    const t = (i / heartStars.length) * Math.PI * 2;
                    const heart = heartShape(t, heartScale);
                    const offsetX = (Math.random() - 0.5) * 15;
                    const offsetY = (Math.random() - 0.5) * 15;
                    star.targetX = centerX + heart.x + offsetX;
                    star.originalX = star.targetX;
                    star.targetY = centerY + heart.y + offsetY;
                    star.originalY = star.targetY;
                });
                for (let i = 0; i < 5; i++) {
                    const t = Math.random() * Math.PI * 2;
                    const heart = heartShape(t, heartScale);
                    const targetX = centerX + heart.x, targetY = centerY + heart.y;
                    heartStars.push({x: e.clientX + (Math.random() - 0.5) * 50, y: e.clientY + (Math.random() - 0.5) * 50, targetX, targetY, originalX: targetX, originalY: targetY, size: Math.random() * 3 + 2, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.03 + 0.02, brightness: Math.random() * 0.8 + 0.6, hue: Math.random() * 60 + 300, mode: "flying"});
                }
            }
        }
    });
    
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        heartScale = Math.min(width, height) * 0.015;
        stars.length = 0;
        heartStars.length = 0;
        createBackgroundStars();
        createHeartStars();
    });

    startBackgroundEffects();
    createBackgroundStars();
    createHeartStars();
    animate();
});
