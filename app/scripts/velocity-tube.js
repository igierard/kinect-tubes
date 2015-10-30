var T = require('three');



function calcVelocities(positions, outPoints, minDiamater, lengthPSegment){
    //TODO optimize this
    while(outPoints.length){ outPoints.shift(); }
    var runningAvg = [];
    var avgLen = 6;
    for (var i = 1; i < positions.length; i++) {
        var a = positions[i-1];
        var b = positions[i];
        var d = Math.abs(a.distanceTo(b));
        runningAvg.push(d);
        while(runningAvg.length > avgLen){ runningAvg.shift(); }

        d = runningAvg.reduce(function(m,v){ return m+v;},0);
        d /= runningAvg.length;
        outPoints.push(new T.Vector3(d+minDiamater,0,i*lengthPSegment));
    };
}

function VelocityTube(opts){

    opts = opts || {};
    this.maxSegments = opts.maxSegments || 10;
    this.segments = opts.segments || 32;
    this.segmentsLength = opts.segmentsLength || 0.5;
    this.minDiamater = opts.minDiamater || 0.1;
    this.material = new T.MeshPhongMaterial({color: (opts.color || 0xff0000), wireframe:false});
    this.positions = [new T.Vector3(1,0,0),new T.Vector3(2,0,1)];
    this.points = [new T.Vector3(1,0,0),new T.Vector3(2,0,1)];
    this.geometry = new T.LatheGeometry( this.points, this.segments );
    this.mesh =  new T.Mesh( this.geometry, this.material );
}

VelocityTube.prototype.update = function(pos) {
    this.positions.unshift(pos);
    while(this.positions.length > this.maxSegments){
        this.positions.pop();
    }
    calcVelocities(this.positions,this.points,this.minDiamater, this.segmentsLength);
    var oldGeom = this.geometry;
    this.geometry = new T.LatheGeometry( this.points, this.segments );
    for (var i = 0; i < this.points.length; i++) {
        for (var j = 0; j < this.segments; j++) {
            var v = this.geometry.vertices[i+j*this.points.length];
            var v2 = this.positions[i]
            v.set(v.x+v2.x,v.y+v2.y,v.z)
        };
    };
    this.mesh.geometry = this.geometry;
    oldGeom.dispose();
};
module.exports = VelocityTube;
