/*CSE 154 HW8
  Zane Brant
  ID: 1065974
  Section AI
  5-27-2014
  Adds all of the puzzle functionality to the "fifteen" puzzle
  page. Intially, the pre-set image is displayed in the puzzle area,
  and the pieces aren't shuffled. If the user clicks "shuffle",
  the pieces will be randomly moved, scrambling the image. When
  the cursor is above a movable piece, it turns red, and clicking
  it will cause it to swap posistion with the empty space. The goal
  is to restore the image's intial arrangement.*/

(function() {
	"use strict";

	var emptyX = 300;
	var emptyY = 300;
	var PIECE_SIZE = 100;
	var BOARD_SIZE = 4;
	var backgrounds = ["blue.jpg", "grunge.jpg", "rainbow.jpg", "twilight.jpg", "spaces.jpg"];
	var currBackground = 0; 

	window.onload = function() {
		newBoard();
		document.getElementById("shufflebutton").onclick = shuffle;
		document.getElementById("puzzlepic").onchange = newBoard;
		document.getElementById("changebackground").onclick  = changeBackground;
	};


	//Sets the intial game board, unshuffled, with fifteen pieces
	function newBoard() {
		clearPuzzle();
		var selection = document.getElementById("puzzlepic");
		var background = selection[selection.selectedIndex].value;

		for (var i = 0; i < 15; i++) {
			//Sets the locations of the pieces intially 
			var x = (i - (Math.floor(i / BOARD_SIZE) * BOARD_SIZE)) * PIECE_SIZE; 
			var y = Math.floor(i / BOARD_SIZE) * PIECE_SIZE;
			var piece = document.createElement("div");
			piece.innerHTML = i + 1;
			//Sets the piece's background image (to reconstuct the unbroken image)
			piece.style.backgroundImage = "url('puzzlePics/" + background + "')";
			piece.style.backgroundPosition = -x + "px " + -y +"px";
			piece.style.left = x + "px";
			piece.style.top = y + "px";
			document.getElementById("puzzlearea").appendChild(piece);
			piece.onclick = movePiece; 
			piece.onmouseover = highlight;
		} 
	}
	
	//Cycles through pre-determined list of backgrounds, starting over when all have been shown	
	function changeBackground() {
		currBackground += 1; 
		var body = document.querySelector("body");
		body.style.backgroundImage = "url('bgs/" + backgrounds[currBackground] +  "')";
		if (currBackground > 2) {
			body.style.backgroundColor = "black";
		} else {
			body.style.backgroundColor = "white";
		}
		if (currBackground == 4) {
			currBackground = 0;
		}
	}

	//Removes any previous puzzle pieces when the user changes the puzzle picture
	function clearPuzzle() {
		var puzzleArea = document.getElementById("puzzlearea");
		while (puzzleArea.hasChildNodes()) {
    		puzzleArea.removeChild(puzzleArea.lastChild);
		}
		emptyX = 300;
	    emptyY = 300;
	}

	//When the mouse hovers over a piece, its text and border will turn red 
	//(be highlighted) and the cursor will become a hand icon, if the piece 
	//can be moved. It will return to normal when the mouse ceases to hover 
	//over it (see unhighlight).
	function highlight() {
		this.onmouseout = unhighlight;
		var x = parseInt(this.style.left);
		var y = parseInt(this.style.top);
		//checks if piece is movable
		if (isMovable(x, y)) {
			this.classList.add("highlight");
		}
	}

	//Returns a highlighted (red) piece to default appearence
	function unhighlight() {
		this.classList.remove("highlight");
	}

	//Swaps the clicked piece with the empty spot, if it's movable (see isMovable)
	function movePiece() {
		var x = parseInt(this.style.left);
		var y = parseInt(this.style.top); 
		if (isMovable(x, y)) {
			this.style.left = emptyX + "px";
			this.style.top = emptyY + "px";
			emptyX = x;
			emptyY = y;
		}
	}

	//Randomly and thoroughly shuffles the board by swapping
	//random pieces a set number of times
	function shuffle() {
		for (var i = 0; i < 1000; i++) {
			//Retrieves currently movable pieces
			var validPieces = findValid();
			//Selects random piece of the movable pieces
			var randPiece = validPieces[Math.floor(Math.random() * validPieces.length)];
			randPiece.click();
		}
	}

	//Finds all pieces which are currently movable (see isMovable)
	function findValid() {
		var pieces = document.querySelectorAll("#puzzlearea div");
		var validPieces = [];
		for (var i = 0; i < pieces.length; i++) {
			var x = parseInt(pieces[i].style.left);
			var y = parseInt(pieces[i].style.top);
			if (isMovable(x, y)) {
				validPieces.push(pieces[i]);
			}
		}
		return validPieces;
	}

	//Checks to see if a given piece is above, below, or next to (not diagnolly) 
	//the empty space, and if it's therefore movable
	function isMovable(x, y) {
		//Checks if given piece is on the left or right of empty space
		if ((x == emptyX - PIECE_SIZE || x == emptyX + PIECE_SIZE) && y == emptyY) {
			return true;
		//Checks if given piece is above or below the empty space
		} else if ((y == emptyY - PIECE_SIZE || y == emptyY + PIECE_SIZE) && x == emptyX) {
			return true;
		} 
		return false;
	}
})();