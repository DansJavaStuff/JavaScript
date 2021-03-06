// *** CONSTANTS ***
var CANVAS_WIDTH = 800;				// Default = 800
var CANVAS_HEIGHT = 600;			// Default = 600
var NANONAUT_WIDTH = 181;			// Default = 181
var NANONAUT_HEIGHT = 229;			// Default = 229
var NANONAUT_X_SPEED = 5;			// Default = 5
var GROUND_Y = 540;					// Default = 540
var NANONAUT_Y_ACCELERATION = 1;	// Default = 1
var NANONAUT_JUMP_SPEED = 20;		// Default = 20
var SPACE_KEYCODE = 32;				// Space bar kay code = 32
var BACKGROUND_WIDTH = 1000;		// Default = 1000
var NANONAUT_NR_ANIMATION_FRAMES = 7;	// Default = 7
var NANONAUT_ANIMATION_SPEED = 3;	// Default = 3, Higher the number, the slower the animation changes!
var NUMBER_OF_BUSHES = 10;			// Enter the number of bushes, more bushes = busier screen
var ROBOT_WIDTH = 141;				// Default is 141
var ROBOT_HEIGHT = 139;				// Default is 139
var ROBOT_NR_ANIMATION_FRAMES = 9;	// Default = 9
var ROBOT_ANIMATION_SPEED = 5;		// Default = 5, Higher the number, the slower he goes! - this is the speed of animation
var ROBOT_X_SPEED = 4;				// Default = 4 - This is the speed the robot travls across the screen
var MIN_DISTANCE_BETWEEN_ROBOTS = 400;	// Default = 400
var MAX_DISTANCE_BETWEEN_ROBOTS = 1200;	// Default = 1200
var MAX_ACTIVE_ROBOTS = 3;			// Default is 3
var SCREENSHAKE_RADIUS = 16;		// Default is 16
var NANONAUT_MAX_HEALTH = 10;		// Default is 100
var PLAY_GAME_MODE = 0;				// Default is 0
var GAME_OVER_GAME_MODE = 1;		// Default is 1
var HIGH_SCORE = 0;					// Default is 0, obvs!

// *** SETUP ***
var canvas = document.createElement('canvas');
var c = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);
var cameraX = 0;
var cameraY = 0;

// Load the images
var nanonautImage = new Image();
nanonautImage.src = 'animatedNanonaut.png';		// New moving Nanonaut image! :-)
var robotImage = new Image();
robotImage.src = 'animatedRobot.png';
var backgroundImage = new Image();
backgroundImage.src = 'background.png';
var bush1Image = new Image();
bush1Image.src = 'bush1.png';
var bush2Image = new Image();
bush2Image.src = 'bush2.png';

// Spritesheets, moving images
var nanonautSpriteSheet = {
	nrFramesPerRow: 5,
	spriteWidth: NANONAUT_WIDTH,
	spriteHeight: NANONAUT_HEIGHT,
	image: nanonautImage
};

var robotSpriteSheet = {
	nrFramesPerRow: 3,
	spriteWidth: ROBOT_WIDTH,
	spriteHeight: ROBOT_HEIGHT,
	image: robotImage
};

// Settings for the collision detection
var nanonautCollisionRectangle = {
	xOffset: 60,
	yOffset: 20,
	width: 50,
	height: 200
};
var robotCollisionRectangle = {
	xOffset: 50,
	yOffset: 20,
	width: 50,
	height: 100
};

var robotData = [];
var nanonautX = CANVAS_WIDTH / 2;			// Added to remove the chunk of blue sky at the start
var nanonautY = GROUND_Y - NANONAUT_HEIGHT;	// Added to remove the chunk of blue sky at the start
var nanonautYSpeed = 0;
var nanonautIsInTheAir = false;
var spaceKeyIsPressed = false;
var nanonautFrameNr = 0;
var gameFrameCounter = 0;
var bushData = generateBushes();			// Bushes created using a function, to generate multiple bushes
var screenshake = false;
var nanonautHealth = NANONAUT_MAX_HEALTH;
var gameMode = PLAY_GAME_MODE;

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('load', start);
window.addEventListener('keydown', function(event) {
    var key_press = String.fromCharCode(event.keyCode);
    if(event.keyCode == 13) { location.reload(); }
});

// *** Scores **(
const Errors = document.getElementById('error');

function get_scores (callback) {
  // High Score Data
  let file = "scores.json";

  // Fetch High Score Data
  fetch(file, {cache: 'no-cache'})
    .then(function(response) {
        //  If the response isn't OK
        if (response.status !== 200) {
          Errors.innerHTML = response.status;
        }
        // If the response is OK
        response.json().then(function(data) {
          let scores = JSON.stringify(data);
          console.log(scores);
          callback (scores);
        });
      })
    // If there is an error
    .catch(function(err) {
      Errors.innerHTML = err;
    });
}

function start() {
	window.requestAnimationFrame(mainLoop);	
}

// Function to generate bushes
function generateBushes () {
	var generatedBushData = [];
	var bushX = 0;
	while (bushX < (2 * CANVAS_WIDTH)) {	// This bit ensures that bushes don't overlap
		var bushImage;
		if (Math.random() >= 0.5) {			// randomly select one of the bush images
			bushImage = bush1Image;
		} else {
			bushImage = bush2Image;
		}
	generatedBushData.push ({
		x: bushX,
		y: 80 + Math.random() * 20,
		image: bushImage
	});
	bushX += 150 + Math.random() * 200;
}
	return generatedBushData;
}

// *** MAIN LOOP ***
function mainLoop(){
	update();
	draw();
	window.requestAnimationFrame(mainLoop);
}

// PLAYER INPUT
// What happens when keys are pressed?
function onKeyDown(event) {
	if (event.keyCode === SPACE_KEYCODE) {
		spaceKeyIsPressed = true;
	}
}

function onKeyUp(event) {
	if (event.keyCode === SPACE_KEYCODE) {
		spaceKeyIsPressed = false;
	}
}

// *** UPDATING ***
function update() {
	if (gameMode != PLAY_GAME_MODE) return;

	gameFrameCounter = gameFrameCounter + 1;
	nanonautX = nanonautX + NANONAUT_X_SPEED;
	if (spaceKeyIsPressed && !nanonautIsInTheAir) {
		nanonautYSpeed = -NANONAUT_JUMP_SPEED;
		nanonautIsInTheAir = true;
	}
// Move the Nanonaut
	nanonautY = nanonautY + nanonautYSpeed;
	nanonautYSpeed = nanonautYSpeed + NANONAUT_Y_ACCELERATION;
	if (nanonautY > (GROUND_Y - NANONAUT_HEIGHT)) {
		nanonautY = GROUND_Y - NANONAUT_HEIGHT;
		nanonautYSpeed = 0;
		nanonautIsInTheAir = false;
	}

// Update Animation

if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0) {
	nanonautFrameNr = nanonautFrameNr + 1;
if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {
	nanonautFrameNr = 0;
}
}

// Update the camera
cameraX = nanonautX - 150;

// Update bushes
for (var i=0; i<bushData.length; i++) {
	if ((bushData[i].x - cameraX) < - CANVAS_WIDTH) {
		bushData[i].x += (2 * CANVAS_WIDTH) + 150;
	}
}

// Update robots
screenshake = false;
var nanonautTouchedARobot = updateRobots();
if (nanonautTouchedARobot) {
	screenshake = true;
if (nanonautHealth > 0) nanonautHealth -=1;
}

// Check if the game is over.
if (nanonautHealth <= 0) {
	gameMode = GAME_OVER_GAME_MODE;
	screenshake = false;
}

function updateRobots() {
	// Move and animate robots
	var nanonautTouchedARobot = false;
	for (var i=0; i<robotData.length; i++) {
		if (doesNanonautOverlapRobot(
			nanonautX + nanonautCollisionRectangle.xOffset,
			nanonautY + nanonautCollisionRectangle.yOffset,
			nanonautCollisionRectangle.width,
			nanonautCollisionRectangle.height,
			robotData[i].x + robotCollisionRectangle.xOffset,
			robotData[i].y + robotCollisionRectangle.yOffset,
			robotCollisionRectangle.width,
			robotCollisionRectangle.height)) {
			nanonautTouchedARobot = true;
		}
		robotData[i].x -= ROBOT_X_SPEED;
		if ((gameFrameCounter % ROBOT_ANIMATION_SPEED) === 0){
			robotData[i].frameNr = robotData[i].frameNr + 1;
			if (robotData[i].frameNr >= ROBOT_NR_ANIMATION_FRAMES) {
				robotData[i].frameNr = 0;
			}
		}
	}
	// Remove robots that have gone off-screen
	var robotIndex = 0;
	while (robotIndex < robotData.length) {
		if (robotData[robotIndex].x < cameraX - ROBOT_WIDTH) {
	robotData.splice(robotIndex, 1);
			} else {
				robotIndex += 1;
			}
		}
	if (robotData.length < MAX_ACTIVE_ROBOTS) {
		var lastRobotX = CANVAS_WIDTH;
		if (robotData.length > 0) {
			lastRobotX = robotData[robotData.length - 1].x;
		}
		var newRobotX = lastRobotX + MIN_DISTANCE_BETWEEN_ROBOTS + Math.random() * (MAX_DISTANCE_BETWEEN_ROBOTS - MIN_DISTANCE_BETWEEN_ROBOTS);
		robotData.push({
			x: newRobotX,
			y: GROUND_Y - ROBOT_HEIGHT,
			frameNr: 0
		});
	}
	return nanonautTouchedARobot;

}	// End of function updateRobots

// Collision detection
function doesNanonautOverlapRobotAlongOneAxis(nanonautNearX, nanonautFarX, robotNearX, robotFarX) {
	var nanonautOverlapsNearRobotEdge = (nanonautFarX >= robotNearX) && (nanonautFarX <= robotFarX);
	var nanonautOverlapsFarRobotEdge = (nanonautNearX >= robotNearX) && (nanonautNearX <= robotFarX);
	var nanonautOverlapsEntireRobot = (nanonautNearX <= robotNearX) && (nanonautFarX >= robotFarX);
	return nanonautOverlapsNearRobotEdge || nanonautOverlapsFarRobotEdge || nanonautOverlapsEntireRobot;
}
function doesNanonautOverlapRobot (nanonautX, nanonautY, nanonautWidth, nanonautHeight, robotX, robotY, robotWidth, robotHeight) {
	var nanonautOverlapsRobotOnXAxis = doesNanonautOverlapRobotAlongOneAxis (nanonautX, nanonautX + nanonautWidth, robotX, robotX + robotWidth);
	var nanonautOverlapsRobotOnYAxis = doesNanonautOverlapRobotAlongOneAxis (nanonautY, nanonautY + nanonautHeight, robotY, robotY + robotHeight);
	return nanonautOverlapsRobotOnXAxis && nanonautOverlapsRobotOnYAxis;
}

}	// End of update function

// *** DRAWING ***
function draw() {
	// Shake the screen if nescessary
	var shakenCameraX = cameraX;
	var shakenCameraY = cameraY;

	if (screenshake) {
		shakenCameraX += (Math.random() - .5) * SCREENSHAKE_RADIUS;
		shakenCameraY += (Math.random() - .5) * SCREENSHAKE_RADIUS;
	}


	// Clear the canvas to start with
	c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	c.fillStyle = 'LightSkyBlue';					// Draw the sky, choose the colour
	c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);	// Draw the sky, fill the page with the colour
// Draw the background
	var backgroundX = - (cameraX % BACKGROUND_WIDTH);
	c.drawImage(backgroundImage, backgroundX, -210);			// make the background scroll to the right
	c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);			// re-cdraw it so that it never ends

// Draw the ground
	c.fillStyle = 'ForestGreen';
	c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

// Draw the bushes
for (var i=0; i<bushData.length; i++) {			// more bushes with less code
	c.drawImage(bushData[i].image, bushData[i].x - shakenCameraX, GROUND_Y - bushData[i].y - shakenCameraY);
}

// Draw the robots
for (var i=0; i <robotData.length; i++) {
	drawAnimatedSprite(robotData[i].x - shakenCameraX,
	robotData[i].y - shakenCameraY, robotData[i].frameNr, robotSpriteSheet);
}

// Draw the Nanonaut
drawAnimatedSprite(nanonautX - cameraX, nanonautY - cameraY, nanonautFrameNr, nanonautSpriteSheet);

// Draw the distance the Nanonaut has travelled.
var nanonautDistance = nanonautX / 100;
c.fillStyle = 'black';
c.font = '48px sans-serif';
c.fillText(nanonautDistance.toFixed(0) + 'm', 20, 40);

// Draw the Health bar
c.fillStyle = 'red';
c.fillRect(400, 10, nanonautHealth / NANONAUT_MAX_HEALTH * 380, 20);
c.strokeStyle = 'red';
c.strokeRect(400, 10, 380, 20);

// Draw Animated Sprite
function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet) {
	var spriteSheetRow = Math.floor (frameNr / spriteSheet.nrFramesPerRow);
	var spriteSheetColumn = frameNr % spriteSheet.nrFramesPerRow;
	var spriteSheetX = spriteSheetColumn * spriteSheet.spriteWidth;
	var spriteSheetY = spriteSheetRow * spriteSheet.spriteHeight;
	c.drawImage (
		spriteSheet.image,
		spriteSheetX, spriteSheetY,
		spriteSheet.spriteWidth, spriteSheet.spriteHeight, screenX, screenY,
		spriteSheet.spriteWidth, spriteSheet.spriteHeight)
};

// If the game is over, tell the user!
if (gameMode == GAME_OVER_GAME_MODE) {
	c.fillStyle = 'black';
	c.font = '96px sans-serif';
	c.fillText('GAME OVER', 110, 300);
	c.fillText(nanonautDistance.toFixed(0) + 'm', 300, 400);
	c.font = '50px sans-serif';
	c.fillText('Press Enter to restart', 150, 500);
	if (HIGH_SCORE!== null) {
		if (nanonautDistance > HIGH_SCORE) {
			HIGH_SCORE = nanonautDistance.toFixed(0) + 'm';
		}
	}
	document.getElementById("highscore").value = HIGH_SCORE;
	//console.log('High score is' + HIGH_SCORE);
}

}			// End of draw function

