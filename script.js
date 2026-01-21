// Inisialisasi efek fluid 3D di background
function initFluidBackground() {
    const canvas = document.getElementById('fluidCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Partikel untuk efek fluid
    const particles = [];
    const particleCount = 150;
    const connectionDistance = 150;
    
    // Warna tema cyberpunk soft hijau
    const colorPalette = [
        '#00ff9d', '#00cc7a', '#80e0b0', '#a0ffd0', '#00a35c'
    ];
    
    // Buat partikel
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Pantulkan partikel dari tepi canvas
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }
    
    // Inisialisasi partikel
    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Gambar koneksi antar partikel
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#00ff9d';
                    ctx.globalAlpha = 0.1 * (1 - distance / connectionDistance);
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    
    // Animasi loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update dan gambar partikel
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Gambar koneksi
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
}

// Rotating structure functionality
function initRotatingStructure() {
    const rotatingStructure = document.querySelector('.rotating-structure');
    const panels = document.querySelectorAll('.info-panel');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const toggleRotationBtn = document.getElementById('toggleRotation');
    
    let currentAngle = 0;
    let isRotating = false;
    let rotationInterval;
    const rotationSpeed = 0.5; // Derajat per frame
    
    // Fungsi untuk memutar struktur
    function rotateStructure(angle) {
        currentAngle = angle;
        
        // Update transform untuk rotating structure
        rotatingStructure.style.transform = `rotateY(${currentAngle}deg)`;
        
        // Update posisi dan rotasi panel untuk efek 3D
        panels.forEach((panel, index) => {
            const panelAngle = currentAngle + (index * 90);
            const radius = 400; // Jarak dari pusat
            
            // Hitung posisi panel dalam lingkaran
            const x = Math.sin(panelAngle * Math.PI / 180) * radius;
            const z = Math.cos(panelAngle * Math.PI / 180) * radius;
            const panelRotation = -panelAngle;
            
            // Terapkan transform 3D
            panel.style.transform = `
                translate3d(${x}px, 0, ${z}px)
                rotateY(${panelRotation}deg)
            `;
            
            // Atur opacity berdasarkan kedalaman (z-index efek)
            const depth = (z + radius) / (2 * radius);
            panel.style.opacity = 0.5 + (depth * 0.5);
            panel.style.zIndex = Math.floor(depth * 10);
        });
    }
    
    // Fungsi untuk memulai rotasi otomatis
    function startAutoRotation() {
        if (!isRotating) {
            isRotating = true;
            toggleRotationBtn.innerHTML = '<i class="fas fa-pause"></i> Hentikan Rotasi';
            
            rotationInterval = setInterval(() => {
                currentAngle += rotationSpeed;
                rotateStructure(currentAngle);
            }, 16); // ~60 FPS
        }
    }
    
    // Fungsi untuk menghentikan rotasi otomatis
    function stopAutoRotation() {
        if (isRotating) {
            isRotating = false;
            clearInterval(rotationInterval);
            toggleRotationBtn.innerHTML = '<i class="fas fa-play"></i> Putar Otomatis';
        }
    }
    
    // Event listeners untuk kontrol rotasi
    rotateLeftBtn.addEventListener('click', () => {
        stopAutoRotation();
        currentAngle += 90;
        rotateStructure(currentAngle);
    });
    
    rotateRightBtn.addEventListener('click', () => {
        stopAutoRotation();
        currentAngle -= 90;
        rotateStructure(currentAngle);
    });
    
    toggleRotationBtn.addEventListener('click', () => {
        if (isRotating) {
            stopAutoRotation();
        } else {
            startAutoRotation();
        }
    });
    
    // Tambahkan interaksi hover pada panel
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            stopAutoRotation();
            panel.style.boxShadow = '0 0 30px rgba(0, 255, 157, 0.6), inset 0 0 20px rgba(0, 255, 157, 0.2)';
            panel.style.transform += ' scale(1.05)';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.3), inset 0 0 20px rgba(0, 255, 157, 0.1)';
            // Transform akan diupdate ulang oleh rotateStructure
        });
    });
    
    // Inisialisasi posisi awal
    rotateStructure(currentAngle);
    
    // Mulai rotasi otomatis setelah 3 detik
    setTimeout(startAutoRotation, 3000);
}

// Efek glitch acak pada teks
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        // Tambahkan efek glitch acak
        setInterval(() => {
            element.style.textShadow = `
                2px 2px 0 #ff00c1,
                -2px -2px 0 #00fff9
            `;
            
            setTimeout(() => {
                element.style.textShadow = '';
            }, 100);
        }, 3000 + Math.random() * 5000);
    });
}

// Efek terminal interaktif
function initTerminal() {
    const terminalOutput = document.querySelector('.terminal-output');
    const terminalInput = document.createElement('p');
    terminalInput.className = 'terminal-input blink';
    terminalInput.textContent = '> _';
    terminalOutput.appendChild(terminalInput);
    
    const commands = [
        { cmd: 'help', response: 'Available commands: about, education, hobbies, skills, contact, clear' },
        { cmd: 'about', response: 'Alexander Ray - Student at SMA 1 Magetan, Class XII MIPA 4, Absence No. 07' },
        { cmd: 'education', response: 'Education History: SD Muhammadiyah 1 Magetan (2013-2019), SMP 1 Magetan (2019-2022), SMA 1 Magetan (2022-Present)' },
        { cmd: 'hobbies', response: 'Hobbies: Programming, Robotics, Electronic Music, VR, Gaming, Futuristic Technology' },
        { cmd: 'skills', response: 'Skills: Programming (78%), 3D Design (65%), Cyber Security (82%), AI & ML (70%)' },
        { cmd: 'contact', response: 'Contact: You can reach me at alex.ray@digitaluniverse.net' },
        { cmd: 'clear', response: '' }
    ];
    
    let commandHistory = [];
    let historyIndex = -1;
    
    // Simulasi input terminal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            // Ambil input dari terminal (dalam implementasi nyata, ini akan membutuhkan input field)
            // Untuk demo, kita akan secara acak menampilkan perintah
            if (Math.random() > 0.7) {
                const randomCmd = commands[Math.floor(Math.random() * commands.length)];
                
                // Tampilkan input
                const inputLine = document.createElement('p');
                inputLine.textContent = `> ${randomCmd.cmd}`;
                terminalOutput.insertBefore(inputLine, terminalInput);
                
                // Tampilkan output
                if (randomCmd.cmd === 'clear') {
                    // Clear terminal
                    terminalOutput.innerHTML = '';
                    terminalOutput.appendChild(terminalInput);
                } else {
                    const outputLine = document.createElement('p');
                    outputLine.textContent = randomCmd.response;
                    terminalOutput.insertBefore(outputLine, terminalInput);
                    
                    // Scroll ke bawah
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            }
        }
    });
    
    // Tambahkan beberapa pesan acak ke terminal
    setInterval(() => {
        const messages = [
            "> System check: All systems operational",
            "> Data stream: Receiving updates from central server",
            "> Security scan: No threats detected",
            "> Network status: Connected to global grid",
            "> Memory usage: 67% allocated, 33% free",
            "> CPU temperature: 42°C, within normal range"
        ];
        
        if (Math.random() > 0.8) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            const msgLine = document.createElement('p');
            msgLine.textContent = randomMsg;
            terminalOutput.insertBefore(msgLine, terminalInput);
            
            // Batasi jumlah baris di terminal
            if (terminalOutput.children.length > 15) {
                terminalOutput.removeChild(terminalOutput.children[0]);
            }
            
            // Scroll ke bawah
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }, 5000);
}

// Efek paralaks saat scrolling
function initParallaxEffects() {
    const fluidBg = document.querySelector('.fluid-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        fluidBg.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
}

// Inisialisasi semua efek saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    initFluidBackground();
    initRotatingStructure();
    initGlitchEffects();
    initTerminal();
    initParallaxEffects();
    
    // Tambahkan efek suara sci-fi untuk interaksi
    const buttons = document.querySelectorAll('button, .info-panel, .profile-image');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Dalam implementasi nyata, ini akan memutar suara
            // Untuk demo, kita akan hanya menambahkan efek visual
            button.style.transform = 'scale(0.98)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
        
        button.addEventListener('mouseenter', () => {
            // Efek hover dengan perubahan border color
            if (button.classList.contains('control-btn') || button.classList.contains('info-panel')) {
                button.style.borderColor = '#00ff9d';
                button.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.5)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (button.classList.contains('control-btn')) {
                button.style.borderColor = '#00ff9d';
                button.style.boxShadow = '';
            } else if (button.classList.contains('info-panel')) {
                button.style.borderColor = 'rgba(0, 255, 157, 0.5)';
                button.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.3), inset 0 0 20px rgba(0, 255, 157, 0.1)';
            }
        });
    });
    
    // Tampilkan pesan selamat datang di console (untuk efek tambahan)
    console.log('%c✨ CYBERPUNK PROFILE v2.1 ✨', 'color: #00ff9d; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00ff9d');
    console.log('%cSystem initialized successfully. Welcome to the digital realm.', 'color: #a0ffd0; font-size: 14px;');
});

// Responsive adjustments
window.addEventListener('resize', () => {
    // Jika di mode mobile, nonaktifkan rotasi 3D
    if (window.innerWidth <= 768) {
        const rotatingStructure = document.querySelector('.rotating-structure');
        rotatingStructure.style.transform = 'none';
    }
});
