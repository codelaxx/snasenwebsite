setup();

function setup() {
    var parent = document.getElementById("gameboard");

    for (var i=1; i<9; i++) {
        var item = createSquare(i, true);
        parent.appendChild(item);
    }
    
    var item = createSquare(10, false);
    parent.appendChild(item);

}

function createSquare(idNumber, isMovable) {
    var item = document.createElement("div");
    item.innerHTML = idNumber;
    item.id = ("item_" +idNumber);
    item.className = "grid-item";

    if (isMovable) {
        item.style.backgroundColor = ("rgb(0, 0, " +idNumber*20 + ")" );
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

        move(event.path[0].id)
    }

    return item;
}

function move(id) {
    //TODO: move it
    // ie, check that it is adjacent to number 10, then
    // transition this to white
    // transition position of 10 to the color of this (based on rgb(0, 0, 20*itemnumber))
    // if order is 1...10, game won
    // bonus, make function for taking in pictures, adjusting/clipping, and transitioning

    debug(id);
};

function debug(output) {
    console.log(output);
    var parent = document.getElementById("debuglist");
    var listItem = document.createElement("li");
    listItem.innerHTML = output;
    parent.appendChild(listItem);
}

