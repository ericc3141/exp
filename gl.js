"use strict";

var gl;


//Initialize GL
function initGl(cvs, scale){
	gl = cvs.getContext("webgl");
	if (!gl){console.log("You do not support WebGL!");}

	gl.dim = [window.innerWidth/scale, window.innerHeight/scale];
	//gl.dim = [512,512];
	gl.viewport(0, 0, gl.dim[0], gl.dim[1]);
	cvs.width = gl.dim[0];
	cvs.height = gl.dim[1];
	//cvs.style.width = gl.dim[0]+"px";
	//cvs.style.height = gl.dim[1]+"px";
	cvs.style.width = gl.dim[0]*scale+"px";
	cvs.style.height = gl.dim[1]*scale+"px";

	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	//gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.DEPTH_TEST);
	//gl.enable(gl.CULL_FACE);
	//gl.depthFunc(gl.LEQUAL);
	//gl.lineWidth(1);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.BLEND);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function handleTextures(img){
	window.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	var uniforms = [
		{name:"u_sampler", unit:0, texture:texture}
	];
	programs.setUniforms(uniforms);
}