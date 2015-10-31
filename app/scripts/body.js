var VelocityTube = require('./velocity-tube');
var T = require('three');

var bodyParts = {
'AnkleLeft':	14,
'AnkleRight':	18,
'ElbowLeft':	5,
'ElbowRight':	9,
'FootLeft':	15,
'FootRight':	19,
'HandLeft':	7,
'HandRight':	11,
'HandTipLeft':	21,
'HandTipRight':	23,
'Head':	3,
'HipLeft':	12,
'HipRight':	16,
'KneeLeft':	13,
'KneeRight':	17,
'Neck':	2,
'ShoulderLeft':	4,
'ShoulderRight':	8,
'SpineBase':	0,
'SpineMid':	1,
'SpineShoulder':	20,
'ThumbLeft':	22,
'ThumbRight':	24,
'WristLeft':	6,
'WristRight':	10,
}

function Body(opts){
	opts = opts || {};
	this.color =  opts.color || 0xffffff;
	this.object = new T.Object3D();
	this.parts = {};
	this.partNumbers = [
		bodyParts.Head,
		bodyParts.HandLeft,
		bodyParts.HandRight,
		bodyParts.FootRight,
		bodyParts.FootLeft,
		bodyParts.ElbowRight,
		bodyParts.ElbowLeft,
		// bodyParts.KneeRight,
		// bodyParts.KneeLeft
	];
	for (var i = 0; i < this.partNumbers.length; i++) {
		var n = this.partNumbers[i];
		this.parts[n] = new VelocityTube({maxSegments:50, segments:6,segmentsLength:1, color:this.color});
		this.object.add(this.parts[n].mesh);
	};
	this.object.rotation.y = Math.PI;
}

Body.prototype.update = function(bodyFrame) {
	var scale = 5;
	var spineBase = bodyFrame.joints[bodyParts.SpineBase];
	var sbVect = new T.Vector3(spineBase.cameraX * scale ,spineBase.cameraY * scale ,spineBase.cameraZ * scale );
	
	for (var i = 0; i < this.partNumbers.length; i++) {
		var n = this.partNumbers[i];
		var joint = bodyFrame.joints[n];
		var np = new T.Vector3(joint.cameraX * scale ,joint.cameraY * scale ,joint.cameraZ * scale );
		np.sub(sbVect);
		this.parts[n].update(np);
	};
};
module.exports = Body;
