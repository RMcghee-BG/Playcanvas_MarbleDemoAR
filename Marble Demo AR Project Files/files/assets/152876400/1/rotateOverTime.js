var RotateOverTime = pc.createScript('rotateOverTime');

RotateOverTime.attributes.add('rotationSpeed', {
    type: 'number',
    title: 'Rotation Speed ',
});
RotateOverTime.attributes.add('rotationTarget', {
    type: 'entity',
    title: 'Rotation Target ',
});

// initialize code called once per entity
RotateOverTime.prototype.initialize = function() {

};

// update code called every frame
RotateOverTime.prototype.update = function(dt) {
    if (!this.rotationTarget) return;

    this.rotationTarget.rotate(0, this.rotationSpeed * dt, 0);
};