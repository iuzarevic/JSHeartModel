//glavna js datoteka
var container;
var camera, scene, renderer, geometry;
var mouseX = 0, mouseY = 0;
var controls;
var group;
var clock;


init();
animate();

function init() {
    window.addEventListener('resize', onWindowResize, false);

    //renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xAAAABB, 1);
	document.body.appendChild(renderer.domElement);

    //scena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x808080, 2000, 4000);

    //kamera
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(20, aspectRatio, 1, 10000);
	camera.position.set(0, 0, -700);

    //clock
    clock = new THREE.Clock();

    // osvjetljenje (prilagođeno slici)
    var ambientLight = new THREE.AmbientLight(0x222222);
    var light1 = new THREE.DirectionalLight(0xeeeeff, 0.6);
    light1.position.set(0,100, 400);
    var light2 = new THREE.DirectionalLight(0xeeeeff, 0.6);
    light2.position.set(0,-100, -400);
    var light3 = new THREE.DirectionalLight(0xeedfff, 0.6);
    light3.position.set(0, 400, 100);
	var light4 = new THREE.DirectionalLight(0xeedfff, 0.6);
    light4.position.set(0, -400, -100);
	var light5 = new THREE.DirectionalLight(0xeedfff, 0.6);
    light5.position.set(400, 100, 0);
	var light6 = new THREE.DirectionalLight(0xeedfff, 0.6);
    light6.position.set(-400, -100, 0);
    scene.add(ambientLight);
    scene.add(light1);
	scene.add(light2);
	scene.add(light3);
	scene.add(light4);
	scene.add(light5);
	scene.add(light6);
	
    //kontrole za scenu
    controls = new THREE.OrbitControls(camera);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.maxDistance = 1000;
    controls.minDistance = 500;

    //ovdje dodajemo nas kasnije ucitani model srca kako bi ga mogli fino centrirati
    group = new THREE.Object3D();

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    //ucitavanje teksture
    var texture = new THREE.Texture();
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };
    var loader = new THREE.ImageLoader(manager);
    loader.load('img/grad1.jpg', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });

    //ucitavanje modela srca
    var loader = new THREE.OBJLoader(manager);
    loader.load('obj/srce2.obj', function (object) {
        object.position.x = 0;
        object.position.z = 0;
        object.position.y = 0;
		object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        var box = new THREE.Box3().setFromObject(object);
        box.center(object.position); // resetiranje pozicije objekta
        object.position.multiplyScalar(-1);
        group.add(object);
    }, onProgress, onError);
	//group.rotation.x=Math.PI/2;
    scene.add(group);

    render();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onDocumentMouseMove(event) {
				mouseX = (event.clientX - window.innerWidth / 2) / 2;
				mouseY = (event.clientY - window.innerHeight / 2) / 2;
}

//prilagođavanje modela promjeni veličini prozora
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    controls.update(delta);
    render();
}

function render() {
    renderer.render(scene, camera);
}