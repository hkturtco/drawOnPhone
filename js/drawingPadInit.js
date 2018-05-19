window.addEventListener('DOMContentLoaded', function () {

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
		savedImage: null,
		penMode: false,
		circleMode: false,
		squareMode: false,
		eraseMode: false,
		touchstartEvent: (event) => {
			drawingPad.touching = true;
			let ctx = drawingPadVar.context;
			let width = drawingPadVar.width;
			let height = drawingPadVar.height;

			drawingPad.savedImage = ctx.getImageData(0, 0, width, height);
			drawingPad.startX = event.touches[0].pageX-drawingPadVar.offsetH;
			drawingPad.startY = event.touches[0].pageY-drawingPadVar.offsetV;

			console.log(">>>");
		},
		touchmoveEvent: (event) => {
			let startX = drawingPad.startX;
			let startY = drawingPad.startY;
			let curX = event.touches[0].pageX-drawingPadVar.offsetH;
			let curY = event.touches[0].pageY-drawingPadVar.offsetV;
			let width = drawingPadVar.width;
			let height = drawingPadVar.height;
			let ctx = drawingPadVar.context;
			let diffX = Math.abs(curX - startX);
			let diffY = Math.abs(curY- startY);
			let r = diffX > diffY ? diffX : diffY;

			drawingPad.endX = curX;
			drawingPad.endY = curY;
			drawCircle.render(drawingPad.circleMode, ctx, drawingPad.savedImage, drawingPad.startX, drawingPad.startY, r, width,height);

			console.log("---",  drawingPad.startX, drawingPad.startY);
		},
		touchendEvent: (event) => {
			drawingPad.touching = false;
			let ctx = drawingPadVar.context;
			let startX = drawingPad.startX;
			let startY = drawingPad.startY;
			let endX = drawingPad.endX;
			let endY = drawingPad.endY;
			let diffX = Math.abs(endX - startX);
			let diffY = Math.abs(endY-startY);
			let r = diffX > diffY ? diffX : diffY;

			drawCircle.do(drawingPad.circleMode, ctx, startX, startY, r);

			console.log("<<<");
		},
		switchMode: (e) => {
			let ele = e.currentTarget;
			let siblingEles = e.currentTarget.parentElement.children;

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
					break;
				case "toolbarCircleButt":
					drawingPad.circleMode = !drawingPad.circleMode;
					break;
				case "toolbarSqaureButt":
					drawingPad.squareMode = !drawingPad.squareMode;
					break;
				case "toolbarEeaserButt":
					drawingPad.eraseMode = !drawingPad.eraseMode;
					break;
			}
		},
		init: () => {
			let toolbarPenButt = document.getElementById("toolbarPenButt");
			let toolbarCircleButt = document.getElementById("toolbarCircleButt");
			let toolbarSqaureButt = document.getElementById("toolbarSqaureButt");
			let toolbarEeaserButt = document.getElementById("toolbarEeaserButt");

			toolbarPenButt.addEventListener("click", drawingPad.switchMode);
			toolbarCircleButt.addEventListener("click", drawingPad.switchMode);
			toolbarSqaureButt.addEventListener("click", drawingPad.switchMode);
			toolbarEeaserButt.addEventListener("click", drawingPad.switchMode);
			drawingPadVar.canvas.addEventListener("touchstart", drawingPad.touchstartEvent);
			drawingPadVar.canvas.addEventListener("touchmove", drawingPad.touchmoveEvent);
			drawingPadVar.canvas.addEventListener("touchend", drawingPad.touchendEvent);

		}
	};

	drawingPad.init();
});

