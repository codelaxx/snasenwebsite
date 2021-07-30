// Note to self, it would have been easyer to start with "pick two", which would have simple "check for equality"
// And then go for the slider game after, which has more logic
// jup, and so I did

// TODO:
// -make a range based on num tiles for how much each tile should brighten, it's perfect with 9 or 12, but really bad with 25
// THERE IS A BUG ON FLIPPING THE BONUS TILE WITH AUTO CLOSW !!!!

var numMoves = 0;
var bestScore = 20;
var tilecols = 0;
var tilerows = 0;
var numTiles = tilecols * tilerows;
var tiles = new Array;
var gameIsRestarting = false;
var oldestTileId = -1;
var newestTileId = -1;
var currentTileId = -1;
var autoCloseMode = "no";

class Tile {
    constructor(id) {
        this.id = id;
        this.text = "";
        this.linkedTileId = -1;
        this.isFound = false;
        this.isUsed = false;
        this.isFlipped = false;
    }
}

class Calculation {
    constructor(operation) {
        this.operation = operation;
        this.operandA = 0;
        this.operandB = 0;
        this.result = 0;
    }

}

// Run startGame from here to skip start screen and go with defaults
// Note to self, classes are not hoisted, so functions can't see classes that are defined below them in code
//startGame();

function startGame() {
    // ask for num players
    // ask for seperate or joint board
    // ask for turn based or live (well, that's when it's online)
    // ask for difficulty/board size
    
    tilecols = 3; // TODO: refactor variable name to numBoardCols
    tilerows = 3; // TODO: refactor variable name to numBoardRows

    var parent = document.getElementById("startscreen");
    
    var cols = document.getElementById("cols").value;
    var rows = document.getElementById("rows").value;
    if (cols > 0) {tilecols = cols};
    if (rows > 0) {tilerows = rows};

    var modes = document.getElementsByName('autoClose'); //OBS, by name, the radio buttons common name!!!
    for(var i = 0; i < modes.length; i++){
        if(modes[i].checked){
            autoCloseMode = modes[i].value;
            console.log("Autoclose mode selected on radio buttons: " + autoCloseMode);
        }
    }

    numTiles = tilecols * tilerows;
    debug("Starting game with " + numTiles + " tiles.");

    var maxWidthPx = 300;
    var tileWidth = Math.floor(maxWidthPx / tilecols);

    var colCssTxt = "";
    for (var i = 0; i< tilecols; i++) {
        if (colCssTxt !== "") {
            colCssTxt += " ";
        }
        colCssTxt += tileWidth + "px"
    }
    document.getElementById("gameboard").style.gridTemplateColumns = colCssTxt;

    var rowCssTxt = "";
    for (var i = 0; i< tilerows; i++) {
        if (rowCssTxt !== "") {
            rowCssTxt += " ";
        }
        rowCssTxt += tileWidth + "px"; // Using same height as width
    }

    document.getElementById("gameboard").style.gridTemplateRows = rowCssTxt;

    document.getElementById("startscreen").style.display = "none";
    // don't call this until button is clicked 
    setupGameBoard();
}

function setupGameBoard() {
    generateQuestionsAndAnswers();

    var parent = document.getElementById("gameboard");
    
    //setup may be called after a full round is played, so cleanup is needed
    //https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for (var i = 1; i <= numTiles; i++) {
        var item = generateInsertableSquare(i, true);
        parent.appendChild(item);
    }
    
    //Making last tile special/blank, only needed for slider game
    //var item = generateInsertableSquare(numTiles, false);
    //parent.appendChild(item);


    //Kill start screen, turn on game board and message (TODO: move both in same div)
    document.getElementById("gameboard").style.display = "grid";
    document.getElementById("currentgameinfo").innerHTML = "Game On! Best score: " + bestScore;
    document.getElementById("currentgameinfo").style.display = "inline-block";
}

function generateQuestionsAndAnswers() {
    //may be called after a full round is played, so cleanup is needed
    tiles = new Array;
    
    //Prep array with tiles to fill with values
    for (var i = 1; i <= numTiles; i++) {
        tiles.push(new Tile(i));
    }

    //Hold calculations temporarily to avoid collisions on results
    var calculations = new Array;

    //Add questions on half the tiles
    for (var i = 1; i <= Math.floor(numTiles/2); i++) {
        var calc = makeUniqeCalculation(calculations);

        var a = calc.operandA;
        var b = calc.operandB;
        var answer = calc.result;
    
        var indexQuestion = findRandomAvailableTileIndex();
        
        tiles[indexQuestion].text = a + " + " + b;
        tiles[indexQuestion].isUsed = true;
        var indexAnswer = findRandomAvailableTileIndex(); //Important that this is done after the question is assigned and tagged with isUsed on a tile, so we don't end up with question and answer on same tiles
        tiles[indexQuestion].linkedTileId = indexAnswer;

        tiles[indexAnswer].text = answer;
        tiles[indexAnswer].linkedTileId = indexQuestion;
        tiles[indexAnswer].isUsed = true;
    }
}

function makeUniqeCalculation(existingCalculations) {
    var calc = new Calculation("+");
    calc.operandA = Math.floor(Math.random() * 11);
    calc.operandB = Math.floor(Math.random() * 11);
    calc.result = calc.operandA + calc.operandB; //TODO: parse or fix and use the actual operand, worst case use a switch statement

    while (existingCalculations.filter(calculation => (calculation.result === calc.result)).length > 0 ) {
        //TODO: make a breaker to abort if we take too long to resolce all collisions
        calc.operandA = Math.floor(Math.random() * 11);
        calc.operandB = Math.floor(Math.random() * 11);
        calc.result = calc.operandA + calc.operandB;
    }

    existingCalculations.push(calc);
    return calc;
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
    item.innerHTML = "?"; //Or if you want visible numbers for debugging, use idNumber;
    item.id = idNumber;
    item.className = "grid-item";
    item.style.fontSize = "15px";

    if (isMovable) {
        item.style.backgroundColor = ("rgb(0, 0, " + (idNumber*10 + 50) + ")" );
    } else {
        item.style.backgroundColor = "white";
    }

    item.style.color = "lightgrey"; //Font color on tiles

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
      //moveTile("hitx: touchstartevent detected, woha!");
      //moveTile("hitx: " + ev);
      //moveTile("hitx: " + ev.targetTouches[0].target);
      //moveTile("hitx: " + ev.targetTouches[0].target.id);

      flipTile(ev.targetTouches[0].target.id);

      // Set call preventDefault()
      ev.preventDefault();
    }
  
    return item;
}

function flipTile(id) {
    var currentTile = document.getElementById(id);
    var tileIdx = id-1;
    var linkedTileIdx = tiles[tileIdx].linkedTileId;

    var oldestTile = document.getElementById(oldestTileId);
    var oldestTileIdx = oldestTileId-1;

    var newestTile = document.getElementById(newestTileId);
    var newestTileIdx = newestTileId-1;



    if (tiles[tileIdx].isUsed) {
        debug("Tile " + id + ", index " + tileIdx + " had isFlipped state: " + tiles[tileIdx].isFlipped + ", and related tile index " + linkedTileIdx + ", with tile id " + (linkedTileIdx + 1) + " has flippedState " + tiles[linkedTileIdx].isFlipped);
    } else {
        debug("Tile " + id + ", index " + tileIdx + " had isFlipped state: " + tiles[tileIdx].isFlipped + ", no related tile since it's a blank bonus tile");
    }

    //https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
    var numFlippedNotFound = tiles.filter(aTile => (aTile.isFlipped && !aTile.isFound) ).length;
    console.log("Face up unpaired tiles before turning this tile: " + numFlippedNotFound)
    
    currentTileId = id;
    if (autoCloseMode === no) {
        //do nothing, let the regular logic handle it
    } else if (tiles[tileIdx].isFlipped && tiles[tileIdx].isFound) {
        //flipped and found, ignore
    } else if (tiles[tileIdx].isFlipped && !tiles[tileIdx].isFound) {
        //flipped but not found, so will be flipped down in main logic below
        if (currentTileId === newestTileId) {
            //if it is newest, replace newest tile with oldest tile but also keep oldest
            newestTileId = oldestTileId;
        }
        if (currentTileId === oldestTileId) {
            //if it is oldest, replace oldest with newest, but keep newest
            oldestTileId = newestTileId;
        }
    } else if (autoCloseMode === "oldest" && numFlippedNotFound === 2) {
        //TODO: flip down oldesst, then move oldest pointer to newest, and current to newest
        oldestTile.style.backgroundColor = ("rgb(0, 0, " + (oldestTileId*10 + 50) + ")" ); //Make original shade of color
        oldestTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
        tiles[oldestTileIdx].isFlipped = false;          
        oldestTileId = newestTileId;
        newestTileId = currentTileId;
        numFlippedNotFound--;
    } else if (autoCloseMode === "newest" && numFlippedNotFound === 2) {
        //flip down newest, then store current pointer in newest
        newestTile.style.backgroundColor = ("rgb(0, 0, " + (newestTileId*10 + 50) + ")" ); //Make original shade of color
        newestTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
        tiles[newestTileIdx].isFlipped = false;          
        //oldestTile = oldestTile;
        newestTileId = currentTileId;
        numFlippedNotFound--;
    } else if (autoCloseMode === "both" && numFlippedNotFound === 2) {
        //TODO: EXCLUDE CASE WHERE THEY ARE PAIRS or they can never be found, and probably do -1 for oldest/newest
        //turn down both. then store -1 in first and last pointers
        oldestTile.style.backgroundColor = ("rgb(0, 0, " + (oldestTileId*10 + 50) + ")" ); //Make original shade of color
        oldestTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
        tiles[oldestTileIdx].isFlipped = false;          
        newestTile.style.backgroundColor = ("rgb(0, 0, " + (newestTileId*10 + 50) + ")" ); //Make original shade of color
        newestTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
        tiles[newestTileIdx].isFlipped = false;          
        oldestTileId = -1;
        newestTileId = -1;
        numFlippedNotFound = 0;
    } else {
        //TODO: where and how is the best way to update with first/last values when first tile is turned
        //here maybe, and if autoclose no, then nobody cares anyways if it's right
        oldestTileId = newestTileId;
        newestTileId = currentTileId;
    }
    // TODO!!!!!!!!!!!!!! BUG ON BONUS TILE!!! when finding the bonus tile we have allready flipped it arround above here, so fix that



    //Handle face up tiles
    if (tiles[tileIdx].isFlipped) {
        if (tiles[tileIdx].isFound) {
            console.log("This tile was allready found, so ignoring the click...")
        } else {
            console.log("was flipped so turning face down")
            currentTile.style.backgroundColor = ("rgb(0, 0, " + (id*10 + 50) + ")" ); //Make original shade of color
            currentTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
            tiles[tileIdx].isFlipped = false;  
        }
    }
    //Handle face down tile
    else {
        //Not allowed to turn tiles if 2 allready turned
        if (numFlippedNotFound >= 2) {
            console.log("ignoring click and returning, player can't flip more than two unpaired cards at the same time!")
        } 
        //Handle turning the blank tile
        else if (tiles[tileIdx].isUsed === false) {
            console.log("found blank tile, so lock it face up");
            tiles[tileIdx].isFound = true;
            tiles[tileIdx].isFlipped = true;
            currentTile.innerHTML = tiles[tileIdx].text + " BONUS<BR>:D ";
            currentTile.style.backgroundColor = ("rgb(0, " + (id * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade

            numMoves++
        }
        //Handle finding pair
        else if ( tiles[linkedTileIdx].isFlipped ) { // inconcistent that linked tileid is zero based/index based!
            console.log("found matching tiles, so locking both face up");
            tiles[tileIdx].isFound = true;
            tiles[tileIdx].isFlipped = true;
            currentTile.innerHTML = tiles[tileIdx].text;
            currentTile.style.backgroundColor = ("rgb(0, " + (id * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade

            tiles[linkedTileIdx].isFound = true;
            //above is allready flipped
            //above is allready with text
            var tileLinked = document.getElementById(tiles[linkedTileIdx].id); //Just making it explicit, because on index which is zero based, we have the element with an id which is 1 based. We could just have added 1, but why not use the actuall id...
            tileLinked.style.backgroundColor = ("rgb(0, " + (tileLinked.id * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade
            
            numMoves++
        }
        //Handle turning "wrong" tile, not pair
        else {
            console.log("found no matching tile flipped when flipping this, and wasn't a bonus tile")
            currentTile.style.backgroundColor = ("rgb(" + (id * 10 + 50) + ", 0 , 0)" ); //Make redish in same nuance as original shade
            currentTile.innerHTML = tiles[id-1].text;
            tiles[tileIdx].isFlipped = true;         
            
            numMoves++
        }

    }
   
    document.getElementById("currentgameinfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;

    if ( gameOver() ) {
        var elem = document.getElementById("currentgameinfo");
        elem.innerHTML = "Great job! GAME OVER! Moves used: " + numMoves + ", best score: " + bestScore;
        if (bestScore > numMoves) {
            bestScore = numMoves;
            elem.innerHTML += "   WOW! Thats a new highscore!";
        }        

        console.log("restarting game initiated")
        if (!gameIsRestarting) {
            gameIsRestarting = true;

            // defer the execution of anonymous function for 3 seconds and go directly to next block of code.
            setTimeout(function(){ 
                startGame();
                numMoves = 0;
                setupGameBoard(); //TODO: this will later be called from showStartScreen based on settings there
                gameIsRestarting = false;                
                console.log("restart of game complete")
            }, 5000);

            console.log("restarting game set up as deferred for 5 seconds")
        }    
    }
};

function gameOver() {
    if ( tiles.filter(aTile => (!aTile.isFound) ).length <= 0 ) {
        console.log("game over, game won, wuhu!!!");
        return true;
    } else {
        return false;
    }
}

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
    document.getElementById("currentgameinfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;
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