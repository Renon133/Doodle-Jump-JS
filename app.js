document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodle = document.createElement('div')
    const alien = document.createElement('div')

    let doodleLeftSpace = 50
    let startPoint = 150
    let doodlebottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isMovingLeft = false
    let isMovingRight = false
    let leftTimerId
    let rightTimerId    
    let score = 0

    function createDoodle() {
        grid.appendChild(doodle)
        doodle.classList.add('doodle')
        doodleLeftSpace = platforms[0].left
        doodle.style.left = doodleLeftSpace + 'px' 
        doodle.style.bottom = doodlebottomSpace + 'px'
    
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom +'px'
            grid.appendChild(visual) 
            
        }
    }


    function createPlatorms() {
        for (let i = 0; i<platformCount; i++) {
            let platGap = 600 / platformCount 
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)

        }
    }

    function movePlatforms() {
        if (doodlebottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 1) {
                    let firstPlatorm = platforms[0].visual
                    firstPlatorm.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms) 
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJupming = true
        upTimerId = setInterval(function () {
                doodlebottomSpace += 10
                doodle.style.bottom = doodlebottomSpace + 'px'
                if(doodlebottomSpace > startPoint + 200) {
                    fall()
                }
        },30)
    }

    function fall () {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(() => {
            doodlebottomSpace -= 5
            doodle.style.bottom = doodlebottomSpace +'px'
            if(doodlebottomSpace <= 0) {
                gameOver() 
            }
            platforms.forEach(platform => {
                if(
                    (doodlebottomSpace >= platform.bottom) &&
                    (doodlebottomSpace <= platform.bottom + 15) && 
                    ((doodleLeftSpace + 60 >= platform.left) && 
                    (doodleLeftSpace <= platform.left + 85)) &&
                    !isJumping
                    ) {
                        console.log("Landed")
                        startPoint = doodlebottomSpace
                        jump()
                }

            })
        }, 30);
    }

    function gameOver() {
        console.log('Game Over!!!')
        isGameOver = true
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = "Score: " + score
        clearInterval (upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        }else if (e.key === "ArrowRight") {
            moveRight()
        }else if (e.key === "ArrowUp") {
            // Move Straight
            moveStraight()
        }
     }
    
    function moveStraight() {
        isMovingLeft = false
        isMovingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function moveLeft() {
        if(isMovingRight) {
            clearInterval(rightTimerId)
            isMovingRight = false
        }
        isMovingLeft = true
        leftTimerId = setInterval(function(){
            if(doodleLeftSpace >= 0){
                doodleLeftSpace -= 5
                doodle.style.left = doodleLeftSpace +'px'
            }else moveRight()
        },30)
    }

    function moveRight() {
        if (isMovingLeft) {
            clearInterval(leftTimerId)
            isMovingLeft = false
        }
        isMovingRight = true
        rightTimerId = setInterval(function(){
            if(doodleLeftSpace <= 400) {
                doodleLeftSpace += 5
                doodle.style.left = doodleLeftSpace + 'px'
            }else moveLeft()
        },30) 
    }
     
    function start() {
        if (!isGameOver){
            createPlatorms()
            createDoodle()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener("keyup",control)
        }
    }

    start()

})