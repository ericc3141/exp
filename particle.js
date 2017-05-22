"use strict";

/* 1	2	3	4	5	6	7	8	9	10	11
 * x	y	z	r	g	b	a	r	g	b	a
 * 12	13	14	15	16	17	18	19	20	21
 * t	tf	vx	vy	ax	ay	x	y	l	w
 */
class ParticleSys{
	constructor(opts){
		this.num = opts.num;
		this.data = [];
		this.t = 0;
		for (var i = 0;i < this.num;i ++){
			this[i] = new Particle();
		}
		for (var i = 0;i < this.num * 6 * 21;i ++){
			this.data.push(0);
		}
	}
	genData(i){
		var arr = [];
		var o = this[i];
		var tl = this.genAttrib(o,"tl");
		var tr = this.genAttrib(o,"tr");
		var bl = this.genAttrib(o,"bl");
		var br = this.genAttrib(o,"br");
		arr = arr.concat(tl,tr,bl,bl,tr,br);
		for (var j = 0;j < arr.length;j ++){
			this.data[i*126 + j] = arr[j];
		}
	}
	genAttrib(p,corner){
		var mat = p.pos.slice();
		if (corner == "tr" || corner == "br"){mat[0] += p.size[0]}
		if (corner == "bl" || corner == "br"){mat[1] -= p.size[1]}
		mat = mat.concat(p.colorStart[corner],p.colorEnd[corner],[p.t0,p.t0+p.life],p.v,p.a,p.pos.slice(0,2),p.size);
		return mat;
	}
	spawn(opts, update){
		for (var i = 0;i < this.num;i ++){
			if (this.t > this[i].t0 + this[i].life){
				this[i] = new Particle(opts);
				this[i].t0 = this.t;
				if (update){this.genData(i);}
				return i;
			}
		}
		return false;
	}
	spawnRand(opts, range){
		var p = this.spawn(opts);
		var r = new Particle(range);
		if (!p){
			return false;
		}
		this[p] = this.randomize(this[p], r);
		this.genData(p);
		return p;
	}
	randomize(val, range){
		if (typeof val != "number"){
			for (var i in val){
				if (typeof val[i] == "function"){continue;}
				val[i] = this.randomize(val[i], range[i]);
			}
			return val;
		}
		else{
			return val + ((Math.random()-0.5) * range);
		}
	}
}

class Particle{
	constructor(opts){
		this.pos=[0,0,0];
		this.size=[0,0],
		this.v=[0,0];
		this.a=[0,0];
		this.t0=0;
		this.life=0;
		this.colorStart = {
			tl:[0,0,0,0],
			tr:[0,0,0,0],
			bl:[0,0,0,0],
			br:[0,0,0,0]
		};
		this.colorEnd={
			tl:[0,0,0,0],
			tr:[0,0,0,0],
			bl:[0,0,0,0],
			br:[0,0,0,0]
		};
		if (typeof opts != "object"){return;}
		var o = JSON.parse(JSON.stringify(opts));
		for (var i in o){
			this[i] = o[i];
		}
	}
}