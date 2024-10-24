const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 512

var youWin = false;
var youLose = false;
var startTime = Date.now();  // Track the start time
var totalTime = 0;  // Store the total time when game is over

const bg_img = new Image();
bg_img.src = 'http://localhost:8000/bg2.png';

const water_img = new Image();
water_img.src = 'http://localhost:8000/water.png';

const platform_img = new Image();
platform_img.src = 'http://localhost:8000/platform.png';

const platform_sml = new Image();
platform_sml.src = 'http://localhost:8000/platform_sml.png';
//Running sprites
//Right
const run_right = new Image();
run_right.src = 'http://localhost:8000/sprt_sheet_run_r.png';
//Left
const run_left = new Image();
run_left.src = 'http://localhost:8000/sprt_sheet_run_l.png';
//Standing Sprites
//Right
const sprt_sheet_r = new Image();
sprt_sheet_r.src = 'http://localhost:8000/standing_r_sprt_sheet.png';
//Left
const sprt_sheet_l = new Image();
sprt_sheet_l.src = 'http://localhost:8000/standing_l_sprt_sheet.png';

platform_img.onload = () => {
    platforms.push(new Platform({ x: 0, y: 460, image: platform_img }));
    platforms.push(new Platform({ x: 150, y: 350, image: platform_img }));
    platforms.push(new Platform({ x: 400, y: 250, image: platform_img }));
    platforms.push(new Platform({ x: 600, y: 150, image: platform_img }));
    platforms.push(new Platform({ x: 900, y: 150, image: platform_img }));
    platforms.push(new Platform({ x: 1400, y: 150, image: platform_img }));
    platforms.push(new Platform({ x: 1400, y: 460, image: platform_img }));
    platforms.push(new Platform({ x: 3150, y: 460, image: platform_img }));
    platforms.push(new Platform({ x: 3450, y: 460, image: platform_img }));
};

platform_sml.onload = () => {
    platforms.push(new Platform({ x: 1900, y: 460, image: platform_sml }));
    platforms.push(new Platform({ x: 2100, y: 460, image: platform_sml }));
    platforms.push(new Platform({ x: 2300, y: 460, image: platform_sml }));
    platforms.push(new Platform({ x: 2500, y: 460, image: platform_sml }));
    platforms.push(new Platform({ x: 2700, y: 460, image: platform_sml }));
    platforms.push(new Platform({ x: 2700, y: 330, image: platform_sml }));
    platforms.push(new Platform({ x: 2700, y: 210, image: platform_sml }));
    platforms.push(new Platform({ x: 2700, y: 80, image: platform_sml }));
};

const gravity = 0.4

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 300
        }
        this.velocity = {
            x: 0,
            y: 0.9
        }
        this.image = sprt_sheet_r
        this.frames = 0
        this.width = 50
        this.height = 70
        this.isJumping = false;

        // Add a frame delay to slow down the animation
        this.frameDelay = 5; // Change this value to control speed
        this.frameTimer = 0;  // Timer to control frame updates

        this.sprites = {
            stand: {
                right: sprt_sheet_r,
                left: sprt_sheet_l
            },
            run: {
                right: run_right,
                left: run_left,
            }
        }

        this.currentSprite = this.sprites.stand.right;

    }
    //WATCH VIDEO 1hr52mins 
    draw() {
        c.drawImage(
            this.currentSprite,
            this.width * this.frames,
            0,
            this.width,
            70,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        //LOAD FRAMES and control frame rate
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frames++;
            this.frameTimer = 0; // Reset timer
        }

        if (this.frames >= 5 && 
            this.currentSprite === this.sprites.stand.right){
                this.frames = 0 
            } else if (this.frames >= 5 && 
                this.currentSprite === this.sprites.stand.left)
                this.frames = 0
        if (this.frames >= 10 &&
            this.currentSprite === this.sprites.run.right){
                this.frames = 0
            } else if (this.frames >= 10 &&
                this.currentSprite === this.sprites.run.left){
                    this.frames = 0
                }

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + 
            this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({x,y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const player = new Player()

const platforms = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function animate() {
    if (!youWin && !youLose){
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    c.drawImage(bg_img, 0, 0, canvas.width, canvas.height);
    c.drawImage(water_img, 0, 465, canvas.width, 50);
    
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    var currentTime = Date.now();
    var elapsedTime = Math.floor((currentTime - startTime) / 1000);  // In seconds
    c.font = "bold 30px courier";
    c.fillText(`Time: ${elapsedTime}s`, 50, 50);

    c.font = "bold 50px courier";
    c.fillStyle = "yellow";
    c.fillText('JUNGLE RUNNER', 300,50);

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if ((keys.left.pressed && player.position.x > 100)
    || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed){
            scrollOffset += 5
            platforms.forEach((platform) => {
                platform.position.x -= 5
            })
            
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= 5
            platforms.forEach((platform) => {
                platform.position.x += 5
            })
            
        }
    }

// Platform collision detection
    platforms.forEach((platform) => {
    if (player.position.y + player.height <= 
        platform.position.y && 
        player.position.y + player.height +
        player.velocity.y >= platform.position.y &&
        player.position.x + player.width >=
        platform.position.x && player.position.x <=
        platform.position.x + platform.width) {
            player.velocity.y = 0
            player.isJumping = false;
        }

    if (player.position.y + player.height >= canvas.height) {
        player.isJumping = false; // Reset when on the ground
        player.velocity.y = 0; // Stop vertical movement
        player.position.y = canvas.height - player.height; // Position player on the ground
        }

    })

    if (scrollOffset > 3050) {
        youWin = true;
        totalTime = elapsedTime;  // Store the final time
        displayWinMessage();
        
    }

    if (player.position.y >= canvas.height - 71) {
        youLose = true;
        youLoseMessage();
    }
}
}

function displayWinMessage() {
    // Draw the "You Win" text
    c.font = "bold 60px courier";
    c.fillStyle = "red";
    var winText = "You Win!";
    var winTextWidth = c.measureText(winText).width;
    c.fillText(winText, canvas.width / 2 - winTextWidth / 2, canvas.height / 2 - 50);

    // Display the total time taken to win
    c.font = "bold 40px courier";
    var timeText = `Total Time: ${totalTime}s`;
    var timeTextWidth = c.measureText(timeText).width;
    c.fillText(timeText, canvas.width / 2 - timeTextWidth / 2, canvas.height / 2);

    // Draw the "Play Again" button
    c.fillStyle = "white";
    c.strokeStyle = "Red";
    c.lineWidth = 4;
    c.strokeRect(canvas.width / 2 - 100, canvas.height / 2 + 40, 210, 70);
    c.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 40, 210, 70);  // Draw button background


    c.font = "bold 30px courier";
    c.fillStyle = "black";
    c.fillText("Play Again?", canvas.width / 2 - 90, canvas.height / 2 + 68);  // Button text
    c.fillText("Hit any key", canvas.width / 2 - 90, canvas.height / 2 + 100);  // Button text
}

function youLoseMessage() {
    c.font = "bold 60px courier";
    c.fillStyle = "red";
    var winText = "You Lose!";
    var winTextWidth = c.measureText(winText).width;
    c.fillText(winText, canvas.width / 2 - winTextWidth / 2, canvas.height / 2 - 50);

    // Draw the "Play Again" button
    c.fillStyle = "white";
    c.strokeStyle = "Red";
    c.lineWidth = 4;
    c.strokeRect(canvas.width / 2 - 100, canvas.height / 2 + 40, 210, 70);
    c.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 40, 210, 70);  // Draw button background

    c.font = "bold 30px courier";
    c.fillStyle = "black";
    c.fillText("Play Again?", canvas.width / 2 - 90, canvas.height / 2 + 68);  // Button text
    c.fillText("Hit any key", canvas.width / 2 - 90, canvas.height / 2 + 100);  // Button text
}

animate()

addEventListener('keydown', ({ keyCode }) => {
    if (youWin || youLose) {
        gameRestarted = true;  // Prevent multiple reloads
        location.reload();  // Reload the game
        return;
    }


    switch (keyCode) {
        
        case 37:
            console.log('left')
            keys.left.pressed = true
            player.currentSprite = player.sprites.run.left
            break

        case 39:
            console.log('right')
            keys.right.pressed = true
            player.currentSprite = player.sprites.run.right
            break

        case 38:
            console.log('up')
            if (!player.isJumping) { // Only allow jump if not already jumping
                player.velocity.y -= 10
                player.isJumping = true; // Set the jumping flag
            }
            break

        case 40:
            console.log('down')
            break

            case 32: // Spacebar for jump
                if (!player.isJumping) { // Only allow jump if not already jumping
                    player.velocity.y -= 10
                    player.isJumping = true; // Set the jumping flag
                }
            break

    }
})
addEventListener('keyup', ({ keyCode }) => {
    //console.log(keyCode)
    switch (keyCode) {
            
        case 37:
            console.log('left')
            keys.left.pressed = false
            player.currentSprite = player.sprites.stand.left
            break
    
        case 39:
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprites.stand.right
            break
    
        case 38:
            console.log('up')
            player.velocity.y -= 10
            break
    
        case 40:
            console.log('down')
            
            break
    
        case 32:
            console.log('Spacebar')
            break
    
    }
})
