const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 512

var youWin = false;
var youLose = false;
var startTime = Date.now();  // Track the start time
var totalTime = 0;  // Store the total time when game is over

const bg_img = new Image();
bg_img.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/bg2.png';


const jr_title = new Image();
jr_title.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/jr_title.png';

const temple_img = new Image();
temple_img.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/temple_sml.png';

const water_img = new Image();
water_img.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/water.png';

const platform_img = new Image();
platform_img.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/platform.png';

const skull_img = new Image();
skull_img.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/skull_sml.png';

const skull_box = new Image();
skull_box.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/skull_box.png';

const platform_sml = new Image();
platform_sml.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/platform_sml.png';
//Running sprites
//Right
const run_right = new Image();
run_right.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/sprt_sheet_run_r.png';
//Left
const run_left = new Image();
run_left.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/sprt_sheet_run_l.png';
//Standing Sprites
//Right
const sprt_sheet_r = new Image();
sprt_sheet_r.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/standing_r_sprt_sheet.png';
//Left
const sprt_sheet_l = new Image();
sprt_sheet_l.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/standing_l_sprt_sheet.png';
//Dinosaur sprites
const dino_sprt_r = new Image();
dino_sprt_r.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/dino_sprt_sheet_r3.png'

const dino_sprt_l = new Image();
dino_sprt_l.src = 'https://raw.githubusercontent.com/Swillycoder/Jungle-Runner/main/dino_sprt_sheet_l3.png'

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
    platforms.push(new Platform({ x: 3300, y: 298, image: temple_img }));
};

dino_sprt_l.onload = () => {
    enemies.push(new Enemy({x:500,y:184,image:dino_sprt_l}));
    enemies.push(new Enemy({x:1050,y:84,image:dino_sprt_l}));
    enemies.push(new Enemy({x:1550,y:84,image:dino_sprt_l}));
    enemies.push(new Enemy({x:1550,y:394,image:dino_sprt_l}));
    enemies.push(new Enemy({x:3250,y:394,image:dino_sprt_l}));
}

skull_img.onload = () => {
    skulls.push(new Collectible({x:660,y:180,image:skull_img}))
    skulls.push(new Collectible({x:1050,y:80,image:skull_img}))
    skulls.push(new Collectible({x:1550,y:80,image:skull_img}))
    skulls.push(new Collectible({x:1550,y:390,image:skull_img}))
    skulls.push(new Collectible({x:2500,y:390,image:skull_img}))
}

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
        this.speed = 5

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

class Enemy {
    constructor({ x, y }) {
        this.initialPosition = { x, y };  // Track the original position
        this.position = { x, y };         // Current on-screen position
        this.localX = x;                  // Local x position for back-and-forth
        this.width = 50;
        this.height = 66;
        this.speed = 2;
        this.frames = 1;
        this.frameDelay = 5;
        this.frameTimer = 0;
        this.direction = -1;

        this.leftLimit = this.initialPosition.x - 100;
        this.rightLimit = this.initialPosition.x + 100;

        this.sprites = {
            stand: { right: dino_sprt_r, left: dino_sprt_l },
            run: { right: run_right, left: run_left },
        };
        this.currentSprite = this.sprites.stand.left;
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.width * this.frames,
            0,
            this.width,
            66,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update(scrollOffset) {
        // Update local back-and-forth position
        this.localX += this.speed * this.direction;

        if (this.localX <= this.leftLimit) {
            this.direction = 1;
            this.currentSprite = this.sprites.stand.right;
        } else if (this.localX >= this.rightLimit) {
            this.direction = -1;
            this.currentSprite = this.sprites.stand.left;
        }

        // Apply scrollOffset to display position
        this.position.x = this.localX - scrollOffset;

        // Control animation frames
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frames++;
            this.frameTimer = 0;
        }
        if (this.frames >= 5) {
            this.frames = 0;
        }

        this.draw();
    }
}

class Collectible {
    constructor({x,y,image}) {
        this.position = {x,y}
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
        
}

const player = new Player()

const platforms = []
    
const enemies = []

const skulls = []
    
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0;
let skullsCollected = 0;

function animate() {
    if (!youWin && !youLose){
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    c.drawImage(bg_img, 0, 0, canvas.width, canvas.height);
    c.drawImage(water_img, 0, 465, canvas.width, 50);
    c.drawImage(jr_title,10,0,300,150)
    
    platforms.forEach(platform => {
        platform.draw()
    })

    enemies.forEach(enemy => {
        enemy.update(scrollOffset)
    })

    skulls.forEach(skull => {
        skull.draw()
    })

    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100)
    || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            enemies.forEach((enemy) => {
                enemy.position.x -= player.speed
            })

            skulls.forEach((skull) => {
                skull.position.x -= player.speed
            })
            
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            enemies.forEach((enemy) => {
                enemy.position.x += player.speed
            })
            skulls.forEach((skull) => {
                skull.position.x += player.speed
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
//Enemy collision detection
    enemies.forEach((enemy) => {
    if (player.position.y + player.height >= enemy.position.y + 10 &&  
        player.position.y - player.height <= enemy.position.y - 10 &&
        player.position.x + player.width >= enemy.position.x + 10 &&
        player.position.x - player.width <= enemy.position.x - 20) {
            youLose = true;
            youLoseMessage();
        }
    });

    c.drawImage(skull_box,950,400,50,100)

    //Skulls Collected
    c.font = "bold 30px impact";
    c.fillStyle = "red";
    c.fillText(skullsCollected, 975, 488);
    
    //Time
    c.fillStyle = "white";
    c.strokeStyle = "black";
    c.lineWidth = 4;
    c.strokeRect(canvas.width - 75, 20, 50, 38);
    c.fillRect(canvas.width - 75, 20, 50, 38);
    var currentTime = Date.now();
    var elapsedTime = Math.floor((currentTime - startTime) / 1000);  // In seconds
    c.font = "bold 30px impact";
    c.fillStyle = "red";
    c.fillText(elapsedTime, canvas.width - 50, 50);
    c.textAlign = "center"

//Skull collision detection

        handleCollision();
//Winning criteria
    if (scrollOffset > 3050) {
        youWin = true;
        totalTime = elapsedTime;  // Store the final time
        displayWinMessage();
        
    }
//Losing criteria
    if (player.position.y >= canvas.height - 71) {
        youLose = true;
        youLoseMessage();
    }
}
}
//Utility functions
function detectCollision(player, skull) {
    return (player.position.y + player.height >= skull.position.y + 10 &&  
        player.position.y - player.height <= skull.position.y - 10 &&
        player.position.x + player.width >= skull.position.x + 10 &&
        player.position.x - player.width <= skull.position.x - 20);
}

function handleCollision() {
    for (let i = skulls.length -1; i >= 0; i--) {
        let skull = skulls[i];
        if (skull && player) {
            if (detectCollision(player, skull)) {
                console.log("Skull collected!");
                skulls.splice(i, 1); // Removes the collectible at index i
                skullsCollected += 1;
            }
        } else {
            console.warn(`Undefined skull at index ${i} or player is undefined.`);
        }
    }
}

function displayWinMessage() {
    // Draw the "You Win" text
    c.font = "bold 60px impact";
    c.fillStyle = "green";
    var winText = "YOU WIN!";
    //var winTextWidth = c.measureText(winText).width;
    c.fillText(winText, canvas.width/2, canvas.height/2 - 50);

    // Display the total time taken to win
    c.font = "bold 40px courier";
    var timeText = `Total Time: ${totalTime}s`;
    //var timeTextWidth = c.measureText(timeText).width;
    c.fillText(timeText, canvas.width/2, canvas.height/2);

    // Draw the "Play Again" button
    c.fillStyle = "white";
    c.strokeStyle = "Red";
    c.lineWidth = 4;
    c.strokeRect(canvas.width/2 - 105, canvas.height / 2 + 40, 210, 70);
    c.fillRect(canvas.width/2 - 105, canvas.height / 2 + 40, 210, 70);  // Draw button background

    c.font = "bold 30px courier";
    c.fillStyle = "black";
    c.fillText("Play Again?", canvas.width/2, canvas.height/2 + 68);  // Button text
    c.fillText("Hit any key", canvas.width/2, canvas.height/2 + 100);  // Button text
}

function youLoseMessage() {
    c.font = "bold 60px impact";
    c.fillStyle = "red";
    var winText = "GAME OVER!";
    //var winTextWidth = c.measureText(winText).width;
    c.fillText(winText, canvas.width/2, canvas.height/2 - 50);

    // Draw the "Play Again" button
    c.fillStyle = "white";
    c.strokeStyle = "Red";
    c.lineWidth = 4;
    c.strokeRect(canvas.width/2 - 105, canvas.height/2 + 40, 210, 70);
    c.fillRect(canvas.width/2 - 105, canvas.height/2 + 40, 210, 70);  // Draw button background

    c.font = "bold 30px courier";
    c.fillStyle = "black";
    c.fillText("Play Again?", canvas.width/2, canvas.height/2 + 68);  // Button text
    c.fillText("Hit any key", canvas.width/2, canvas.height/2 + 100);  // Button text
}

animate()
//Controls
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
