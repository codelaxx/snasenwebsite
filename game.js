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
var oldestTileIdx = -1;
var newestTileIdx = -1;
var autoCloseMode = "no";

class Tile {
    constructor(idx) {
        this.id = idx;
        this.text = "";
        this.linkedTileId = -1; //TODO: might as well call this linkedTileIdx since that's what it is, and that is used as id...
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

    //Extract which radiobutton is checked by itterating all radios in autoClose
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
    for (var i = 0; i < tilecols; i++) {
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

    for (var i = 0; i < numTiles; i++) {
        var item = generateInsertableSquare(i);
        parent.appendChild(item);
    }
    
    //Making last tile special/blank, only needed for slider game
    //var item = generateInsertableSquare(numTiles);
    //parent.appendChild(item);

    //Hide start screen, turn on game board and message (TODO: move both in same div)
    document.getElementById("gameboard").style.display = "grid";
    document.getElementById("currentgameinfo").innerHTML = "Game On! Best score: " + bestScore;
    document.getElementById("currentgameinfo").style.display = "inline-block";
}

function generateQuestionsAndAnswers() {
    //called both on start and after a full round is played, so cleanup is needed
    tiles = new Array;
    
    //Prep array with tiles to fill with values
    for (var i = 0; i < numTiles; i++) {
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
    calc.operandA = Math.floor(Math.random() * 21);
    calc.operandB = Math.floor(Math.random() * 11);
    calc.result = calc.operandA + calc.operandB; //TODO: parse or fix and use the actual operand, worst case use a switch statement

    while (existingCalculations.filter(calculation => (calculation.result === calc.result)).length > 0 ) {
        //TODO: make a breaker to abort if we take too long to resolve all collisions
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



function generateInsertableSquare(idxNumber) {
    //Todo: make sure we have all Idx, not Id !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var item = document.createElement("div");
    item.innerHTML = "?"; //Or if you want visible numbers for debugging, use idxNumber;
    item.innerHTML = "? (Debug: idx " + idxNumber + ", pair on idx " + tiles[idxNumber].linkedTileId + ")";
    item.id = idxNumber;
    item.className = "grid-item";
    item.style.fontSize = "15px";

    item.style.backgroundColor = ("rgb(0, 0, " + (idxNumber*10 + 50) + ")" );
    item.style.color = "lightgrey"; //Font color on tiles

    // https://stackoverflow.com/questions/4631975/detecting-mouse-click-on-div-with-javascript-without-side-effects
    // https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
    // item.onclick... would it be the same?
    // item.onclick = "move(id)";
    item.onclick = function(event) {
        console.log(event);
        console.log(event.path[0].id);

        var idOnEvent = event.path[0].id;
        var idxFromEvent = idOnEvent;
        flipTile(idxFromEvent);
    }

    // Touch device support:::--->
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events
    // remember, prevent default because often browsers also emulate mouseclicks 

    // Touch events, just using touchstart, will detect several fingers at once and fire one event per finger
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

      var idOnEvent = ev.targetTouches[0].target.id
      var idxFromEvent = idOnEvent;
      flipTile(idxFromEvent);

      // Set call preventDefault()
      ev.preventDefault();
    }
  
    return item;
}

function flipTile(idx) {
    var currentTileIdx = idx;
    var currentTile = document.getElementById(currentTileIdx);
    var linkedTileIdx = tiles[currentTileIdx].linkedTileId;

    var oldestTile = document.getElementById(oldestTileIdx);
    var newestTile = document.getElementById(newestTileIdx);

    if (tiles[currentTileIdx].isUsed) {
        debug("BEFORE: TileIdx/isFlipped " + currentTileIdx + "/" + tiles[currentTileIdx].isFlipped + ", relatedIdx/isFlipped " + linkedTileIdx + "/" + tiles[linkedTileIdx].isFlipped);
        debug("BEFORE: OldestIdx: " + oldestTileIdx + ", newestIdx: " + newestTileIdx + ", currentIdx: " + currentTileIdx)
    } else {
        debug("BEFORE: TileIdx/isFlipped " + currentTileIdx + "/" + tiles[currentTileIdx].isFlipped + ", no related tile since it's a blank bonus tile");
        debug("BEFORE: OldestIdx: " + oldestTileIdx + ", newestIdx: " + newestTileIdx + ", currentIdx: " + currentTileIdx)
    }


    //https://medium.com/poka-techblog/simplify-your-javascript-use-map-reduce-and-filter-bd02c593cc2d
    var numFlippedNotFound = tiles.filter(aTile => (aTile.isFlipped && !aTile.isFound) ).length;
    console.log("Face up unpaired tiles before turning this tile: " + numFlippedNotFound)
 

    /* 
     *    Prepare autoflipping tiles 
     */

    //no autoclose
    if (autoCloseMode === no) {
        //autoClose is not selected, so do nothing, let the regular game logic handle the click
    }

    //Do not turn face up tile to face down if they are allready found and locked
    else if (tiles[currentTileIdx].isFlipped && tiles[currentTileIdx].isFound) {
        //pass
    }
    //Turn face up tile to face down when clicked and not allready found
    else if (tiles[currentTileIdx].isFlipped && !tiles[currentTileIdx].isFound) {
        //tile was face up, and not allready found/paired, so player is trying to hide it
        //note, if it was a bonus tile or a pair, it would allready be set to found in last click event

        //TODO: looke at the logic here, double if, not if/else, and also how do this get affected by -1 etc
        if (currentTileIdx === newestTileIdx) {
            //if it is the (previously) newest tile we flipped, replace newest tile with oldest tile but also keep oldest as oldest
            newestTileIdx = oldestTileIdx;
        }
        if (currentTileIdx === oldestTileIdx) {
            //if it is the (previously) oldest tile we flipped, replace oldest tile with newest, but also keep newest as newest
            oldestTileIdx = newestTileIdx;
        }
    }
    /* 
     * with two tiles face up, we need to honor the autoClose choise
     */
    //Force flip oldest face up tile to face down
    else if (autoCloseMode === "oldest" && numFlippedNotFound === 2) {
        oldestTile.style.backgroundColor = ("rgb(0, 0, " + (oldestTileIdx*10 + 50) + ")" ); //Make original shade of color
        // oldestTile.innerHTML = "?";
        oldestTile.innerHTML = "? (Debug: idx " + oldestTileIdx + ", pair on idx " + tiles[oldestTileIdx].linkedTileId + ")";
        tiles[oldestTileIdx].isFlipped = false;          
        oldestTileIdx = newestTileIdx;
        // Update newest, unless current tile is a bonus tile
        if (tiles[currentTileIdx].linkedTileId !== -1) {
            newestTileIdx = currentTileIdx;
        }
        numFlippedNotFound = 1;
    }
    //Force flip newest face up tile to face down
    else if (autoCloseMode === "newest" && numFlippedNotFound === 2) {
        newestTile.style.backgroundColor = ("rgb(0, 0, " + (newestTileIdx*10 + 50) + ")" ); //Make original shade of color
        // newestTile.innerHTML = "?";
        newestTile.innerHTML = "? (Debug: idx " + newestTileIdx + ", pair on idx " + tiles[newestTileIdx].linkedTileId + ")";
        tiles[newestTileIdx].isFlipped = false;
        // Update newest, unless current tile is a bonus tile
        if (tiles[currentTileIdx].linkedTileId !== -1) {
            newestTileIdx = currentTileIdx;
        }
        numFlippedNotFound = 1;
    }
    //Force flip both face up tiles to face down
    else if (autoCloseMode === "both" && numFlippedNotFound === 2) {
        oldestTile.style.backgroundColor = ("rgb(0, 0, " + (oldestTileIdx*10 + 50) + ")" ); //Make original shade of color
        // oldestTile.innerHTML = "?";
        oldestTile.innerHTML = "? (Debug: idx " + oldestTileIdx + ", pair on idx " + tiles[oldestTileIdx].linkedTileId + ")";
        tiles[oldestTileIdx].isFlipped = false;          

        newestTile.style.backgroundColor = ("rgb(0, 0, " + (newestTileIdx*10 + 50) + ")" ); //Make original shade of color
        // newestTile.innerHTML = "?";
        newestTile.innerHTML = "? (Debug: idx " + newestTileIdx + ", pair on idx " + tiles[newestTileIdx].linkedTileId + ")";
        tiles[newestTileIdx].isFlipped = false;          

        oldestTileIdx = currentTileIdx;
        newestTileIdx = currentTileIdx;
        numFlippedNotFound = 0;
    }
    //0 or 1 tiles allready flipped, so just update oldest and newest
    else {
        oldestTileIdx = newestTileIdx;

        // Update newest, unless current tile is a bonus tile
        if (tiles[currentTileIdx].linkedTileId !== -1) {
            newestTileIdx = currentTileIdx;
        }
    }



    /* 
     *    Game logic for flipped tiles 
     */

    
    //Handle face up tiles
    if (tiles[currentTileIdx].isFlipped) {
        if (tiles[currentTileIdx].isFound) {
            console.log("This tile was allready found, so ignoring the click...")
        } else {
            console.log("was flipped so turning face down")
            currentTile.style.backgroundColor = ("rgb(0, 0, " + (currentTileIdx*10 + 50) + ")" ); //Make original shade of color
            currentTile.innerHTML = "?"; //or if you want tile id for debugging, use tile.id
            tiles[currentTileIdx].isFlipped = false;  
        }
    }

    //Handle face down tile
    else {
        //Not allowed to turn tiles if 2 allready turned
        if (numFlippedNotFound >= 2) {
            console.log("ignoring click and returning, player can't flip more than two unpaired cards at the same time!")
        } 

        //Handle turning the blank tile
        else if (tiles[currentTileIdx].isUsed === false) { //TODO: refactor this, either call it bonus, or blank, and also rewrite the checks above that checks related !== -1 to use this check or smtn
            console.log("found blank tile, so lock it face up");
            tiles[currentTileIdx].isFound = true;
            tiles[currentTileIdx].isFlipped = true;
            currentTile.innerHTML = tiles[currentTileIdx].text + " BONUS<BR>:D ";
            currentTile.style.backgroundColor = ("rgb(0, " + (currentTileIdx * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade

            numMoves++
        }

        //Handle finding pair
        else if ( tiles[linkedTileIdx].isFlipped ) { // inconcistent that linked tileid is zero based/index based!
            console.log("found matching tiles, so locking both face up");
            tiles[currentTileIdx].isFound = true;
            tiles[currentTileIdx].isFlipped = true;
            currentTile.innerHTML = tiles[currentTileIdx].text;
            currentTile.style.backgroundColor = ("rgb(0, " + (currentTileIdx * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade

            tiles[linkedTileIdx].isFound = true;
            //above is allready flipped and showing text, so skip that
            var tileLinked = document.getElementById(tiles[linkedTileIdx].id); 
            tileLinked.style.backgroundColor = ("rgb(0, " + (tileLinked.id * 10 + 50) + ", 0)" ); //Make greenish in same nuance as original shade
            
            numMoves++
        }
        //Handle turning "wrong" tile, not pair
        else {
            console.log("found no matching tile flipped when flipping this, and wasn't a bonus tile")
            currentTile.style.backgroundColor = ("rgb(" + (currentTileIdx * 10 + 50) + ", 0 , 0)" ); //Make redish in same nuance as original shade
            currentTile.innerHTML = tiles[currentTileIdx].text;
            tiles[currentTileIdx].isFlipped = true;         
            
            numMoves++
        }

    }
   
    // Update score
    document.getElementById("currentgameinfo").innerHTML = "Moves used: " + numMoves + ", best score: " + bestScore;

    // Handle game over
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

            // defer the execution of anonymous function and go directly to next block of code.
            setTimeout(function(){ 
                startGame();
                numMoves = 0;
                setupGameBoard(); //TODO: We will add num rounds as part of setup, and then we need to go to setup game after x rounds, and we probably want a better game over screen also
                gameIsRestarting = false;                
                console.log("restart of game complete")
            }, 3500);

            console.log("restarting game set up as deferred for 5 seconds")
        }    
    }

    debug("AFTER : OldestIdx: " + oldestTileIdx + ", newestIdx: " + newestTileIdx + ", currentIdx: " + currentTileIdx)
    debug("****************************************");
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