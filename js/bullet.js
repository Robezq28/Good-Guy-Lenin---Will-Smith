class Bullet {
    constructor(ctx, posX, posY, width, heigth) {
        this.ctx = ctx
        this.bulletPos = { x: posX, y: posY }
        this.bulletSize = { w: width, h: heigth }

        this.imageInstance = undefined

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = './img/bullet.png'
    }

    draw() {
        this.ctx.drawImage(this.imageInstance, this.bulletPos.x, this.bulletPos.y, this.bulletSize.w, this.bulletSize.h)
        this.moveUp()
    }

    moveUp() {
        this.bulletPos.y -= 20
    }
}