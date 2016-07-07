/*关于二维矩阵的三个工具函数*/

function newMatrix(row, col) {
	return new Array(row).join(' ').split(' ').map(function () {
		return new Array(col).join(' ').split(' ').map(function () {
			return 0;
		});
	});
}

function copyMatrix(matrix) {
	var tempMatrix = newMatrix(matrix.length, matrix[0].length);
	matrix.forEach(function (item, i) {
		item.forEach(function (item, j) {
			tempMatrix[i][j] = matrix[i][j];
		});
	});

	return tempMatrix;
}

function printMatrix(matrix) {
	matrix.forEach(function (item, i) {
		var line = '';
		item.forEach(function (item, j) {
			line += item + ' ';
		});
		console.log(line);
	});
}

module.exports = {
	newMatrix: newMatrix,
	copyMatrix: copyMatrix,
	printMatrix: printMatrix
};