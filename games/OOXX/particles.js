class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = {
            x: (Math.random() - 0.5) * 1.5, // 增加速度
            y: (Math.random() - 0.5) * 1.5  // 增加速度
        };
        this.radius = Math.random() * 5 + 3; // 增加粒子大小
        this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`; // 增加不透明度
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        this.draw();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-js');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 70; // 稍微增加粒子数量

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.createParticles();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let particle of this.particles) {
            particle.update();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle system
new ParticleSystem();
