"use strict";

class Plotter{
	constructor(cvs){
		this.cvs = cvs;
		this.ctx = cvs.getContext("2d");
		//this.ctx.font = "16px Sans";
		this.scale = 1;
		this.resize(0,0);
		this.reorigin(0,0);
	}

	resize(w, h){
		w = w * this.scale;
		h = h * this.scale;
		this.w = w;
		this.h = h;
		this.cvs.style.width = this.w + "px";
		this.cvs.style.height = this.h + "px";
		this.cvs.width = this.w;
		this.cvs.height = this.h;
	}
	reorigin(x, y){
		this.ox = x*this.scale;
		this.oy = y*this.scale;
	}

	coordToPix(coord){
		var x = (coord[0]*this.scale) + this.ox;
		var y = this.oy - (coord[1]*this.scale);
		return [x,y];
	}
	pixToCoord(pix){
		var x = (pix[0]-this.ox) / this.scale;
		var y = (this.oy-pix[1]) / this.scale;
		return [x,y];
	}

	plot(points){
		this.ctx.beginPath();
		var p0 = this.coordToPix(points[0]);
		this.ctx.moveTo(p0[0], p0[1]);
		for (var i = 1;i < points.length;i ++){
			var p = this.coordToPix(points[i]);
			if (this.dist(p0, p) < 1.5){continue;}
			this.ctx.lineTo(p[0], p[1]);
			this.ctx.stroke();
			p0 = p;
		}
		this.ctx.closePath();
	}

	drawAxes(x,y){
		this.ctx.strokeStyle="#CCCCCC";
		for (var i =0;i < this.w/this.scale;i += x){
			var p = this.coordToPix([i,0]);
			this.ctx.fillText(i, p[0], this.h);
			this.ctx.beginPath();
			this.ctx.moveTo(p[0],this.h);
			this.ctx.lineTo(p[0],0);
			this.ctx.stroke();
			this.ctx.closePath();
		}
		for (var i =0;i < this.h/this.scale;i += y){
			var p = this.coordToPix([0,i]);
			this.ctx.fillText(i, 0, p[1]);
			this.ctx.beginPath();
			this.ctx.moveTo(0,p[1]);
			this.ctx.lineTo(this.w,p[1]);
			this.ctx.stroke();
			this.ctx.closePath();
		}
		this.ctx.strokeStyle="#000000";
	}

	dist(a, b){
		return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
	}
}