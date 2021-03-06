window.addEventListener('DOMContentLoaded', function () {

	const toolbarPenButt = document.getElementById("toolbarPenButt");
	const toolbarCircleButt = document.getElementById("toolbarCircleButt");
	const toolbarSqaureButt = document.getElementById("toolbarSqaureButt");
	const toolbarEeaserButt = document.getElementById("toolbarEeaserButt");
	const filegetButt = document.getElementById("filegetButt");
	const fileInput = document.getElementById('imageInput');
	const rColor = document.getElementById('rColor');
	const gColor = document.getElementById('gColor');
	const bColor = document.getElementById('bColor');
	const fileSaveButt = document.getElementById('fileSaveButt');
	const promptVar = {
		do: (message) => {
			let prompt = document.getElementById('prompt');
			let promptMessage = document.getElementById('promptMessage');
			prompt.style.zIndex = 999;
			prompt.style.opacity = 1;
			promptMessage.innerHTML = message;
			setTimeout(()=>{prompt.style.opacity = 0;prompt.style.zIndex = -999;}, 2000);
		}
	};

	var drawingPadVar = {
		canvas : document.getElementById("drawingPadCanvas")
	}
	drawingPadVar.offsetH =  drawingPadVar.canvas.offsetLeft;
	drawingPadVar.offsetV = drawingPadVar.canvas.offsetTop;
	drawingPadVar.context = drawingPadVar.canvas.getContext('2d');
	drawingPadVar.height = drawingPadVar.canvas.height;
	drawingPadVar.width = drawingPadVar.canvas.width;


	var drawingPad = {
		touching: false,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		preX: 0,
		preY: 0,
		savedImage: null,
		penMode: true,
		circleMode: false,
		squareMode: false,
		eraseMode: false,
		lineWidth: 0,
		preLineWidth: 0,
		forwardX: true,
		forwardY: true,
		preforwardX: null,
		preforwardY: null,
		changeDirect: false,
		touchstartEvent: (event) => {
			drawingPad.touching = true;
			let ctx = drawingPadVar.context;
			let width = drawingPadVar.width;
			let height = drawingPadVar.height;

			drawingPad.savedImage = ctx.getImageData(0, 0, width, height);
			drawingPad.startX = event.pageX - drawingPadVar.offsetH ||  event.touches[0].pageX-drawingPadVar.offsetH;
			drawingPad.startY = event.pageY - drawingPadVar.offsetV || event.touches[0].pageY-drawingPadVar.offsetV;
			drawingPad.preX = event.pageX - drawingPadVar.offsetH || event.touches[0].pageX-drawingPadVar.offsetH;
			drawingPad.preY = event.pageY - drawingPadVar.offsetV || event.touches[0].pageY-drawingPadVar.offsetV;
			drawingPad.preLineWidth = 0;

			console.log(">>>");
		},
		touchmoveEvent: (event) => {

			if(drawingPad.touching){
				event.preventDefault();
				let startX = drawingPad.startX;
				let startY = drawingPad.startY;
				let curX = event.pageX - drawingPadVar.offsetH || event.touches[0].pageX-drawingPadVar.offsetH;
				let curY = event.pageY - drawingPadVar.offsetV || event.touches[0].pageY-drawingPadVar.offsetV;
				let width = drawingPadVar.width;
				let height = drawingPadVar.height;
				let ctx = drawingPadVar.context;
				let diffX = Math.abs(curX - startX);
				let diffY = Math.abs(curY- startY);
				let preX = drawingPad.preX;
				let preY = drawingPad.preY;
				let lineWidth;
				if (preX - curX > 0) {drawingPad.forwardX = true;} else if (preX - curX < 0)  {drawingPad.forwardX = false;} 
				if (preY - curY > 0) {drawingPad.forwardY = true;} else if (preX - curX < 0)  {drawingPad.forwardY = false;}

				if((drawingPad.preforwardX !== null && drawingPad.forwardX !== drawingPad.preforwardX) ||
					(drawingPad.preforwardY !== null && (drawingPad.forwardY !== drawingPad.preforwardY))){
					drawingPad.changeDirect = !drawingPad.changeDirect;
					console.log("fire");
				}

				if(drawingPad.changeDirect){
					if(drawingPad.preLineWidth > 2){
						lineWidth = drawingPad.preLineWidth - 0.4;
					} else if(drawingPad.preLineWidth < 2){
						lineWidth = drawingPad.preLineWidth + 0.4;
					} else {
						lineWidth = drawingPad.preLineWidth;
					}
				} else {
					lineWidth = drawingPad.preLineWidth < 6? drawingPad.preLineWidth + 0.4 : drawingPad.preLineWidth;
				}
				let preLineWidth = drawingPad.preLineWidth;
				
				drawCircle.render(drawingPad.circleMode, ctx, drawingPad.savedImage, startX, startY, diffX, diffY, width, height);
				drawSquare.render(drawingPad.squareMode, ctx, drawingPad.savedImage, startX, startY, diffX, diffY, width, height);
				drawLine.do(drawingPad.penMode, ctx, curX, curY, preX, preY, lineWidth, preLineWidth);
				eraseLine.do(drawingPad.eraseMode, ctx, curX, curY, preX, preY);

				drawingPad.preX = curX;
				drawingPad.preY = curY;
				drawingPad.preLineWidth = lineWidth;
				drawingPad.preforwardX = drawingPad.forwardX;
				drawingPad.preforwardY = drawingPad.forwardY;
				//console.log("---",  curY, preY);
			}
		},
		touchendEvent: (event) => {
			drawingPad.touching = false;
			let ctx = drawingPadVar.context;
			let startX = drawingPad.startX;
			let startY = drawingPad.startY;
			let preX = drawingPad.preX;
			let preY = drawingPad.preY;
			let diffX = Math.abs(preX - startX);
			let diffY = Math.abs(preY-startY);
			let lineWidth = drawingPad.preLineWidth;
			

			drawLine.end(drawingPad.penMode, ctx, preX, preY, lineWidth);
			drawCircle.do(drawingPad.circleMode, ctx, startX, startY, diffX, diffY);
			drawSquare.do(drawingPad.squareMode, ctx, startX, startY, diffX, diffY);

			console.log("<<<");
		},
		switchMode: (e) => {
			let ele = e.currentTarget;
			let siblingEles = ele.parentElement.children;

			if(ele.classList.contains("on")){
				ele.classList.remove("on");
			} else {
				for(let siblingEle of siblingEles){
					siblingEle.classList.remove("on");
				}

				drawingPad.penMode = false;
				drawingPad.circleMode = false;
				drawingPad.squareMode = false;
				drawingPad.eraseMode = false;

				ele.classList.add("on");
			}

			switch(ele.id){
				case "toolbarPenButt":
					drawingPad.penMode = !drawingPad.penMode;
					var modeMessage = drawingPad.penMode? "On" : "Off";
					promptVar.do("Pen: " + modeMessage);
					break;
				case "toolbarCircleButt":
					drawingPad.circleMode = !drawingPad.circleMode;
					var modeMessage = drawingPad.circleMode? "On" : "Off";
					promptVar.do("Circle: " + modeMessage);
					break;
				case "toolbarSqaureButt":
					drawingPad.squareMode = !drawingPad.squareMode;
					var modeMessage = drawingPad.squareMode? "On" : "Off";
					promptVar.do("Square: " + modeMessage);
					break;
				case "toolbarEeaserButt":
					drawingPad.eraseMode = !drawingPad.eraseMode;
					var modeMessage = drawingPad.eraseMode? "On" : "Off";
					promptVar.do("Eraser: " + modeMessage);
					break;
			}
		},
		importImgButt: (e) => {
			let ele = e.currentTarget;
			let inputEle = ele.parentElement.children[0];
			inputEle.click();
		},
		importImg: (e) => {
			let fileImage = new Image();
			let ctx = drawingPadVar.context;

			fileImage.onload = function() {
				let width, height = 0;
				if(fileImage.width < fileImage.height){
					zoom = 300 / fileImage.width;
					width = 300;
					height = fileImage.height * zoom;
				} else {
					zoom = 300 / fileImage.height;
					height = 300;
					width = fileImage.width * zoom;
				}
			    ctx.drawImage(fileImage, 0,0, width, height);
			}

			fileImage.src = URL.createObjectURL(e.target.files[0]);
			
		},
		changeRGB: async (e) => {
			let ele = e.currentTarget;
			let ctx = drawingPadVar.context;
			let width = drawingPadVar.width;
			let height = drawingPadVar.height;
			let showValue = ele.value - 100 > 0? "+" + String(ele.value - 100) : ele.value - 100; 
			
			switch(ele.id){
				case "rColor":
					promptVar.do("R: " + showValue + "%");
					await changedColor.do(ctx, "r", ele.value, width, height);
					break;
				case "gColor":
					promptVar.do("G: " + showValue + "%");
					await changedColor.do(ctx, "g", ele.value, width, height);
					break;
				case "bColor":
					promptVar.do("B: " + showValue + "%");
					await changedColor.do(ctx, "b", ele.value, width, height);
					break;
			}

			ele.value = 100;

		},
		exportImage: (e) => {
			let canvas = drawingPadVar.canvas;
			let imageDataUrl = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");

			e.currentTarget.href = imageDataUrl;
		},
		init: () => {

			let ctx = drawingPadVar.context;
			let width = drawingPadVar.width;
			let height = drawingPadVar.height;

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, width, height);

			toolbarPenButt.addEventListener("click", drawingPad.switchMode);
			toolbarCircleButt.addEventListener("click", drawingPad.switchMode);
			toolbarSqaureButt.addEventListener("click", drawingPad.switchMode);
			toolbarEeaserButt.addEventListener("click", drawingPad.switchMode);

			filegetButt.addEventListener("click", drawingPad.importImgButt);
			fileInput.addEventListener("change", drawingPad.importImg);

			rColor.addEventListener("change", drawingPad.changeRGB);
			gColor.addEventListener("change", drawingPad.changeRGB);
			bColor.addEventListener("change", drawingPad.changeRGB);

			fileSaveButt.addEventListener("click", drawingPad.exportImage);

			drawingPadVar.canvas.addEventListener("touchstart", drawingPad.touchstartEvent);
			drawingPadVar.canvas.addEventListener("touchmove", drawingPad.touchmoveEvent);
			drawingPadVar.canvas.addEventListener("mouseup", drawingPad.touchendEvent);

			drawingPadVar.canvas.addEventListener("mousedown", drawingPad.touchstartEvent);
			drawingPadVar.canvas.addEventListener("mousemove", drawingPad.touchmoveEvent);
			drawingPadVar.canvas.addEventListener("touchend", drawingPad.touchendEvent);
			

		}
	};

	drawingPad.init();
});

