var newMatrix = require('./matrix.js').newMatrix;
var copyMatrix = require('./matrix.js').copyMatrix;
var printMatrix = require('./matrix.js').printMatrix;

function Grid(row, col) {
	this.oy = 4;
	this.tempMatrix = newMatrix(this.oy + row, col);
	this.matrix = newMatrix(this.oy + row, col);
	this.row = this.oy + row;
	this.col = col;
}

Grid.prototype.getCol = function () {
	return this.col;
};

Grid.prototype.check = function (shape) {
	var gm = this.matrix;
	var sm = shape.matrix;

	var gc = this.col;

	var sx = shape.x;
	var sy = this.oy + shape.y;
	var sc = shape.getCol();
	var sr = shape.getRow();
	console.log(sy + sr - 1)
	console.log(this.row -1)	
	if(sy < 0 || sy + sr - 1 > this.row - 1) {

		console.log(new Date() + ' 垂直方向越界');
		return false;
	}

	for(var i = 0; i < sr; i++) {
		for(var j = 0; j < sc; j++) {
			/*cscn: current shape colunm numero*/
			if(gm[sy + i][(sx + j + gc)%gc] + sm[i][j] > 1) {
				console.log(new Date() + ' 重叠');
				return false;								
			}						
		}					
	}

	return true;
};

Grid.prototype.update = function (shape) {
	this.tempMatrix = copyMatrix(this.matrix);

	var gtm = this.tempMatrix;
	var sm = shape.matrix;

	var gc = this.col;

	var sx = shape.x;
	var sy = this.oy + shape.y;
	var sc = shape.getCol();
	var sr = shape.getRow();

	for(var i = 0; i < sr; i++)
		for(var j = 0; j < sc; j++)
			gtm[sy + i][(sx + j + gc)%gc] += sm[i][j];	
};

Grid.prototype.save = function () {
	this.matrix = copyMatrix(this.tempMatrix);				
};

module.exports = Grid;