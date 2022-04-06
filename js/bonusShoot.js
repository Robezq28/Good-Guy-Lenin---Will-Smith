class ShootBonus {
    constructor(ctx, posX, posY) {
        this.ctx = ctx
        this.shootBonusPos = { x: posX, y: posY }
        this.shootBonusSize = { w: 50, h: 50 }

        this.imageInstance = undefined

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = './img/shootbonus.jpeg'
    }

    draw() {
        this.ctx.drawImage(this.imageInstance, this.shootBonusPos.x, this.shootBonusPos.y, this.shootBonusSize.w, this.shootBonusSize.h)
    }
}