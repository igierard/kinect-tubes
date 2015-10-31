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
        d *= 5;
        outPoints.push(new T.Vector3(d+minDiamater,0,i*lengthPSegment));
    };
}

function VelocityTube(opts){
    // this.texture = T.ImageUtils.loadTexture( "images/stripes.png" );
    // this.texture.minFilter = T.LinearFilter;
    // this.texture.magFilter = T.LinearFilter;
    // this.texture.format = T.RGBFormat;
    // this.texture.generateMipmaps = false;
    // this.texture = T.ImageUtils.loadTexture( "images/blue-stripes.png" );
    // this.texture.minFilter = T.LinearFilter;
    // this.texture.magFilter = T.LinearFilter;
    // this.texture.format = T.RGBFormat;
    // this.texture.generateMipmaps = false;
    opts = opts || {};
    this.maxSegments = opts.maxSegments || 10;
    this.segments = opts.segments || 32;
    this.segmentsLength = opts.segmentsLength || 0.5;
    this.minDiamater = opts.minDiamater || 0.1;
    this.material = new T.MeshPhongMaterial({
        color: (opts.color || 0xff0000), 
        wireframe:false,
        transparent:true, 
        // alphaMap:this.texture
    });
    this.positions = [new T.Vector3(1,0,0),new T.Vector3(2,0,1)];
    this.points = [new T.Vector3(1,0,0),new T.Vector3(2,0,1)];
    this.geometry = new T.LatheGeometry( this.points, this.segments );
    this.mesh =  new T.Mesh( this.geometry, this.material );
    this.positionSum = new T.Vector3();
}

VelocityTube.prototype.update = function(pos) {
    var n = pos.clone().multiplyScalar(0.2);
    this.positionSum.multiplyScalar(0.8);
    this.positionSum.add(pos);

    this.positions.unshift(this.positionSum.clone());
    while(this.positions.length > this.maxSegments){
        this.positions.pop();
    }
    calcVelocities(this.positions,this.points,this.minDiamater, this.segmentsLength);
    var oldGeom = this.geometry;
    this.geometry = new T.LatheGeometry( this.points, this.segments );
    // for (var i = 0; i < this.geometry.faces.length; i++) {
    //     var f = this.geometry.faces[i];
    //     this.geometry.faceVertexUVs[i];
    // };
    for (var i = 0; i < this.points.length; i++) {
        for (var j = 0; j < this.segments; j++) {
            var v = this.geometry.vertices[i+j*this.points.length];
            var v2 = this.positions[i]
            v.set(v.x+v2.x,v.y+v2.y,v.z+v2.z);
        };
    };
    this.mesh.geometry = this.geometry;
    oldGeom.dispose();
};
module.exports = VelocityTube;
