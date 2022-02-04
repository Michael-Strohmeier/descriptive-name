/*
there are a few bugs that I don't feel like fixing
*/

let table;
let translateIcon;

let slider;

let questionHandler;

function range(start, end) {
	// https://www.codegrepper.com/code-examples/javascript/javascript+create+list+of+numbers+1+to+n
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function shuffleArray(array) {
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (var i = array.length - 1; i > 0; i--) {
	  var j = Math.floor(Math.random() * (i + 1));
	  var temp = array[i];
	  array[i] = array[j];
	  array[j] = temp;
  }
}

function preload() {
  // table = loadTable("assets/data.csv", "csv", "header");
	table = loadTable("assets/temp.csv", "csv", "header");

	// translateIcon = loadImage('assets/translate-icon.svg');

	// https://okoneya.jp/font/download.html
	customFont = loadFont('assets/GenEiLateGoN_v2.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

  slider = createSlider(1, 5, 1);
  slider.position(20, 20);

	questionHandler = new QuestionHandler();
}

function draw() {
	background(240, 235, 220, 255);

  push();
	translate(0, -100);
	questionHandler.draw();
  pop();

  push();
  fill(0);
  text(slider.value(), slider.x * 2 + slider.width, 35);
  pop();

  questionHandler.changeLevel();
	// image(translateIcon, 100, 500, 100, 100);

}

function mouseClicked() {
  //questionHandler.changeLevel();

  // awful thing im doing here...
  // update the card only if below the slider. this is probably the worst
  // way to do this.
  if (mouseY > 80) {
    questionHandler.update();
  }


}

function keyPressed() {
  if (keyCode == 70) {
    questionHandler.flipCard();
  } else if (keyCode == 67) {
		questionHandler.printWord();
	} else {
		questionHandler.update();
	}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


class QuestionHandler {
	constructor() {
		this.en = "";
		this.jp = "";
		this.kana = "";

		this.currIndex;
		this.answerVisible;

    this.level = slider.value().toString();
    this.cards = this.filterTable(this.level);

		this.flip = false;

    this.nums = range(0, this.cards.length - 1);
		shuffleArray(this.nums);
		this.reset();

		this.updateWord();
	}

  filterTable(level) {
    let temp = [];
    for (var i = 0; i < table.getRowCount(); i++) {
      if (table.getNum(i, "wani_kani_level") == level) {
        let kanji = table.getColumn("kanji")[i];
        let hiragana = table.getColumn("hiragana")[i];
        let english = table.getColumn("english")[i];

        temp.push([kanji, hiragana, english]);
      }
    }
    return temp;
  }

	flipCard() {

		if (this.flip) {
			this.flip = false;
		} else {
			this.flip = true;
		}
	}

  changeLevel() {
    if (this.level != slider.value().toString()) {
      this.reset();
      console.log(slider.value());
      this.updateWord();
    }
  }

	reset() {
    this.level = slider.value().toString();

    this.cards = this.filterTable(this.level);

    this.nums = range(0, this.cards.length - 1);
		shuffleArray(this.nums);

		this.currIndex = 0;
		this.answerVisible = false;
	}

	updateWord() {
		let n = this.nums[this.currIndex];

		this.en = this.cards[n][2];
		this.jp = this.cards[n][0];
		this.kana = this.cards[n][1];

		console.log(this.currIndex + 1 + " / " + this.nums.length);
	}

	printWord() {
		console.log(this.jp);
	}

	update() {
		if (this.currIndex >= this.nums.length) {
			this.reset();
			this.updateWord();
			return;
		}

		if (this.answerVisible) {
			this.updateWord();
			this.answerVisible = false;

		} else {
			this.answerVisible = true;
			this.currIndex += 1;


		}
	}

	draw() {
		let top;
		let middle;
		let bottom;
		if (!this.flip) {
			top = this.en;
			middle = this.jp;
			bottom = this.kana;
		} else {
			top = this.jp;
			middle = this.en;
			bottom = this.kana;
		}

		textFont(customFont);

		textSize(80);
		textAlign(CENTER, CENTER);
		text(top, windowWidth / 2, windowHeight / 2);

		if (this.answerVisible) {
			textSize(70);
			text(middle, windowWidth / 2, windowHeight / 2 + 200);
			textSize(40);
			text(bottom, windowWidth / 2, windowHeight / 2 + 300);
		}

    push();
    translate(0, 100);
    textSize(12);
    // the index changes early. this is a flaw from how im updating the current index (currIndex)
    // might fix later
    text(this.currIndex + 1 + " / " + this.nums.length, windowWidth - 30, 20);
    pop();

	}

}
