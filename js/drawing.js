var drawCircle = {
	do: (mode, ctx, x, y, rx, ry) => {
		if(mode){
			ctx.beginPath();
			ctx.ellipse(x, y, rx, ry, 0, 0, 2*Math.PI);
			ctx.stroke();
			ctx.closePath();
		}
	},
	render: (mode, ctx, curImage, x, y, rx, ry, w, h) => {
		if(mode){
			ctx.putImageData(curImage, 0, 0);
			ctx.beginPath();
			ctx.ellipse(x, y, rx, ry, 0, 0, 2*Math.PI);
			ctx.stroke();
			ctx.closePath();
		}
	}
};

var drawSquare = {
	do: (mode, ctx, x, y, rectH, rectW) => {
		if(mode){
			ctx.beginPath();
			ctx.rect(x, y, rectH, rectW);
			ctx.stroke();
			ctx.closePath();
		}
	},
	render: (mode, ctx, curImage, x, y, rectH, rectW, w, h) => {
		if(mode){
			ctx.putImageData(curImage, 0, 0);
			ctx.beginPath();
			ctx.rect(x, y, rectH, rectW);
			ctx.stroke();
			ctx.closePath();
		}
	}
};

var drawLine = {
	do: (mode, ctx, x, y, preX, preY) => {
		if(mode){
			ctx.beginPath();
			ctx.moveTo(preX, preY);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
		}
	}
};

var eraseLine = {
	do: (mode, ctx, x, y, preX, preY) => {
		if(mode){
			ctx.beginPath();
			ctx.moveTo(preX, preY);
			ctx.save();
			ctx.strokeStyle = "white";
			ctx.lineWidth = 5;
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	}
};

var changedColor = {
	do: (ctx, color, value, width, height) => {
		let imageData = ctx.getImageData(0, 0, width, height).data;
		let rgbData = [];
		for (var i = 0; i < imageData.length; i+=4) {
		    rgbData.push([imageData[i], imageData[i+1], imageData[i+2]]);
		}

		for(var i=0; i< height; i++){
			for(var j=0; j< width; j++){
				r = rgbData[i*width+j][0];
				g = rgbData[i*width+j][1];	
				b = rgbData[i*width+j][2];		
				if(color == "r"){
					r = rgbData[i*width+j][0] * value/ 100 > 255? 255: rgbData[i*width+j][0] * value/ 100;
				} else if (color == "g") {
					g = rgbData[i*width+j][1] * value/ 100 > 255? 255: rgbData[i*width+j][1] * value/ 100;
				} else if (color == "b"){
					b = rgbData[i*width+j][2] * value/ 100 > 255? 255: rgbData[i*width+j][2] * value/ 100 ;
				}
				ctx.fillStyle = "rgba("+r+","+g+","+b+", 1)"; 
				ctx.fillRect( j, i, 1, 1 );
			}
		}

	}
};

