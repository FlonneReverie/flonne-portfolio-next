'use strict';

/*
	Hi~!

	This is actually something I wrote many years ago, a proposed HTML5 clone of an old Flash game.
	I would probably do several things differently had I written it today.
	At any rate, it's all raw Javascript and canvas.
	Hopefully this at least demonstrates my overall knowledge of JS!
*/


var gameContainer; //The element with ID "gameContainer". The game canvas is appended to this.
var gameTitlePage; //The element with ID "gameTitlePage". An overlay that displays the title, instructions, etc.
var gameCanvas; //The HTML5 canvas object (created later)
var gameContext; //Set to gameCanvas.getContext('2d') later, used for drawing 2D images/shapes.
var gameInterval = null; //Used to keep track of the game's running state. Set by startGame().
var gameInitialized = false; //Set to true when startGame() is executed for the first time.
var gameData = {}; //Filled with things this particular game needs to run.
var gameScore = 0; //The score that will ultimately be submitted. Modified by the game itself.
var gameOver = false; //Set to true when the player loses.
var gameShowingTitleScreen = true; //Set to false when the game actually begins.
var gameDpad; //The element with ID "gameDpad". Represents the virtual d-pad used in mobile mode.

var DEFAULT_GAME_WIDTH = 720; //Default canvas width in pixels.
var DEFAULT_GAME_HEIGHT = 720; //Default canvas height in pixels.
var GAME_WIDTH = DEFAULT_GAME_WIDTH; //Canvas width in pixels.
var GAME_HEIGHT = DEFAULT_GAME_HEIGHT; //Canvas height in pixels.
var GAME_FRAMERATE = 10; //Frames per second. gameLoop() is called this many times per second while the game plays.

//Define input buffers. Used to detect inputs during gameLoop().
var keysDownArray = [];
var keysDownNow = [];
var keysUpNow = [];

var preloadImages =
{
	background: 'gameassets/bg.png',
	body: 'gameassets/body.png',
	head: 'gameassets/head.png',
	blockred: 'gameassets/blockred.png',
	blockblue: 'gameassets/blockblue.png',
	blockyellow: 'gameassets/blockyellow.png',
	blockpurple: 'gameassets/blockpurple.png',
	blockrainbow: 'gameassets/blockrainbow.png',
	gameover: 'gameassets/gameover.webp'
};

var gameOverSfx = new Audio('gameassets/gameover.mp3');
var eatSfx = new Audio('gameassets/eat.mp3');


var preloadedItems = []; //Filled by iteratePreloadCounter().
var preloadedItemCount = 0; //Iterated by preload().
var preloaded = false; //Set to true when preload is complete by iteratePreloadCounter().

function iteratePreloadCounter(item)
{
	//Used by preload(), do not call otherwise.
	
	//If we're already done preloading, ignore this call.
	if(preloaded) return;
	
	//Make sure we don't already have this item before adding it.
	//indexOf return -1 if the item was not found.
	if(preloadedItems.indexOf(item) < 0) preloadedItems.push(item);
	
	//Exit if we're not done yet.
	if(preloadedItems.length < preloadedItemCount) return;
	
	//We're done!
	preloaded = true;
	
	//Clear preloadedItems, we don't need it anymore.
	preloadedItems = null;
	
	//Start the game engine now that we're done preloading.
	initializeGame();
	startGame();
}

function preload()
{
	if(preloaded) {
		startGame();
		return;
	}
	//Iterate through the preloader assets.
	for(var key in preloadImages)
	{
		//Iterate our counter.
		preloadedItemCount++;
		
		//Create a new image object.
		var image = new Image();
		
		//Set the onload event to call iteratePreloadCounter with this item's path.
		//The confusing double-function syntax effectively copies preloadImages[key]'s current value (the path).
		//We do this because we're about to change the value of preloadImages[key].
		image.onload = (function(item){return function(){iteratePreloadCounter(item);}})(key);
		
		//Set the image path so it can load.
		image.src = preloadImages[key];
		
		//Set preloadImages[key] to the new image object.
		preloadImages[key] = image;
	}
}

function resetGame() {

	//Pause any running game.
	pauseGame();

	//Clear all input buffers.
	keysDownNow = [];
	keysUpNow = [];
	keysDownArray = [];

	//Create the playing field.
	//These will be populated with the various colored blocks later.
	gameData.badBlocks = [];
	gameData.goodBlock = [];
	
	//Set how many tiles make up the field.
	var playingFieldWidth = 24;
	var playingFieldHeight = 22;
	
	//Spawn the snake in the middle of the playing field.
	
	gameData.snakeX = Math.floor(playingFieldWidth/2);
	gameData.snakeY = Math.floor(playingFieldHeight/2);
	gameData.snakeDirection = 0;
	
	gameData.playingFieldWidth = playingFieldWidth;
	gameData.playingFieldHeight = playingFieldHeight;
	
	//Set default snake length. (This doesn't include the head.)
	gameData.snakeTailLength = 4;
	gameData.snakeTail = [];

	gameScore = 0;
	gameData.scoreBox.updateScore(gameScore);
	gameOver = false;

	var bg = preloadImages.background; //Cache so we don't have to access it 3 times per frame.
	gameContext.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, gameCanvas.width, gameCanvas.height);
}

function gameLoop()
{
	//The main game loop.
	
	//You can optionally clear the canvas, but we have a full-screen background in this case, so we don't need to.
	//It clears to transparent, but you could also draw a rectangle if you wanted a solid color.
	//gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	
	//Draw the background image.
	//This particular drawImage call stretches the background to match the canvas if they're not the same size.
	
	var bg = preloadImages.background; //Cache so we don't have to access it 3 times per frame.
	gameContext.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, gameCanvas.width, gameCanvas.height);
	
	//If we're still on the title screen, do nothing else.
	if(gameShowingTitleScreen)
	{
		if(keysDownNow.length > 0) //Some key has been pressed.
		{
			//Close the title screen and start the game!
			gameShowingTitleScreen = false;
			gameTitlePage.style.display = 'none';
			gameData.scoreBox.updateScore(gameScore);
			//Set the snake's direction if any input is already down.
			if(keysDownArray.indexOf(38) >= 0) gameData.snakeDirection = 0; //Up
			else if(keysDownArray.indexOf(39) >= 0) gameData.snakeDirection = 1; //Right
			else if(keysDownArray.indexOf(40) >= 0) gameData.snakeDirection = 2; //Down
			else if(keysDownArray.indexOf(37) >= 0) gameData.snakeDirection = 3; //Left
		}
		else return; //Otherwise don't continue.
	}
	
	//Cache the field and tile sizes, too, and some other graphics.
	var verticalOffset = gameCanvas.width / 12; //Prevents the score section from being touched by the game.
	var playingFieldWidth = gameData.playingFieldWidth;
	var playingFieldHeight = gameData.playingFieldHeight;
	var tileWidth = gameCanvas.width / playingFieldWidth;
	var tileHeight = (gameCanvas.height - verticalOffset) / playingFieldHeight;
	var body = preloadImages.body;
	var head = preloadImages.head;
	var blockred = preloadImages.blockred;
	
	//Set the snake's direction if any input is received.
	//The direction check is to prevent obvious suicides (going in the opposite direction).
	if(keysDownNow.indexOf(38) >= 0){if(gameData.snakeDirection != 2) gameData.snakeDirection = 0;} //Up
	else if(keysDownNow.indexOf(39) >= 0){if(gameData.snakeDirection != 3) gameData.snakeDirection = 1;} //Right
	else if(keysDownNow.indexOf(40) >= 0){if(gameData.snakeDirection != 0) gameData.snakeDirection = 2;} //Down
	else if(keysDownNow.indexOf(37) >= 0){if(gameData.snakeDirection != 1) gameData.snakeDirection = 3;} //Left
	
	//If there's currently no good block, create a random one.
	if(gameData.goodBlock.length == 0)
	{
		var whichBlock;
		if(Math.random() >= 0.25) whichBlock = 0;
		else if(Math.random() < 0.75) whichBlock = 1;
		else if(Math.random() < 0.75) whichBlock = 2;
		else whichBlock = 3;
		
		//Keep re-rolling until the selected coordinate isn't already occupied by the snake head, tail, or bad blocks.
		var where = gameData.getRandomUnoccupiedCoordinate();
		
		gameData.goodBlock = [where[0], where[1], whichBlock];
	}
	
	//Make the snake's body.
	gameData.snakeTail.push([gameData.snakeX, gameData.snakeY, gameData.snakeDirection]);
	
	//If the tail is too long, remove the oldest piece.
	if(gameData.snakeTail.length > gameData.snakeTailLength) gameData.snakeTail.shift();
	
	//Move the snake.
	switch(gameData.snakeDirection)
	{
		case 0:
			//Up
			gameData.snakeY--;
			break;
		case 1:
			//Right
			gameData.snakeX++;
			break;
		case 2:
			//Down
			gameData.snakeY++;
			break;
		case 3:
		default:
			//Left
			gameData.snakeX--;
	};
	
	//Handle loop-arounds.
	if(gameData.snakeX < 0) gameData.snakeX += gameData.playingFieldWidth;
	else if(gameData.snakeX >= gameData.playingFieldWidth) gameData.snakeX -= gameData.playingFieldWidth;
	if(gameData.snakeY < 0) gameData.snakeY += gameData.playingFieldHeight;
	else if(gameData.snakeY >= gameData.playingFieldHeight) gameData.snakeY -= gameData.playingFieldHeight;
	
	//Draw the good block.
	var goodBlock;
	switch(gameData.goodBlock[2])
	{
		case 1:
			//Yellow
			goodBlock = preloadImages.blockyellow;
			break;
		case 2:
			//Purple
			goodBlock = preloadImages.blockpurple;
			break;
		case 3:
			//Rainbow
			goodBlock = preloadImages.blockrainbow;
			break;
		case 0:
		default:
			//Blue
			goodBlock = preloadImages.blockblue;
	};
	gameContext.drawImage(goodBlock, 0, 0, goodBlock.width, goodBlock.height, gameData.goodBlock[0]*tileWidth, gameData.goodBlock[1]*tileHeight + verticalOffset, tileWidth, tileHeight);
	
	//Draw the bad (red) blocks.
	for(var i = 0, l = gameData.badBlocks.length; i<l; i++)
	{
		var block = gameData.badBlocks[i];
		gameContext.drawImage(blockred, 0, 0, blockred.width, blockred.height, block[0]*tileWidth, block[1]*tileHeight + verticalOffset, tileWidth, tileHeight);
	}
	
	//Draw the snake body.
	var snakeSpriteSize = head.width / 4;
	for(var i = 0, l = gameData.snakeTail.length; i<l; i++)
	{
		var segment = gameData.snakeTail[i];
		gameContext.drawImage(body, snakeSpriteSize*segment[2], 0, snakeSpriteSize, body.height, segment[0]*tileWidth, segment[1]*tileHeight + verticalOffset, tileWidth, tileHeight);
	}
	
	//Draw the snake head.
	var snakeHeadWidth = tileWidth*1.5;
	var snakeHeadHeight = tileHeight*1.5;
	gameContext.drawImage(head, snakeSpriteSize*gameData.snakeDirection, 0, snakeSpriteSize, head.height, gameData.snakeX*tileWidth - ((snakeHeadWidth-tileWidth)/2), gameData.snakeY*tileHeight + verticalOffset - ((snakeHeadHeight-tileHeight)/2), snakeHeadWidth, snakeHeadHeight);
	
	//If the player hit themselves, they lose!
	for(var i = 0, l = gameData.snakeTail.length; i<l; i++)
	{
		var segment = gameData.snakeTail[i];
		if(segment[0] == gameData.snakeX && segment[1] == gameData.snakeY){gameData.gameOver();return;}
	}
	
	//Same thing with the red blocks!
	for(var i = 0, l = gameData.badBlocks.length; i<l; i++)
	{
		var block = gameData.badBlocks[i];
		if(block[0] == gameData.snakeX && block[1] == gameData.snakeY){gameData.gameOver();return;}
	}
	
	//If they hit the good block, on the other hand, add it to the score and increase the snake's length!
	if(gameData.goodBlock[0] == gameData.snakeX && gameData.goodBlock[1] == gameData.snakeY)
	{
		gameData.snakeTailLength += 3;
		switch(gameData.goodBlock[2])
		{
			case 1:
				//Yellow
				gameData.addScore(10);
				break;
			case 2:
				//Purple
				gameData.addScore(15);
				break;
			case 3:
				//Rainbow
				gameData.addScore(20);
				break;
			case 0:
			default:
				//Blue
				gameData.addScore(5);
		};
		
		//Remove this block. (A new one will be created at the start of the next frame.)
		gameData.goodBlock = [];
		
		//Random chance of spawning another bad block.
		if(Math.random() < 0.33) gameData.badBlocks.push(gameData.getRandomUnoccupiedCoordinate());
	}
}

function initializeGame()
{
	//Called once to initialize the game.
	
	//Prevent further calls to this function.
	if(gameInitialized) return;
	gameInitialized = true;

	//Get the gameContainer element and set it up properly.
	gameContainer = document.getElementById('gameContainer');
	gameContainer.tabIndex = -1; //Must be set to be able to get focus -- don't ask me...
	
	//Check to make sure canvas works. If not, give up.
	if(!window.CanvasRenderingContext2D)
	{
		document.getElementById('javascriptWarning').innerHTML = 'Your browser does not support 2D rendering via HTML5 Canvas. Please upgrade to a modern, standards-compliant browser to play this game, such as Mozilla Firefox or Google Chrome.';
		return;
	}
	
	//Hide the Javascript warning div -- we know now that everything should work.
	document.getElementById('javascriptWarning').style.display = 'none';
	
	//Get the gameTitlePage element.
	gameTitlePage = document.getElementById('gameTitlePage');
	
	//Create the game canvas and store the 2D render context.
	gameCanvas = document.createElement('canvas');
	gameCanvas.id = 'gameCanvas';
    gameCanvas.width = DEFAULT_GAME_WIDTH;
    gameCanvas.height = DEFAULT_GAME_HEIGHT;
	gameContext = gameCanvas.getContext('2d');
	
	//Add the canvas to the document.
	gameContainer.appendChild(gameCanvas);
	
	//Hook inputs.
	gameDpad = document.getElementById('gameDpad');
	gameDpad.addEventListener('touchstart', touchEvent);
	gameDpad.addEventListener('touchmove', touchEvent);

	gameCanvas.addEventListener('click', function() {
		if(gameOver) {
			resetGame();
			gameShowingTitleScreen = true;
			gameTitlePage.style.display = 'block';
			startGame();
		}
	});

    //Set up the auto-resizer.
    window.addEventListener('resize', autoResize);
    autoResize();
	
	//Show the title screen.
	gameTitlePage.style.display = 'block';
	
	//Create the score textbox.
	var scoreBox = document.getElementById('gameScoreBox');
	scoreBox.id = 'gameScoreBox';
	scoreBox.updateScore = function(score){this.innerHTML = 'Score: '+score;};
	gameContainer.appendChild(scoreBox);
	gameData.scoreBox = scoreBox;
	
	//Create the score-adding function.
	gameData.addScore = function(score) {
		gameScore += score;
		this.scoreBox.updateScore(gameScore);
		eatSfx.play();
	};
	
	//Create the game-over function.
	gameData.gameOver = function() {
		if(gameOver) return;
		gameOver=true;
		pauseGame();
		var bg = preloadImages.gameover;
		gameContext.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, gameCanvas.width, gameCanvas.height);
		gameOverSfx.play();
	};
	
	//Create the playing field in a new state.
	resetGame();
	
	//Function to generate an unoccupied space. Useful for generating new blocks.
	gameData.getRandomUnoccupiedCoordinate = function()
	{
		while(true)
		{
			var blockX = randomInt(this.playingFieldWidth);
			var blockY = randomInt(this.playingFieldHeight);
			if(blockX == this.snakeX && blockY == this.snakeY) continue;
			if(this.goodBlock.length > 0)
				if(blockX == this.goodBlock[0] && blockY == this.goodBlock[1]) continue;
			var reroll = false;
			for(var i = 0, l = this.badBlocks.length; i<l; i++)
			{
				var block = this.badBlocks[i];
				if(blockX == block[0] && blockY == block[1]){reroll=true;break;}
			}
			if(reroll) continue;
			for(var i = 0, l = this.snakeTail.length; i<l; i++)
			{
				var segment = this.snakeTail[i];
				if(blockX == segment[0] && blockY == segment[1]){reroll=true;break;}
			}
			if(reroll) continue;
			
			return [blockX,blockY];
		}
	};
	
	//Prerender the head and body rotations.
	var prerenderFlippedSprite = function(sprite)
	{
		var spriteCanvas = document.createElement('canvas');
		spriteCanvas.width = sprite.width * 4;
		spriteCanvas.height = sprite.height;
		var spriteContext = spriteCanvas.getContext('2d');
		spriteContext.drawImage(sprite, 0, 0);
		var spriteFlipCanvas = document.createElement('canvas');
		spriteFlipCanvas.width = sprite.width;
		spriteFlipCanvas.height = sprite.height;
		var spriteFlipContext = spriteFlipCanvas.getContext('2d');
		for(var i = 1; i < 4; i++)
		{
			spriteFlipContext.clearRect(0, 0, sprite.width, sprite.height);
			spriteFlipContext.save();
			spriteFlipContext.translate(sprite.width * 0.5, sprite.height * 0.5);
			spriteFlipContext.rotate(DegToRad(90*i));
			spriteFlipContext.translate(-sprite.width * 0.5, -sprite.height * 0.5);
			spriteFlipContext.drawImage(sprite, 0, 0);
			spriteContext.drawImage(spriteFlipCanvas, sprite.width * i, 0);
			spriteFlipContext.restore();
		}
		return spriteCanvas;
	};
	
	preloadImages.head = prerenderFlippedSprite(preloadImages.head);
	preloadImages.body = prerenderFlippedSprite(preloadImages.body);
}

function internalFrame()
{
	//Internal wrapper for gameLoop() that also handles necessary pre- and post-frame logic.
	
	//Call the loop.
	gameLoop();
	
	//Clear per-frame input buffers.
	keysDownNow = [];
	keysUpNow = [];
}

function startGame()
{
	//If this is the first time starting the game, initialize.
	if(!gameInitialized) initializeGame();

	//Clear the canvas.
	var bg = preloadImages.background; //Cache so we don't have to access it 3 times per frame.
	gameContext.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, gameCanvas.width, gameCanvas.height);
	
	//Set gameLoop() to run every (1000/GAME_FRAMERATE) milliseconds.
	//You can also call this function to resume the game after pausing it.
	//You can also call this function to apply a runtime change to GAME_FRAMERATE (for slo-mo powerups, etc.)
	
	//First call pauseGame() to make sure gameInterval is clear.
	pauseGame();
	
	//Now create a new gameInterval.
	gameInterval = setInterval(internalFrame, 1000.0/GAME_FRAMERATE);
}

function pauseGame()
{
	//Stops the calls to gameLoop().
	//Call startGame() to unpause.
	if(gameInterval != null)
	{
		clearInterval(gameInterval);
		gameInterval = null;
	}
}

function arrayRemoveElement(array, element)
{
	//Removes element from array if it exists, otherwise does nothing.
	//Note that this function returns nothing -- it actually modifies the input array.
	var index = array.indexOf(element);
	if(index < 0) return;
	array.splice(index, 1);
}

function keydown(e)
{
	//Internal handler for asynchrous keypresses.
	
	if(keysDownArray.indexOf(e.keyCode) < 0)
	{
		keysDownArray.push(e.keyCode);
		keysDownNow.push(e.keyCode);
	}
	return false;
}

function keyup(e)
{
	//Internal handler for asynchrous key releases.
	
	if(keysDownArray.indexOf(e.keyCode) >= 0)
	{
		arrayRemoveElement(keysDownArray, e.keyCode);
		keysUpNow.push(e.keyCode);
	}
	return false;
}

function touchEvent(e) {
	//Internal handler for touch interaction with the virtual d-pad.
	e.preventDefault();

	var touches = e.changedTouches;

	var dpadRect = gameDpad.getBoundingClientRect();

	for (var i = 0; i < touches.length; i++) {
	  var trueTouchX = touches[i].clientX - dpadRect.x;
	  var trueTouchY = touches[i].clientY - dpadRect.y;
	  var touchRatioX = trueTouchX / dpadRect.width;
	  var touchRatioY = trueTouchY / dpadRect.height;
	  if(touchRatioX < 0.30 && (touchRatioY > 0.30 && touchRatioY < 0.70)) {
		//Left press
		keysDownArray.push(37);
		keysDownNow.push(37);
	  }else if(touchRatioX > 0.70 && (touchRatioY > 0.30 && touchRatioY < 0.70)) {
		//Right press
		keysDownArray.push(39);
		keysDownNow.push(39);
	  }else if(touchRatioY < 0.30 && (touchRatioX > 0.30 && touchRatioX < 0.70)) {
		//Up press
		keysDownArray.push(38);
		keysDownNow.push(38);
	  }else if(touchRatioY > 0.70 && (touchRatioX > 0.30 && touchRatioX < 0.70)) {
		//Down press
		keysDownArray.push(40);
		keysDownNow.push(40);
	  }
	}
}

function randomInt(max)
{
	//Return a random integer in range 0-(max-1).
	return Math.floor(Math.random()*max);
}

function DegToRad(d)
{
    //Converts degrees to radians, for use in radian-centric rotation calculations.
    return d*0.0174532925199432957;
}

function browserIsMobile(){let a = (navigator.userAgent||navigator.vendor||window.opera);if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))return true;return false;}

function autoResize() {
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
	let mobileMode = browserIsMobile();
	if(mobileMode) {
		gameDpad.style.display = 'inline-block';
		if(winWidth < winHeight) {
			var scaleFactor = (winWidth/DEFAULT_GAME_WIDTH);
			gameContainer.style.transformOrigin = 'top left';
			gameContainer.style.left = gameContainer.style.top = '0';
			gameContainer.style.right = 'auto';
			gameContainer.style.transform = 'scale('+scaleFactor+')';
			gameDpad.style.bottom = (35*scaleFactor)+'px';
			gameDpad.style.top = 'auto';
			gameDpad.style.left = '50%';
			gameDpad.style.transform = 'translateX(-50%) scale('+scaleFactor+')';
		}else {
			var scaleFactor = (winHeight/DEFAULT_GAME_WIDTH);
			gameContainer.style.transformOrigin = 'top right';
			gameContainer.style.top = '0';
			gameContainer.style.left = 'auto';
			gameContainer.style.right = '0';
			gameContainer.style.transform = 'scale('+scaleFactor+')';
			gameDpad.style.bottom = 'auto';
			gameDpad.style.top = '50%';
			gameDpad.style.left = (50*scaleFactor)+'px';
			gameDpad.style.transform = 'translateY(-50%) scale('+scaleFactor+')';
		}
	}else {
		if(winWidth < winHeight) {
			gameContainer.style.transform = 'translate(-50%, -50%) scale('+(winWidth/DEFAULT_GAME_WIDTH)+')';
		}else {
			gameContainer.style.transform = 'translate(-50%, -50%) scale('+(winHeight/DEFAULT_GAME_WIDTH)+')';
		}
		gameDpad.style.display = 'none';
	}
}

document.getElementById('gameStartBtn').addEventListener('click', function() {
	document.getElementById('mainContent').style.display = 'none';
	document.getElementById('gameSection').style.display = 'block';
	preload();
	window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);
});

document.getElementById('gameExitBtn').addEventListener('click', function() {
	resetGame();
	gameShowingTitleScreen = true;
	gameTitlePage.style.display = 'block';
	document.getElementById('gameSection').style.display = 'none';
	document.getElementById('mainContent').style.display = 'block';
	window.removeEventListener('keydown', keydown);
	window.removeEventListener('keyup', keyup);
});
