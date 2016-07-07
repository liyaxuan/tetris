var Shape = require('./shape.js');
var Grid = require('./grid.js');
var Paint = require('./paint.js');
var canvas_config = require('./canvas-config.js');

var grid_row = canvas_config.main_height/canvas_config.block_width;
var grid_col = canvas_config.main_width/canvas_config.block_width;

function Game(ws) {
	this.grid = new Grid(grid_row, grid_col);

	this.currentShape = this.randomShape();
	this.nextShape = this.randomShape();
	
	this.timer = null;
	this.score = 0;

	this.painters = [
		new Paint(document.querySelector('.main-1').getContext('2d'), {
			canvas_width: canvas_config.main_width,
			canvas_height: canvas_config.main_height,
			block_width: canvas_config.block_width
		}),
		new Paint(document.querySelector('.next-1').getContext('2d'), {
			canvas_width: canvas_config.next_width,
			canvas_height: canvas_config.next_height,
			block_width: canvas_config.block_width
		})
	];

	this.ws = ws;
}

Game.prototype.randomShape = function () {
	var rn1 = Math.floor(Math.random()*Shape.types.length);
	var rt = Shape.types[rn1];
	var rn2 = Math.floor(Math.random()*Shape.colors.length);
	var rc = Shape.colors[rn2];

	var shape = new Shape(rt, rc);

	var x = Math.floor((this.grid.getCol() - shape.getCol())/2);
	shape.initXPosition(x);

	return shape;
}

Game.prototype.next = function () {
	this.currentShape = this.nextShape;
	this.nextShape = this.randomShape();
};

Game.prototype.ctrl = function (keyCode) {
	var xRange = this.grid.getCol();

	if(keyCode == 37 || keyCode == 39 || keyCode == 40)
		this.currentShape.move(keyCode - 37, xRange);
	else if(keyCode == 38)
		this.currentShape.rotate();

	if(this.grid.check(this.currentShape))
		this.grid.update(this.currentShape);
	else {
		this.currentShape.goBack(keyCode);

		if(keyCode == 40) {					
			if(this.isEnd())
				this.end();					
			else {
				var clearedLines = this.clearLines();
				while(clearedLines != 0)
					this.score += clearedLines--;

				this.grid.save();
				this.next();							
			}
		}
	}

	this.send('data');
	this.paint();
};

Game.prototype.fall = function () {
	this.ctrl(40);				
};

Game.prototype.isEnd = function () {
	var gtm = this.grid.tempMatrix;
	for(var i = 0; i < gtm[0].length; i++)
		if(gtm[this.grid.oy][i] == 1)
			return true;
	return false;
};

Game.prototype.clearLines = function () {
	var gtm = this.grid.tempMatrix;
	var clearLines = 0;

	for(var i = 0; i < gtm.length; i++) {
		var canClear = true;
		for(var j = 0; j < gtm[i].length; j++)
			canClear = canClear && gtm[i][j] == 1;
		if(canClear) {
			for(var j = 0; j < gtm[i].length; j++)
				gtm[i][j] = 0;
			clearLines++;
			for(var k = i; k > 0; k--)
				gtm[k] = gtm[k - 1];
		}
	}

	return clearLines;
};

Game.prototype.reset = function () {
	this.currentShape = this.randomShape();
	this.nextShape = this.randomShape();
	this.grid = new Grid(grid_row, grid_col);
	this.score = 0;
	clearInterval(this.timer);				
};

Game.prototype.run = function (exec) {
	if(exec) {
		var game = this;
		game.fall();
		game.timer = setInterval(function () {
			game.fall();
		}, 1000);		
	}
	else {
		this.send('run');
	}	
};

Game.prototype.pause = function (exec) {
	if(exec) {
		clearInterval(this.timer);		
	}
	else {
		this.send('pause');
	}
};

Game.prototype.end = function (exec) {
	if(exec) {
		clearInterval(this.timer);			
	}
	else {
		this.send('end');
	}
};

Game.prototype.send = function (type) {
	if(!this.ws)
		return;
	var score = this.score;
	switch (type) {
		case 'pause':
			this.ws.send(JSON.stringify({
				type: 'pause'
			}));
			break;
		case 'run':
			this.ws.send(JSON.stringify({
				type: 'run'
			}));
			break;
		case 'end':
			this.ws.send(JSON.stringify({
				type: 'end',
				body: score
			}));
			break;
		case 'data':	
			var gtm = this.grid.tempMatrix.slice(this.grid.oy);
			var score = this.score;

			this.ws.send(JSON.stringify({
				type: 'battle',
				body: {
					matrix: gtm,
					score: score
				}
			}));	
			break;
	}
};

Game.prototype.paint = function () {
	var oy = this.grid.oy;
	var mMatrix = this.grid.tempMatrix.slice(oy);
	var nMatrix = this.nextShape.matrix;
	var painters = this.painters;

	[mMatrix, nMatrix].forEach(function (matrix, index) {
		painters[index].paintMatrix(matrix);
	});

	document.querySelector('.score-1').innerHTML = this.score;				
};

module.exports = Game;