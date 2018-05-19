var drawCircle = {
	do: (mode, ctx, x, y, r) => {
		if(mode){
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2*Math.PI)
			ctx.stroke();
		}
	},
	render: (mode, ctx, curImage, x, y, r, w, h) => {
		if(mode){
			ctx.putImageData(curImage, 0, 0);
			ctx.beginPath();
			ctx.arc(x, y, r, 0, 2*Math.PI)
			ctx.stroke();
		}
	}
};