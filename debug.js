//Accel, autoload, debug flag
"use strict";

var dbgCtx;


function debug(txt, console){
	if (!debugFlag){return;}
	if (console){console.log(txt);}
	dbgCtx.clearRect(0,0,dbgCtx.dim[0], dbgCtx.dim[1]);
	dbgCtx.fillText(txt, 0, 16);
}

function debugFps(){
	if (!debugFlag){return;}
	if (typeof lastFrame == "undefined"){window.lastFrame = 0;}
	var now = new Date().getTime();
	var elapsed = now - lastFrame;
	var fps = 1000/elapsed;
	debug(fps, false);
	lastFrame = now;
}

function initDebug(){
	if (typeof debugFlag == "undefined"){window.debugFlag = false;}
	if (!debugFlag){return;}
	console.log("Debugging");
	var canvas = document.createElement("canvas");
	canvas.id = "dbg";
	document.body.appendChild(canvas);
	var dbg = document.getElementById("dbg");
	window.dbgCtx = dbg.getContext("2d");
	dbgCtx.dim=[100,20];
	dbg.width = dbgCtx.dim[0];
	dbg.height = dbgCtx.dim[1];
	dbg.style.backgroundColor = "#FFFFFF";
	dbg.style.width = dbgCtx.dim[0]+"px";
	dbg.style.height = dbgCtx.dim[1]+"px";
	dbg.style.position = "fixed";dbg.style.zIndex = 1000;
	dbg.style.left = "0";dbg.style.top = "0";
	dbgCtx.font="16px Arial";
	dbgCtx.fillStyle="#000000";
	window.onerror = debug();
}