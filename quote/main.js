"use strict";

var scale=1;
var programs;
var perspective;
var buffer,translation;
var numVertices;
var particles;


function main(){
	requestAnimationFrame(main);

	//FPS calculatins
	var now = window.performance.now()/1000;
	particles.t = now;
	debugFps();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var translated = translation;
	var uniforms = [
		{name:"u_translation", content:new Float32Array(translated.flatten())},
		{name:"u_t", content:now}
//		{name:"u_sampler", unit:0, texture:texture}
	];
	programs.setUniforms(uniforms);

	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function loadParticles(){
	var particleInfo = particles.genData();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleInfo), gl.STATIC_DRAW);
	var stride = 84
	var attribs = [
		{name:"a_vertPos", buffer:buffer, numComponents:3, stride:stride, offset:0},
		{name:"a_colorStart", buffer:buffer, numComponents:4, stride:stride, offset:12},
		{name:"a_colorEnd", buffer:buffer, numComponents:4, stride:stride, offset:28},
		{name:"a_t0", buffer:buffer, numComponents:1, stride:stride, offset:44},
		{name:"a_tf", buffer:buffer, numComponents:1, stride:stride, offset:48},
		{name:"a_v", buffer:buffer, numComponents:2, stride:stride, offset:52},
		{name:"a_a", buffer:buffer, numComponents:2, stride:stride, offset:60},
		{name:"a_pos", buffer:buffer, numComponents:2, stride:stride, offset:68},
		{name:"a_size", buffer:buffer, numComponents:2, stride:stride, offset:76}
//		{name:"a_texCoord", buffer:tBuffer, numComponents:2}
	];
	programs.setAttribs(attribs);
}

function rand(){
	var s = particles.spawnRand(line, lrange);
	var p = particles.spawnRand(speck, srange);
	loadParticles();
}

function init(){
	console.log("init");

	initDebug();

	var cvs = document.getElementById("cvs");
	initGl(cvs, scale);

	programs = new Program("vshader", "fshader");

	//Initialize Buffers
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	particles = new ParticleSys({num:nparticles});
	//window.numVertices = vertices.length/3;
	numVertices = nparticles * 6;
	loadParticles();

	var aspect = window.innerWidth/window.innerHeight;
	translation = Matrix.I(4);
	translation = translation.x(Matrix.Translation($V([0.0, 0.0, 0])).ensure4x4());
	perspective = makePerspective(45, gl.dim[0]/gl.dim[1], 0.1, 100.0);
	var uniforms = [
		{name:"u_perspective", content:new Float32Array(perspective.flatten())},
		{name:"u_aspect", content:aspect}
	];
	programs.setUniforms(uniforms);

	//Draw!
	main();
	setInterval(rand, delay);
}

window.onload = init;
