/*绘图类, 用来绘制网格*/
function Paint(context, config) {
	this.context = context;
	this.config = config;
}

Paint.prototype.paintMatrix = function (matrix) {
	var context = this.context;
	var config = this.config;
	var bw = config.block_width;
	
	context.clearRect(0, 0, config.canvas_width, config.canvas_height);
	
	matrix.forEach(function (item, i) {
		item.forEach(function (item, j) {
			if(item == 1) {
				context.save();

				/*设置填充颜色和描边颜色*/
				context.fillStyle = '#1da1f2';
				context.strokeStyle = '#232323';
				/*新建路径*/
				context.beginPath();
				/*绘制路径*/
				context.rect(j*bw, i*bw, bw, bw);
				/*填充 + 描边*/
				context.fill();
				context.stroke();

				context.restore();							
			}
		});
	});
}

module.exports = Paint;