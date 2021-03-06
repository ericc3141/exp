"use strict";

var debugFlag = true;
var nparticles = 250;
var life = 15;
var delay = 300;
var timescale = 1;

var line = new Particle({
	pos:[-15,0,-5],
	size:[10,.1],
	v:[2,0.1],
	a:[0.2,0],
	colorStart:{
		tl:[0.5,0.5,0.5,0.5],
		tr:[0.5,0.5,0.5,0.5],
		bl:[0.5,0.5,0.5,0.5],
		br:[0.5,0.5,0.5,0.5]
	},
	colorEnd:{
		tl:[0.5,0.5,0.5,0.5],
		tr:[0.5,0.5,0.5,0.5],
		bl:[0.5,0.5,0.5,0.5],
		br:[0.5,0.5,0.5,0.5]
	},
	life:life
});
var lrange = new Particle({
	pos:[0,10,10],
	size:[5,0.1],
	v:[2,0.1],
	a:[0.25,0.05],
	colorStart:{
		tl:[1.0,1.0,1.0,1.0],
		tr:[1.0,1.0,1.0,1.0],
		bl:[1.0,1.0,1.0,1.0],
		br:[1.0,1.0,1.0,1.0]
	},
	colorEnd:{
		tl:[1.0,1.0,1.0,1.0],
		tr:[1.0,1.0,1.0,1.0],
		bl:[1.0,1.0,1.0,1.0],
		br:[1.0,1.0,1.0,1.0]
	},
	life:0
});
var speck = new Particle({
	pos:[-5,0,-5],
	size:[.05,.05],
	v:[0.5,0.1],
	a:[0.2,0],
	colorStart:{
		tl:[0.9,0.9,0.9,0.9],
		tr:[0.9,0.9,0.9,0.9],
		bl:[0.9,0.9,0.9,0.9],
		br:[0.9,0.9,0.9,0.9]
	},
	colorEnd:{
		tl:[0.9,0.9,0.9,0.9],
		tr:[0.9,0.9,0.9,0.9],
		bl:[0.9,0.9,0.9,0.9],
		br:[0.9,0.9,0.9,0.9]
	},
	life:life*2
});
var srange = new Particle({
	pos:[0,10,10],
	size:[.025,.025],
	v:[0.5,0.1],
	a:[0.2,0.05],
	colorStart:{
		tl:[0.1,0.1,0.1,0.1],
		tr:[0.1,0.1,0.1,0.1],
		bl:[0.1,0.1,0.1,0.1],
		br:[0.1,0.1,0.1,0.1]
	},
	colorEnd:{
		tl:[0.1,0.1,0.1,0.1],
		tr:[0.1,0.1,0.1,0.1],
		bl:[0.1,0.1,0.1,0.1],
		br:[0.1,0.1,0.1,0.1]
	},
	life:0
});