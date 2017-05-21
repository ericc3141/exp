"use strict";

function getShader(id){
	var elem = document.getElementById(id);
	if (!elem){return null;}

	var source = elem.innerText;
	if (elem.type == "x-shader/x-vertex"){
		var shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else if (elem.type == "x-shader/x-fragment"){
		var shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else{return null;}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		alert("Shader compile error:" + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

var Program = function (vshaderId, fshaderId){
	console.log("shaders");
	var fragShader = getShader("fshader");
	var vertShader = getShader("vshader");
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram); //LINK START!
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		alert("Shader init error: " + gl.getProgramInfoLog(shaderProgram));
	}
	gl.useProgram(shaderProgram);
	this.pgrm = shaderProgram;

	var numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
	this.attribIndex = {};
	for(var i = 0;i < numAttribs; i ++){
		var attribInfo = gl.getActiveAttrib(shaderProgram, i);
		if (!attribInfo){continue;}
		var name = attribInfo.name;
		if (name.substr(-3) == "[0]"){name=name.substr(0, name.length-3);}
		this.attribIndex[name] = {
			loc:gl.getAttribLocation(shaderProgram, name),
			type:attribInfo.type,
			isArray:(attribInfo.size > 1 && attribInfo.name.substr(-3) == "[0]")
		};
	}

	var numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
	this.uniformIndex = {};
	for (var i = 0;i < numUniforms; i++){
		var uniformInfo = gl.getActiveUniform(shaderProgram, i);
		if (!uniformInfo){continue;}
		var name = uniformInfo.name;
		if (name.substr(-3) == "[0]"){name=name.substr(0, name.length-3);}
		this.uniformIndex[name] = {
			loc:gl.getUniformLocation(shaderProgram, name),
			type:uniformInfo.type,
			isArray:(uniformInfo.size > 1 && uniformInfo.name.substr(-3) == "[0]")
		};
	}
}
Program.prototype.setAttribs = function(attribs){
	for (var i = 0;i < attribs.length;i ++){
		var a = attribs[i];
		if (!(a.name in this.attribIndex)){continue;}
		// name components type normalize stride offset
		gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
		gl.enableVertexAttribArray(this.attribIndex[a.name].loc);
		gl.vertexAttribPointer(this.attribIndex[a.name].loc, a.numComponents, gl.FLOAT, false, a.stride || 0, a.offset || 0);
	}
}
Program.prototype.setUniforms = function(uniforms){
	for (var i = 0;i < uniforms.length;i ++){
		var u = uniforms[i];
		if (!this.uniformIndex[u.name]){continue;};
		if (this.uniformIndex[u.name].type == gl.FLOAT){
			gl.uniform1f(this.uniformIndex[u.name].loc, u.content);
		}
		else if (this.uniformIndex[u.name].type == gl.FLOAT_MAT4){
			gl.uniformMatrix4fv(this.uniformIndex[u.name].loc, false, u.content);
		}
		else if (this.uniformIndex[u.name].type == gl.SAMPLER_2D){
			gl.activeTexture(gl.TEXTURE0 + u.unit);
			gl.bindTexture(gl.TEXTURE_2D, u.texture);
			gl.uniform1i(this.uniformIndex[u.name].loc, u.unit);
		}
		else{
			console.log("Unknown type.");
		}
	}
}