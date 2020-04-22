ga.lib.BulletSystem = class {
    constructor(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.bullets = [];
    }
    update() {
        if (ga.game.circle % 5 == 0) {
            this.bullets.push(new ga.lib.Bullet(this.startX, this.startY));
        }
        for (let i = 0; i < this.bullets.length; i++) {
            let die = this.bullets[i].update();
            if (die) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }
    render() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render();
        }
    }
};

ga.lib.Bullet = class {
    constructor() {
        this.x = 0;
        this.y = Math.random() * ga.ctx.canvas.height;
        this.vx = Math.random() * 1.5 + 0.5;
        this.vy = 0;
        this.size = 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        return this.x > ga.ctx.canvas.width;
    }
    render() {
        ga.ctx.save();
        ga.ctx.fillStyle = "white";
        ga.ctx.beginPath();
        ga.ctx.arc(this.x, this.y, this.size, this.size);
        ga.cyx.fill();
        ga.ctx.restore();
    }
};