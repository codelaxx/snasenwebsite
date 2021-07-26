// Note to self, it would have been easyer to start with "pick two", which would have simple "check for equality"
// And then go for the slider game alter, which has more logic

// nuiscance, classes on top, inits on bottom!

var numMoves = 0;
var bestScore = 20;
var width = 0;
var height = 0;
var numTiles = width * height;
var tiles = new Array;

class Tile {
    constructor(id) {
        this.id = id;
        this.text = "";
        this.linkedTileId = 0;
        this.isFound = false;
        this.isUsed = false;
        this.isFlipped = false;
    }
}

function showStartScreen() {
    // ask for num players
    // ask for seperate or joint board
    // ask for turn based or live (well, that's when it's online)
    // ask for difficulty/board size
    
    width = 3; // Hardcoded, will need to change css to alter layout (.grid-container.grid-template-columns)
    height = 3
    numTiles = width * height;
    debug("Starting game with " + numTiles + " tiles.");
}

function setupGameBoard() {
    generateQuestionsAndAnswers();

    var parent = document.getElementById("gameboard");

    for (var i = 1; i <= numTiles; i++) {
        var item = generateInsertableSquare(i, true);
        parent.appendChild(item);
    }
    
    //Making last tile special/blank, only needed for slider game
    //var item = generateInsertableSquare(numTiles, false);
    //parent.appendChild(item);

}

function generateQuestionsAndAnswers() {
    for (var i = 1; i <= numTiles; i++) {
        tiles.push(new Tile(i));
    }

    //Add questions on half the tiles
    for (var i = 1; i <= Math.floor(numTiles/2); i++) {
        var a = Math.floor(Math.random() * 11);
        var b = Math.floor(Math.random() * 11);
    
        var indexQuestion = findRandomAvailableTileIndex();
        var indexAnswer = findRandomAvailableTileIndex();

        tiles[indexQuestion].text = "Solve: " + a + " + " + b + " = ?";
        tiles[indexQuestion].linkedTileId = indexAnswer;
        tiles[indexQuestion].isUsed = true;

        tiles[indexAnswer].text = "Answer: " + (a + b);
        tiles[indexAnswer].linkedTileId = indexQuestion;
        tiles[indexAnswer].isUsed = true;
    }

    

}

function findRandomAvailableTileIndex() {
    var triesRemaining = 999;
    while (triesRemaining > 0) {
        triesRemaining--;
        var indexToCheck = Math.floor(Math.random() * numTiles);
        if ( tiles[indexToCheck].isUsed === false) {
            return indexToCheck;
        } else {
            console.log("tile generation collision counter: " + (999 - triesRemaining) );
        }
    }
}



function generateInsertableSquare(idNumber, isMovable) {
    var item = document.createElement("div");
    item.innerHTML = idNumber;
    item.id = idNumber;
    item.className = "grid-item";

    if (isMovable) {
        item.style.backgroundColor = ("rgb(0, 0, " +idNumber*10 + ")" );
    } else {
        item.style.backgroundColor = "white";
    }

    item.style.color = "red";

    // https://stackoverflow.com/questions/4631975/detecting-mouse-click-on-div-with-javascript-without-side-effects
    // https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
    // item.onclick... would it be the same?
    //item.onclick = "move(id)";
    item.onclick = function(event) {
        console.log(event);
        console.log(event.path[0].id);

        flipTile(event.path[0].id)
    }

    //
    // Touch device support:::--->
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events
    // remember, prevent default because often browsers also emulate mouseclicks
    // 

    // Touch events
    item.addEventListener('touchstart', process_touchstart, false);
    //item.addEventListener('touchmove', process_touchmove, false);
    //item.addEventListener('touchcancel', process_touchcancel, false);
    //item.addEventListener('touchend', process_touchend, false);

    // touchstart handler
    function process_touchstart(ev) {
    // Use the event's data to call out to the appropriate gesture handlers
    //switch (ev.touches.length) {
      //case 1: handle_one_touch(ev); break;
      //case 2: handle_two_touches(ev); break;
      //case 3: handle_three_touches(ev); break;
      //default: gesture_not_supported(ev); break;
    //}
      console.log(ev);
      //move("hitx: touchstartevent detected, woha!");
      //move("hitx: " + ev);
      //move("hitx: " + ev.targetTouches[0].target)
      moveTile("hitx: " + ev.targetTouches[0].target.id)

      // Set call preventDefault()
      ev.preventDefault();
    }
  
    return item;
}

function flipTile(id) {
    var tile = document.getElementById(id);
    var tileIdx = id-1;
    var linkedTileIdx = tiles[tileIdx].linkedTileId;

    debug("Tile " + id + ", index " + tileIdx + " had isFlipped state: " + tiles[tileIdx].isFlipped + ", and related tile index " + linkedTileIdx + ", with tile id " + (linkedTileIdx + 1) + " has flippedState " + tiles[linkedTileIdx].isFlipped);

    if (tiles[tileIdx].isFlipped) {
        console.log("was flipped so turning face down")
        tile.style.backgroundColor = ("rgb(0, 0, " +id*10 + ")" ); //Make original shade of color
        tile.innerHTML = tile.id;
        tiles[tileIdx].isFlipped = false;
    } else {
        if (tiles[tileIdx].isUsed === false) {
            console.log("found blank tile, so locks it face up");
            tiles[tileIdx].isFound = true;
            tiles[tileIdx].isFlipped = true;
            tile.innerHTML = tiles[tileIdx].text + " BONUS TILE ";
            tile.style.backgroundColor = ("rgb(0, " + id*10 + ", 0)" ); //Make greenish in same nuance as original shade
        } else if ( tiles[linkedTileIdx].isFlipped ) { // inconcistent that linked tileid is zero based/index based!
            console.log("found matching tiles, so locking both face up");
            tiles[tileIdx].isFound = true;
            tiles[tileIdx].isFlipped = true;
            tile.innerHTML = tiles[tileIdx].text;
            tile.style.backgroundColor = ("rgb(0, " + id*10 + ", 0)" ); //Make greenish in same nuance as original shade

            tiles[linkedTileIdx].isFound = true;
            //above is allready flipped
            //above is allready with text
            var tileLinked = document.getElementById(tiles[linkedTileIdx].id); //Just making it explicit, because on index which is zero based, we have the element with an id which is 1 based. We could just have added 1, but why not use the actuall id...
            tileLinked.style.backgroundColor = ("rgb(0, " + tileLinked.id*10 + ", 0)" ); //Make greenish in same nuance as original shade
            
        } else {
            console.log("found no matching tile flipped when flipping this, and wasn't a bonus tile")
            tile.style.backgroundColor = ("rgb(" + id*10 + ", 0 , 0)" ); //Make redish in same nuance as original shade
            tile.innerHTML = tiles[id-1].text;
            tiles[tileIdx].isFlipped = true;           
        }

    }
   
    numMoves++
    document.getElementById("currentGameInfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;
    debug(id);
};

function moveTile(id) {
    //Note, not doing this now, will do this later, rateher doing "find equals now"

    //TODO: move it
    // ie, check that it is adjacent to number 10, then
    // transition this to white
    // transition position of 10 to the color of this (based on rgb(0, 0, 20*itemnumber))
    // if order is 1...10, game won
    // bonus, make function for taking in pictures, adjusting/clipping, and transitioning

    // verify if board order matches correctBoard, if yes, tada, victory, show game won/num moves->play again

    numMoves++
    document.getElementById("currentGameInfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;
    debug(id);
};

function debug(output) {
    console.log(output);
    var parent = document.getElementById("debuglist");
    var listItem = document.createElement("li");
    listItem.innerHTML = output;
    //parent.appendChild(listItem);
    // https://stackoverflow.com/questions/618089/can-i-insert-elements-to-the-beginning-of-an-element-using-appendchild
    parent.prepend(listItem);
}

// Run from here, bla bla hoisting foo bar, classes are not hoisted

showStartScreen();
setupGameBoard();

