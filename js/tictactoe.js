let activePlayer = "X";  //keep track of who's turn
let selectedSquares = [];   //store an array of moves to determine win conditions

function placeXOrO(squareNumber){     //functino for placing X or O in square
    //this condition ensures a square hasn't been selected already
    //the .some() methos is used to check each elemenet of selectedSquare arrary
    //to see if it contains the square number clicked on.
    if (!selectedSquares.some(element => element.includes(squareNumber))) {
        let select = document.getElementById(squareNumber); //retreive ID that was clicked
        if (activePlayer === "X") {     //check who's turn
            select.style.backgroundImage = 'url("images/x.jpg")';
        } else {
            select.style.backgroundImage = 'url("images/o.png")';
        }
        selectedSquares.push(squareNumber + activePlayer);  //concatenate # and player and add to array
        checkWinconditions();   //check for winner
        if (activePlayer === "X") { //change the active player
            activePlayer = "O";
        } else {
            activePlayer = "X";
        }

        audio('./media/click.mp3'); //play placement sound
        if (activePlayer === 'O') {     //check to see if computer's turn
            disableClick();     //don't let user click when computer's turn
            setTimeout(function () { computersTurn();},1000)    //wait 1 second before computer places image and enables click
        }
        return true;    //Returning true is needed for computersTurn() function to work
    }

    function computersTurn() {  //results in random square selection
        let success = false;    //this boolean is needed for our while loop
        let pickASquare;    //this variable stores random # 0-8
        while (!success) {  //allows while loop to keep trying if a square is selected already
            pickASquare = String(Math.floor(Math.random() * 9));    //random # 0-8 selected
            if (placeXOrO(pickASquare)) {   //if random # evaluated returns true, square hasn't been selected yet
                placeXOrO(pickASquare);     //this calls the function
                success = true;     //this changes the boolean and ends the loop
            };
        }
    }
}

function checkWinconditions() { //check for winner and draw a line
    if     (arrayIncludes('0X','1X','2X')) { drawWinLine(50, 100, 558, 100) }
    else if(arrayIncludes('3X','4X','5X')) { drawWinLine(50, 304, 558, 304) }
    else if(arrayIncludes('6X','7X','8X')) { drawWinLine(50, 508, 558, 508) }
    else if(arrayIncludes('0X','3X','6X')) { drawWinLine(100, 50, 100, 558) }
    else if(arrayIncludes('1X','4X','7X')) { drawWinLine(304, 50, 304, 558) }
    else if(arrayIncludes('2X','5X','8X')) { drawWinLine(508, 50, 508, 558) }
    else if(arrayIncludes('6X','4X','2X')) { drawWinLine(100, 508, 510, 90) }
    else if(arrayIncludes('0X','4X','8X')) { drawWinLine(100, 100, 520, 520) }
    else if(arrayIncludes('0O','1O','2O')) { drawWinLine(50, 100, 558, 100) }
    else if(arrayIncludes('3O','4O','5O')) { drawWinLine(50, 304, 558, 304) }
    else if(arrayIncludes('6O','7O','8O')) { drawWinLine(50, 508, 558, 508) }
    else if(arrayIncludes('0O','3O','6O')) { drawWinLine(100, 50, 100, 558) }
    else if(arrayIncludes('1O','4O','7O')) { drawWinLine(304, 50, 304, 558) }
    else if(arrayIncludes('2O','5O','8O')) { drawWinLine(508, 50, 508, 558) }
    else if(arrayIncludes('6O','4O','2O')) { drawWinLine(100, 508, 510, 90) }
    else if(arrayIncludes('0O','4O','8O')) { drawWinLine(100, 100, 520, 520) }
    else if(selectedSquares.length >= 9){    //check for a tie if all boxes are full
        audio('./media/sift.mp3');
        setTimeout(function () { resetGame(); }, 1000); //set a 1 second timer before resetGame is called
    }

    function arrayIncludes(squareA, squareB, squareC) {     //check if an array includes 3 strings to check ofr each win condition
        const a = selectedSquares.includes(squareA)        
        const b = selectedSquares.includes(squareB) 
        const c = selectedSquares.includes(squareC)
        //if the 3 variables we pass are all included in our array, true is returned
        //and our elseif condition executes the drawWinLine function
        if(a===true && b===true && c===true) {return true}
    }
}

function disableClick() {       //make our body element temporarily unclickable
    body.style.pointerEvents = 'none';
    setTimeout(function () {        //make background clickable again after 1 second
        body.style.pointerEvents = 'auto';}, 1000);
}

//take a string parameter of the path set earlier for placement sound
function audio(audioURL) {
    let audio = new Audio(audioURL);    //create new audio object and pass the path as parameter
    audio.play()    //plays the audio
}

function drawWinLine(coordX1, coordY1, coordX2, coordY2) {  //use html canvas to draw lines
    const canvas = document.getElementById('win-lines')     //access html canvas element
    const c = canvas.getContext('2d');      //gives access to methods and properties to use on canvas
    let x1 = coordX1,       //start end ending x and y coordinates
        y1 = coordY1,
        x2 = coordX2,
        y2 = coordY2,
        x = x1,         //temporary stores axis data we update in animation loop
        y = y1;
    
    function animateLineDrawing() {     //this function interacts with the canvas
        const animationLoop = requestAnimationFrame(animateLineDrawing);    //the variable creates a loop
        c.clearRect(0, 0, 608, 608)    //clear content from the last loop iteration
        c.beginPath();      //start a new path
        c.moveTo(x1, y1)     //moves to starting point for the line
        c.lineTo(x, y)       //indicates end point for the line
        c.lineWidth = 10;
        c.strokeStyle = 'rgba(70,255,33,.8)';
        c.stroke();     //this draws everything we defined above
        if (x1 <= x2 && y1 <= y2) {     //check if we reached the endpoint
            if (x < x2) { x += 10; }    //increment x and y by 10
            if (y < y2) { y += 10; }
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }    //this condition cancels loop if we reached endpoints
        }
        //Similar to condition above, but needed for 6,4,2 win condition
        if (x1 <= x2 && y1 >= y2) {     
            if (x < x2) { x += 10; }   
            if (y < y2) { y -= 10; }
            if (x >= x2 && y <= y2) { cancelAnimationFrame(animationLoop); }    
        }
    }

    function clear() {      //this functino clears canvas after win line is drawn
        const animationLoop = requestAnimationFrame(clear); //this starts animation loop
        c.clearRect(0, 0, 608, 608);   //this clears canvas
        cancelAnimationFrame(animationLoop);    //this stops animation loop
    }
    disableClick();     //this disallows clicking while win sound is playing
    audio('./media/bell.mp3');
    animateLineDrawing();   //calls main animation loop
    setTimeout(function () { clear(); resetGame(); }, 1000);    //waits 1 second, clears canvas, resets game, allows clicking again
}

function resetGame() {      //resets game upon win or tie
    for (let i = 0; i < 9; i++){    //iterates through each HTML square element
        let square = document.getElementById(String(i)) //retreives html element of i
        square.style.backgroundImage='' //removes elements background image
    }
    selectedSquares = [];   //resets array so it's empty and we can start over
}