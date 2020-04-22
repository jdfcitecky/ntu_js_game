// 資料管理
let ga = {
    lib: {},
    ctx: null,
    audio: null,
    res: {
        total: 4, // 總共多少資源
        loaded: 0, // 有多少資源被載入 
        sounds: {
            bullet: "bullet.mp3",
            explosion: "explosion.mp3"
        },
        imgs: {
            plane: "plane.png",
            explosion: "explosion.png"
        }
    },
    game: {
        id: 0,
        circle: 0, // 回合控制，隨回合調整彈幕密度，多少回合發射一次，或者放在update中提高或降低更新頻率
        particles: null,
        plane: null,
        bulletSystem: null,
        key: { // 增加有沒有按住鍵盤
            space: false,
            left: false,
            top: false,
            right: false,
            bottom: false
        }

    }
};
ga.lib.bulletSystem = class {
    constructor(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.bullets = [];
    }
    update() {
        this.startX = Math.random() * 600;
        if (ga.game.circle % 12 == 0) {
            this.bullets.push(new ga.lib.bullet(this.startX, this.startY));
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

ga.lib.bullet = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * -1 + 1; // 0 ~ 2
        this.vy = Math.random() * -1 + 2;
        this.size = 4
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // 加速度
        // this.vy += 0.01;
        // this.vx += 0.01;
        // 回傳 true 代表可以清除這個物件
        // 跑到canvas即可清除
        return this.x > 600 || this.x < 0 || this.y > 450 || this.y < 0;
    }
    render() {
        ga.ctx.save();
        ga.ctx.fillStyle = "white";
        ga.ctx.fillRect(this.x, this.y, this.size, this.size);
        ga.ctx.restore();
    }
};

// 定義需要用到的類別
ga.lib.Plane = class {
    constructor() {
        this.x = ga.ctx.canvas.width / 2;
        this.y = ga.ctx.canvas.height / 2;
        this.size = 20;
    }
    update() {
        let speed = 1;
        let key = ga.game.key;
        if (key.space) {
            speed *= 2;
        }
        if (key.left) {
            this.x -= speed;
        }
        if (key.top) {
            this.y -= speed;
        }
        if (key.right) {
            this.x += speed;
        }
        if (key.bottom) {
            this.y += speed;
        }
        // 卡邊界
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.x > ga.ctx.canvas.width) {
            this.x = ga.ctx.canvas.width;
        }
        if (this.y > ga.ctx.canvas.height) {
            this.y = ga.ctx.canvas.height;
        }
        // 飛機不會自己動
        // 飛機也不會自己消失
        return false;
    }
    render() {
        ga.ctx.save(); // 儲存Canvas的設定(字形、畫筆顏色......)
        ga.ctx.drawImage(
            ga.res.imgs.plane,
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
        // 畫上後燃器
        if (ga.game.key.space) {
            ga.ctx.drawImage(
                ga.res.imgs.explosion,
                this.x - 5,
                this.y + 10,
                10,
                10
            )
        }
        ga.ctx.restore(); // 取回上一次儲存的設定
    }
};