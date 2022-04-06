class ClearBonus {
    constructor(ctx, posX, posY) {
        this.ctx = ctx
        this.clearBonusPos = { x: posX, y: posY }
        this.clearBonusSize = { w: 50, h: 50 }

        this.imageInstance = undefined

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = './img/clearbonus.png'
    }

    draw() {
        this.ctx.drawImage(this.imageInstance, this.clearBonusPos.x, this.clearBonusPos.y, this.clearBonusSize.w, this.clearBonusSize.h)
    }
}