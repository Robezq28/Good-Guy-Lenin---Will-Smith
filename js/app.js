const ironApp = {
    name: 'Good Guy Lenin',
    description: 'Kepp my wifes name out of your f****** mouth',
    version: '1.1.0',
    author: 'Pablo & Roberto',
    license: undefined,
    canvasNode: undefined,
    ctx: undefined,
    gameSize: { w: undefined, h: undefined },
    framesIndex: 0,
    enemyArr: [],
    shootBonusArr: [],
    clearBonusArr: [],
    bulletsArr: [],
    canShoot: false,
    nextLevelText: false,
    enemyGenerateSpeed: undefined,
    onPlaying: false,
    musicOnPlay: false,



    init(canvasID) {
        this.canvasNode = document.querySelector(`#${canvasID}`)
        this.ctx = this.canvasNode.getContext('2d')
        this.loadImages()
        this.setDimensions()
        this.drawBackground()
        this.clearAll()
        this.start()
        this.createPlayer()
        this.setEventListeners()
        this.gameStart()
        this.displayCopyright()

    },

    displayCopyright() {
        this.ctx.fillStyle = 'grey'
        this.ctx.font = '11px arial'
        this.ctx.fillText('Developed by:', 10, this.gameSize.h - 25)
        this.ctx.fillText('Roberto Ezquerro & Pablo Quintana', 10, this.gameSize.h - 10)
    },

    setDimensions() {
        this.gameSize = {
            w: window.innerWidth,
            h: window.innerHeight
        }
        this.canvasNode.setAttribute('width', this.gameSize.w)
        this.canvasNode.setAttribute('height', this.gameSize.h)
    },

    setEventListeners() {
        document.addEventListener('keydown', event => {
            const { key } = event
            if (key === 'ArrowLeft' && (this.player.playerPos.x > 250 || this.player.playerPos.y <= 200)) {
                this.player.moveLeft()
            }
            if (key === 'ArrowRight' && this.player.playerPos.x < this.gameSize.w - 250 - this.player.playerSize.w) {
                this.player.moveRight()
            }
            if (key === 'ArrowUp' && this.player.playerPos.y > 160) {
                this.player.moveUp()
            }
            if (key === 'ArrowDown' && this.player.playerPos.y < this.gameSize.h - 120 - this.player.playerSize.h) {
                this.player.moveDown()
            } if (event.code === 'Space') {
                this.shoot()
            } if (event.code === 'Enter') {
                if (this.onPlaying === false) {
                    this.reset()
                    if (!this.musicOnPlay) {
                        let backgroundMusic = new Audio("./sounds/background.mp3")
                        backgroundMusic.volume = 1
                        backgroundMusic.play()

                        this.musicOnPlay = true

                    }
                }
            }

        })
    },
    start() {
        this.onPlaying = true
        this.enemyGenerateSpeed = 20

        this.interval = setInterval(() => {
            this.clearAll()
            this.drawAll()
            this.generateEnemy()
            this.generateShootBonus()
            this.generateClearBonus()
            this.displayCopyright()
            this.framesIndex++
        }, 30);
    },

    reset() {
        this.enemyArr.splice(0, this.enemyArr.length)
        this.shootBonusArr.splice(0, this.shootBonusArr.length)
        this.clearBonusArr.splice(0, this.clearBonusArr.length)
        this.framesIndex = 0

        this.start()

    },

    clearAll() {
        this.ctx.clearRect(0, 0, this.gameSize.w, this.gameSize.h)
    },

    drawAll() {
        this.drawBackground()
        this.player.draw()
        this.pointsCounter(this.framesIndex)
        this.displayNextLevelText()
        if (this.framesIndex % 300 === 0 && this.framesIndex !== 0) {
            this.nextLevel()
            this.enemyGenerateSpeed / 2.5
        }

        this.shootBonusArr.forEach(bonus => bonus.draw());
        this.clearBonusArr.forEach(bonus => bonus.draw())
        this.enemyArr.forEach(enemy => enemy.draw())
        this.bulletsArr.forEach(bullet => { bullet.draw() });
        this.clearEnemies()
        this.clearBullets()

        this.enemyArr.forEach(enemy => {
            if (this.player.playerPos.x < enemy.enemyPos.x + enemy.enemySize.w &&
                this.player.playerPos.x + this.player.playerSize.w > enemy.enemyPos.x &&
                this.player.playerPos.y < enemy.enemyPos.y + enemy.enemySize.h &&
                this.player.playerSize.h + this.player.playerPos.y > enemy.enemyPos.y) {

                this.playerEnemyCollision()


            }
        });

        this.clearBonusArr.forEach(clearBonus => {
            if (this.player.playerPos.x < clearBonus.clearBonusPos.x + clearBonus.clearBonusSize.w &&
                this.player.playerPos.x + this.player.playerSize.w > clearBonus.clearBonusPos.x &&
                this.player.playerPos.y < clearBonus.clearBonusPos.y + clearBonus.clearBonusSize.h &&
                this.player.playerSize.h + this.player.playerPos.y > clearBonus.clearBonusPos.y) {
                this.playerClearBonusCollision()
            }
        });

        this.shootBonusArr.forEach(shootBonus => {
            if (this.player.playerPos.x < shootBonus.shootBonusPos.x + shootBonus.shootBonusSize.w &&
                this.player.playerPos.x + this.player.playerSize.w > shootBonus.shootBonusPos.x &&
                this.player.playerPos.y < shootBonus.shootBonusPos.y + shootBonus.shootBonusSize.h &&
                this.player.playerSize.h + this.player.playerPos.y > shootBonus.shootBonusPos.y) {
                this.playerShootBonusCollision()

            }
        })

        this.enemyArr.forEach(enemy => {
            this.bulletsArr.forEach(bullet => {
                if (bullet.bulletPos.x < enemy.enemyPos.x + enemy.enemySize.w &&
                    bullet.bulletPos.x + bullet.bulletSize.w > enemy.enemyPos.x &&
                    bullet.bulletPos.y < enemy.enemyPos.y + enemy.enemySize.h &&
                    bullet.bulletSize.h + bullet.bulletPos.y > enemy.enemyPos.y) {
                    this.enemyArr.splice(this.enemyArr.indexOf(enemy), 1)
                    this.bulletsArr.splice(this.bulletsArr.indexOf(bullet), 1)
                }
            });
        });


    },

    drawBackground() {
        // this.ctx.drawImage(this.imageInstanceBackgroundImg, 0, 0, this.gameSize.w, this.gameSize.h)
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.gameSize.w, this.gameSize.h)
        this.ctx.drawImage(this.imageInstanceAside1, 0, 0, 200, this.gameSize.h)
        this.ctx.drawImage(this.imageInstanceAside2, this.gameSize.w - 200, 0, 200, this.gameSize.h)



    },

    pointsCounter(counter) {
        // this.ctx.fillStyle = 'white'
        // this.ctx.font = '20px arial'
        // this.ctx.fillText("Your score", 40, 45)
        this.ctx.fillStyle = 'white'
        this.ctx.font = '100px arial'
        this.ctx.fillText(counter, this.gameSize.w / 2 - 100, 105)
    },

    nextLevel() {
        this.nextLevelText = true
        window.setTimeout(() => {
            this.nextLevelText = false

        }, 1000);
    },

    displayNextLevelText() {
        if (this.nextLevelText === true) {
            this.ctx.fillStyle = 'red'
            this.ctx.font = '100px helvetica'
            this.ctx.fillText('NEXT LEVEL', this.gameSize.w / 2 - 300, this.gameSize.h / 2)
            this.ctx.fillStyle = 'white'
            this.ctx.font = '100px helvetica'
            this.ctx.fillText('NEXT LEVEL', this.gameSize.w / 2 - 301, this.gameSize.h / 2 - 10)
            this.ctx.fillStyle = 'red'
            this.ctx.font = '40px helvetica'
            this.ctx.fillText('ou shit', this.gameSize.w / 2 - 300, this.gameSize.h / 2 + 200)

        }
    },

    createPlayer() {
        this.player = new Player(this.ctx, this.gameSize.w / 2 - 40, this.gameSize.h / 2 - 40, 30, 75)
        this.player.draw()
    },

    generateEnemy() {
        if (this.framesIndex % this.enemyGenerateSpeed === 0) {
            this.enemyArr.push(new Enemy(this.ctx, Math.random() * (this.gameSize.w - 550) + 250, 100, 30, 80))
        }
    },

    clearEnemies() {
        this.enemyArr = this.enemyArr.filter(enemy => enemy.enemyPos.y < this.gameSize.h)
    },

    clearBullets() {
        this.bulletsArr = this.bulletsArr.filter(bullet => bullet.bulletPos.y > 0 - bullet.bulletSize.h)

    },

    generateShootBonus() {
        if (this.framesIndex % 501 === 0 && this.framesIndex !== 0) {
            this.shootBonusArr.push(new ShootBonus(this.ctx, Math.random() * (this.gameSize.w - 550) + 250, Math.random() * (this.gameSize.h - 600) + 400))
        }
    },
    generateClearBonus() {
        if (this.framesIndex % 801 === 0 && this.framesIndex !== 0) {
            this.clearBonusArr.push(new ClearBonus(this.ctx, Math.random() * (this.gameSize.w - 550) + 250, Math.random() * (this.gameSize.h - 400) + 280))
        }
    },

    shoot() {
        if (this.canShoot) {
            let shootMusic = new Audio("./sounds/shoot.mp3")
            shootMusic.volume = 0.3
            shootMusic.play()
            this.bulletsArr.push(new Bullet(this.ctx, this.player.playerPos.x, this.player.playerPos.y, 50, 90))
        }
    },

    playerEnemyCollision() {
        this.gameOver()
    },

    playerClearBonusCollision() {
        this.enemyArr.splice(0, this.enemyArr.length)
        this.clearBonusArr.splice(0, this.clearBonusArr.length)
        let clearBonusMusic = new Audio("./sounds/clearbonus.mp3")
        clearBonusMusic.volume = 0.7
        clearBonusMusic.play()
    },

    playerShootBonusCollision() {
        this.canShoot = true
        this.shootBonusArr.splice(0, this.shootBonusArr.length)
        let shootBonusMusic = new Audio("./sounds/shootbonus.mp3")
        shootBonusMusic.volume = 0.1
        shootBonusMusic.play()
        window.setTimeout(() => {
            this.canShoot = false

        }, 4500);
    },

    gameStart() {
        clearInterval(this.interval)
        this.onPlaying = false

    },

    gameOver() {
        this.ctx.drawImage(this.imageInstanceGameOver, 0, 0, this.gameSize.w, this.gameSize.h)
        clearInterval(this.interval)
        this.onPlaying = false
    },

    loadImages() {
        this.imageInstanceAside1 = new Image()
        this.imageInstanceAside1.src = './img/aside1.png'
        this.imageInstanceAside2 = new Image()
        this.imageInstanceAside2.src = './img/aside2.png'
        this.imageInstanceGameOver = new Image()
        this.imageInstanceGameOver.src = './img/start.jpg'
        // this.imageInstanceBackgroundImg = new Image()
        // this.imageInstanceBackgroundImg.src = './img/fondo.jpg'
    }
}