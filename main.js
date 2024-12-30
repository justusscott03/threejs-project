//Import everything
import * as THREE from "three";

/*
let controllers = [], pControllers = [];
function getControllers () {
    return window.navigator.webkitGetGamepads ? window.navigator.webkitGetGamepads() : window.navigator.getGamepads();
}
function checkControllers () {
    for (let i = 0; i < controllers.length; i++) {
        if (controllers[i] && !pControllers[i]) {
            alert(controllers[i].id + " connected as Controller " + (i + 1));
        }
        else if (!controllers[i] && pControllers[i]) {
            alert("Controller " + (i + 1) + " disconnected.");
        }
    }
}
	*/

//Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Direction light
const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(-1, 1, 2);
scene.add(light);

//Hemisphere light
const ceilLight = new THREE.HemisphereLight(0xFFFFFF, 0xBBBBFF, 0.3);
scene.add(ceilLight);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

var keys = [];
window.addEventListener("keydown", (e) => {
	keys[e.keyCode] = true;
});
window.addEventListener("keyup", (e) => {
	keys[e.keyCode] = false;
});

function collide (obj1, obj2) {
	if (obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x && obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y && obj1.z < obj2.z + obj2.d && obj1.z + obj1.d > obj2.z) {
		return true;
	}
}

class Block {
	
	constructor (x, y, z, w, h, d, m) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
		this.m = m;
	}

	init () {
		this.geometry = new THREE.BoxGeometry(this.w, this.h, this.d);
		this.material = new THREE.MeshStandardMaterial(this.m);
		this.cube = new THREE.Mesh(this.geometry, this.material);
		this.cube.position.set(this.x, this.y, this.z);
		scene.add(this.cube);
	}

}

var blocks = [];
blocks.add = function (x, y, z, w, h, d, m) {
	this.push(new Block(x, y, z, w, h, d, m))
};

class Player extends Block {

	constructor (x, y, z, w, h, d, m) {
		super(x, y, z, w, h, d, m);

		/*
		this.k = 0;

		this.u = false;
		this.f = false;
		this.b = false;
		this.l = false;
		this.r = false;
		*/

		this.velx = 0;
		this.vely = 0;
		this.velz = 0;
		this.maxSpeed = 0.1;

		this.falling = false;
		this.jumpHeight = 0.4;
		this.gravity = 0.025;
		
		this.health = 100;
		this.dead = false;
	}

	update (blocks) {
		if (!this.dead) {
			if (keys[32] && !this.falling) {
				this.falling = true;
				this.vely = -this.jumpHeight;
			}

			if (keys[65]) this.velx = -this.maxSpeed;
			if (keys[87]) this.velz = -this.maxSpeed;
			if (keys[68]) this.velx = this.maxSpeed;
			if (keys[83]) this.velz = this.maxSpeed;

			if (!keys[65] && !keys[68])	this.velx = 0;
			if (!keys[87] && !keys[83])	this.velz = 0;

			if (this.velx > this.maxSpeed) this.velx = this.maxSpeed;
			if (this.velx < -this.maxSpeed) this.velx = -this.maxSpeed;
			if (this.velz > this.maxSpeed) this.velz = this.maxSpeed;
			if (this.velz < -this.maxSpeed) this.velz = -this.maxSpeed;

			/*
			this.u = (controllers[this.k].buttons[1] && controllers[this.k].buttons[1].pressed);
			this.f = (controllers[this.k].axes[1] && controllers[this.k].axes[1] < -0.5);
			this.b = (controllers[this.k].axes[1] && controllers[this.k].axes[1] > 0.5);
			this.l = (controllers[this.k].axes[0] && controllers[this.k].axes[0] < -0.5);
			this.r = (controllers[this.k].axes[0] && controllers[this.k].axes[0] > 0.5);

			if (this.u && !this.falling) {
				this.falling = true;
				this.vely = -this.jumpHeight;
			}

			if (this.l) this.velx = -this.maxSpeed;
			if (this.f) this.velz = -this.maxSpeed;
			if (this.r) this.velx = this.maxSpeed;
			if (this.b) this.velz = this.maxSpeed;

			if (!this.l && !this.r)	this.velx = 0;
			if (!this.f && !this.b)	this.velz = 0;
			*/

			if (this.velx > this.maxSpeed) this.velx = this.maxSpeed;
			if (this.velx < -this.maxSpeed) this.velx = -this.maxSpeed;
			if (this.velz > this.maxSpeed) this.velz = this.maxSpeed;
			if (this.velz < -this.maxSpeed) this.velz = -this.maxSpeed;

			this.x += this.velx;
		}

		this.applyCollision(blocks, this.velx, 0, 0);

		this.falling = true;
		this.vely += this.gravity;
   	 	this.y -= this.vely;
		this.applyCollision(blocks, 0, this.vely, 0);

		this.z += this.velz;
		this.applyCollision(blocks, 0, 0, this.velz);

		this.cube.position.set(this.x, this.y, this.z);
	}

	applyCollision (obj, velx, vely, velz) {
		for (let i = 0; i < obj.length; i++) {
			if (collide(this, obj[i])) {
				if (vely > 0) {
					this.vely = 0;
					this.falling = false;
					this.y = obj[i].y + this.h;
				}
				if (vely < 0) {
					this.vely = 0;
					this.falling = true;
					this.y = obj[i].y - obj[i].h;
				}
				if (velx < 0) {
					this.velx = 0;
					this.x = obj[i].x + obj[i].w;
				}
				if (velx > 0) {
					this.velx = 0;
					this.x = obj[i].x - this.w;
				}
				if (velz < 0) {
					this.velz = 0;
					this.z = obj[i].z + obj[i].d;
				}
				if (velz > 0) {
					this.velz = 0;
					this.z = obj[i].z - this.d;
				}
			}
		}
	}

}

var players = [];
players.add = function (x, y, z, w, h, d, m) {
	this.push(new Player(x, y, z, w, h, d, m));
};
players.apply = function (blocks) {
	for (let i = 0; i < this.length; i++) {
		this[i].update(blocks);
	}
};

var objects = [blocks, players];
objects.remove = function () {
    for (var i = 0; i < objects.length; i++) {
        for (var j = 0; j < objects[i].length; j++) {
            objects[i].splice(j, objects[i].length);
        }
    }
};

class Game {

	constructor () {
		this.levels = [
			{
				layers: [
					[
						"bbbb",
						"bbbb",
						"bbb ",
						"bb  ",
						"b   "
					],
					[
						"bbbb",
						"    "
					],
					[
						" b  ",
						" P  "
					],
					[
						"bbbb",
						"    "
					]
				]
			}
		];
		this.level = 0;
	}

	loadMap = function () {
		for (let z = 0; z < this.levels[this.level].layers.length; z++) {
			for (let y = 0; y < this.levels[this.level].layers[z].length; y++) {
				for (let x = 0; x < this.levels[this.level].layers[z][y].length; x++) {
					let s = this.levels[this.level].layers[z][y][x];

					if (s === "b") {
						blocks.add(x, y, z, 1, 1, 1, { color: 0x999999 });
					}
					if (s === "P") {
						players.add(x, y, z, 1, 1, 1, { color: 0xDDDDDD });
					}
				}
			}
		}
	}

	init (obj) {
		for (let i = 0; i < obj.length; i++) {
			obj[i].init();
		}
	}

	apply () {
		camera.position.x = players[0].x;
		camera.position.y = players[0].y + 3;
		camera.position.z = players[0].z + 5;
		camera.lookAt(new THREE.Vector3(players[0].x, players[0].y, players[0].z));

		players.apply(blocks);

		for (let i = 0; i < players.length; i++) {
			if (players[i].y < -20) players[i].dead = true;
			if (players[i].dead) {
				objects.remove();
				this.loadMap();
				this.init(blocks);
				this.init(players);
				players[i].dead = false;
			}
		}
	}

}

var game = new Game();

game.loadMap();
game.init(blocks);
game.init(players);

// let clicked = false;
// window.addEventListener("mousedown", (e) => {
// 	clicked = true;
// });

function animate () {

	// pControllers = controllers;
	// controllers = getControllers();
	// checkControllers();

	game.apply();

	renderer.render(scene, camera);

}
