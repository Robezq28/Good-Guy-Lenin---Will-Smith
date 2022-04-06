class Enemy {
    constructor(ctx, posX, posY, width, heigth) {
        this.ctx = ctx
        this.enemyPos = { x: posX, y: posY }
        this.enemySize = { w: width, h: heigth }
        this.enemyVel = { x: undefined, y: undefined }

        this.imageInstance = undefined

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = './img/enemy.png'
    }

    draw() {
        this.ctx.drawImage(this.imageInstance, this.enemyPos.x, this.enemyPos.y, this.enemySize.w, this.enemySize.h)
        this.moveDown()
    }

    moveRight() {

    }

    moveLeft() {


    }

    moveDown() {
        this.enemyPos.y += 5
    }
}