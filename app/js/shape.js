var newMatrix = require('./matrix.js').newMatrix;
var copyMatrix = require('./matrix.js').copyMatrix;
var printMatrix = require('./matrix.js').printMatrix;

/*形状类*/

function Shape(type, color) {
	switch (type) {
		case 'i':
			this.matrix = [[1], [1], [1], [1]];
			break;
		case 'j':
			this.matrix = [
				[0, 1],
				[0, 1],
				[1, 1]
			];
			break;
		case 'l':
			this.matrix = [
				[1, 0],
				[1, 0],
				[1, 1]
			];						
			break;
		case 'o':
			this.matrix = [
				[1, 1],
				[1, 1]
			];	
			break;
		case 's':
			this.matrix = [
				[0, 1, 1],
				[1, 1, 0]
			];
			break;
		case 'z':
			this.matrix = [
				[1, 1, 0],
				[0, 1, 1]
			];
			break;
		case 't':
			this.matrix = [
				[1, 1, 1],
				[0, 1, 0]
			];
			break;
	}

	this.color = color;
	this.lastMatrix = copyMatrix(this.matrix);

	this.y = -1*this.matrix.length;
	this.lastY = this.y;
}

Shape.types = ['i', 'j', 'l', 'o', 's', 'z', 't'];
Shape.colors = ['red', 'yellow', 'green', 'blue'];

Shape.prototype.initXPosition = function (x) {
	this.x = x;
	this.lastX = this.x;
}

Shape.prototype.getRow = function () {
	return this.matrix.length;
};

Shape.prototype.getCol = function () {
	return this.matrix[0].length;
};

Shape.prototype.rotate = function (flag) {
	this.lastMatrix = copyMatrix(this.matrix);
	var matrixRotated = [];
	
	var row = this.matrix.length;
	var col = this.matrix[0].length;
	var matrixRotated = newMatrix(col, row);

	for(var i = 0; i < row; i++)
		for(var j = 0; j < col; j++)
			if(flag == 1)
				matrixRotated[j][row - 1 - i] = this.matrix[i][j];
			else
				matrixRotated[col - 1 - j][i] = this.matrix[i][j];

	this.matrix = matrixRotated;
	return this.matrix;				
};

Shape.prototype.move = function (direction, xRange) {
	switch (direction) {
		case 0:
			this.lastX = this.x;
			this.x = (this.x - 1 + xRange)%xRange;
			break;
		case 2:
			this.lastX = this.x;
			this.x = (this.x + 1 + xRange)%xRange;
			break;
		case 3:
			this.lastY = this.y;
			this.y = this.y + 1;
			break;
	}
};

Shape.prototype.goBack = function (keyCode) {
	if(keyCode == 37 || keyCode == 39)
		this.x = this.lastX;
	else if(keyCode == 40)
		this.y = this.lastY;
	else if(keyCode == 38)
		this.matrix = copyMatrix(this.lastMatrix);			
};

module.exports = Shape;