var T = require('three');
var $ = require('jquery');

var VelocityTube = require('./velocity-tube');

var scene, camera, renderer;
var geometry, material, mesh;
var tube1 = new VelocityTube({maxSegments:60,segments:8});
var tube2 = new VelocityTube({maxSegments:60,segments:8,color:0x0000ff});
var lastMouse = new T.Vector3(0,0,0);

init();
animate();



function init() {

    scene = new T.Scene();

    camera = new T.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 20;
    camera.position.y = 20;
    camera.lookAt(new T.Vector3(0,0,0));
    geometry = new T.BoxGeometry( 2, 2, 2 );
    material = new T.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    var dirlight = new T.DirectionalLight(0xffffff,1.0);
  dirlight.position.set(2,10,5);
  scene.add(dirlight);
    scene.add(new T.AxisHelper())
    renderer = new T.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    scene.add(tube1.mesh);
    scene.add(tube2.mesh);
}

var c = 0;
function animate() {

    requestAnimationFrame( animate );
    c++;
    camera.position.x = Math.sin(c*0.001)*10;
    camera.lookAt(new T.Vector3(0,0,0));

    tube1.update(lastMouse);
    var lastMouseT = lastMouse.clone().set(lastMouse.x * -1,lastMouse.y*-1,0);
    tube2.update(lastMouseT);

    renderer.render( scene, camera );

}

$(window).on('mousemove',function(e){
    lastMouse = new T.Vector3(e.clientX* 0.01,e.clientY* 0.01,0);
})
