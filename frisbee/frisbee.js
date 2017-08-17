"use strict";

var g = 9.81;
var rho = 1.23;

var m = 0.175;
var area = 0.0568;
var cl0 = 0.1; // Coefficient of lift
var cla = 1.4; // Cl, dependent on alpha
var cd0 = 0.08; // Coefficient of drag
var cda = 2.72; // Cd, dependent on alpha
var an = -4 * Math.PI / 180; // alpha naught, angle of attack of least drag

function simulate(p){
	var results = [];
	dbgData = [];

	var state = {
		x:0,
		y:p.y0,
		vx:p.vx0,
		vy:p.vy0,
		a0:p.a * Math.PI/180 + Math.atan(p.vy0 / p.vx0) // Angle to horizontal
	}

	while (state.y>0){
		state = step(state, p.dt);
		results.push([state.x,state.y]);
	}
	return results;
}

function step(s, dt){
	// magnitude and angle of velocity, and angle of attack
	var v = Math.sqrt(Math.pow(s.vx,2) + Math.pow(s.vy,2));
	var av = Math.atan(s.vy/s.vx);
	var a = s.a0 - av;
	// coefficients of lift and drag
	var cl = cl0 + cla * a;
	var cd = cd0 + cda * Math.pow((a - an),2);
	// force of lift and drag
	var fd = 0.5 * rho * v*v * area * cd;
	var fl = 0.5 * rho * v*v * area * cl;
	// change in x and y velocity
	var dvy = (fl/m * Math.cos(av) - fd/m * Math.sin(av)- g)* dt;
	var dvx = (-fd/m * Math.cos(av) - fl/m * Math.sin(av)) * dt;
	s.vx += dvx;
	s.vy += dvy;
	// change in x and y position
	s.x += s.vx*dt;
	s.y += s.vy*dt;
	dbgData.push([s.x, a]);
	return s;
}

// DEBUG
var tstate = {
	x:5,
	y:5,
	vx:2,
	vy:-4,
	a0:30/180*Math.PI
}
var dbgData = [];