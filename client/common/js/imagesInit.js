import ge1doot from './imageTransform3D.js';
var imagesInit = (function () {
	/* ==== definitions ==== */
	var diapo = [], layers = [], ctx, pointer, scr, camera, light, fps = 0, quality = [1,2],
	// ---- poly constructor ----
	Poly = function (parent, face) {
		this.parent = parent;
		this.ctx    = ctx;
		this.color  = face.fill || false;
		this.points = [];
		if (!face.img) {
			// ---- create points ----
			for (var i = 0; i < 4; i++) {
				this.points[i] = new ge1doot.transform3D.Point(
					parent.pc.x + (face.x[i] * parent.normalZ) + (face.z[i] * parent.normalX),
					parent.pc.y +  face.y[i],
					parent.pc.z + (face.x[i] * parent.normalX) + (-face.z[i] * parent.normalZ)
				);
			}
			this.points[3].next = false;
		}
	},
	// ---- diapo constructor ----
	Diapo = function (path, img, structure) {
		// ---- create image ----
		this.img = new ge1doot.transform3D.Image(
			this, path + img.img, 1, {
				isLoaded: function(img) {
					img.parent.isLoaded = true;
					img.parent.loaded(img);
				}
			}
		);
		this.visible  = false;
		this.normalX  = img.nx;
		this.normalZ  = img.nz;
		// ---- point center ----
		this.pc = new ge1doot.transform3D.Point(img.x, img.y, img.z);
		// ---- target positions ----
		this.tx = img.x + (img.nx * Math.sqrt(camera.focalLength) * 20);
		this.tz = img.z - (img.nz * Math.sqrt(camera.focalLength) * 20);
		// ---- create polygons ----
		this.poly = [];
		for (var i = -1, p; p = structure[++i];) {
			layers[i] = (p.img === true ? 1 : 2);
			this.poly.push(
				new Poly(this, p)
			);
		}
	},
	// ---- init section ----
	init = function (json) {
		// draw poly primitive
		Poly.prototype.drawPoly = ge1doot.transform3D.drawPoly;
		// ---- init screen ----
		scr = new ge1doot.Screen({
			container: "canvas"
		});
		ctx = scr.ctx;
		scr.resize();
		// ---- init pointer ----
		pointer = new ge1doot.Pointer({
			tap: function () {
				if (camera.over) {
					if (camera.over === camera.target.elem) {
						// ---- return to the center ----
						camera.target.x = 0;
						camera.target.z = 0;
						camera.target.elem = false;
					} else {
						// ---- goto diapo ----
						camera.target.elem = camera.over;
						camera.target.x = camera.over.tx;
						camera.target.z = camera.over.tz;
						// ---- adapt tesselation level to distance ----
						for (var i = 0, d; d = diapo[i++];) {
							var dx = camera.target.x - d.pc.x;
							var dz = camera.target.z - d.pc.z;
							var dist = Math.sqrt(dx * dx + dz * dz);
							var lev = (dist > 1500) ? quality[0] : quality[1];
							d.img.setLevel(lev);
						}
					}
				}
			}
		});
		// ---- init camera ----
		camera = new ge1doot.transform3D.Camera({
			focalLength: Math.sqrt(scr.width) * 10,
			easeTranslation: 0.025,
			easeRotation: 0.06,
			disableRz: true
		}, {
			move: function () {
				this.over = false;
				// ---- rotation ----
				if (pointer.isDraging) {
					this.target.elem = false;
					this.target.ry = -pointer.Xi * 0.01;
					this.target.rx = (pointer.Y - scr.height * 0.5) / (scr.height * 0.5);
				} else {
					if (this.target.elem) {
						this.target.ry = Math.atan2(
							this.target.elem.pc.x - this.x,
							this.target.elem.pc.z - this.z
						);
					}
				}
				this.target.rx *= 0.9;
			}
		});
		camera.z  = -10000;
		camera.py = 0;
		// ---- create images ----
		for (var i = 0, img; img = json.imgdata[i++];) {
			diapo.push(
				new Diapo(
					json.options.imagesPath,
					img,
					json.structure
				)
			);
		}
		// ---- start engine ---- >>>
		setInterval(function() {
			quality = (fps > 50) ? [2,3] : [1,2];
			fps = 0;
		}, 1000);
		run();
	},
	// ---- main loop ----
	run = function () {
		// ---- clear screen ----
		ctx.clearRect(0, 0, scr.width, scr.height);
		// ---- camera ----
		camera.move();
		// ---- draw layers ----
		for (var k = -1, l; l = layers[++k];) {
			light = false;
			for (var i = 0, d; d = diapo[i++];) {
				(l === 1 && d.draw()) ||
				(d.visible && d.poly[k].draw());
			}
		}
		// ---- cursor ----
		if (camera.over && !pointer.isDraging) {
			scr.setCursor("pointer");
		} else {
			scr.setCursor("move");
		}
		// ---- loop ----
		fps++;
		requestAnimFrame(run);
	};
	/* ==== prototypes ==== */
	Poly.prototype.draw = function () {
		// ---- color light ----
		var c = this.color;
		if (c.light || !light) {
			var s = c.light ? this.parent.light : 1;
			// ---- rgba color ----
			light = "rgba(" +
				Math.round(c.r * s) + "," +
				Math.round(c.g * s) + "," +
				Math.round(c.b * s) + "," + (c.a || 1) + ")";
			ctx.fillStyle = light;
		}
		// ---- paint poly ----
		if (!c.light || this.parent.light < 1) {
			// ---- projection ----
			for (
				var i = 0;
				this.points[i++].projection();
			);
			this.drawPoly();
			ctx.fill();
		}
	}
	/* ==== image onload ==== */
	Diapo.prototype.loaded = function (img) {
		// ---- create points ----
		var d = [-1,1,1,-1,1,1,-1,-1];
		var w = img.texture.width  * 0.5;
		var h = img.texture.height * 0.5;
		for (var i = 0; i < 4; i++) {
			img.points[i] = new ge1doot.transform3D.Point(
				this.pc.x + (w * this.normalZ * d[i]),
				this.pc.y + (h * d[i + 4]),
				this.pc.z + (w * this.normalX * d[i])
			);
		}
	}
	/* ==== images draw ==== */
	Diapo.prototype.draw = function () {
		// ---- visibility ----
		this.pc.projection();
		if (this.pc.Z > -(camera.focalLength >> 1) && this.img.transform3D(true)) {
			// ---- light ----
			this.light = 0.5 + Math.abs(this.normalZ * camera.cosY - this.normalX * camera.sinY) * 0.6;
			// ---- draw image ----
			this.visible = true;
			this.img.draw();
			// ---- test pointer inside ----
			if (pointer.hasMoved || pointer.isDown) {
				if (
					this.img.isPointerInside(
						pointer.X,
						pointer.Y
					)
				) camera.over = this;
			}
		} else this.visible = false;
		return true;
	}
	return {
		// --- load data ----
		load : function (data) {
			window.addEventListener('load', function () {
				// ge1doot.loadJS(
				// 	"js/lover/imageTransform3D.js",
				// 	init, data
				// );
        init(data);
			}, false);
		}
	}
})();
module.exports = imagesInit;
