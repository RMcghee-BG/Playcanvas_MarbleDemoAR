var Rotate = pc.createScript('rotate');

Rotate.attributes.add('rotationSpeed', {
    type: 'number',    
    default: 30,
    precision: 2,
});

// initialize code called once per entity
Rotate.prototype.initialize = function() {
    this.rot = 0;
    
    var self = this;
    this.app.xr.on('start', function() {
        // Disable in xr mode
        self.enabled = false;
    });
};

// update code called every frame
Rotate.prototype.update = function(dt) {
    this.keyboardInput(dt);

    this.rotate();
};

Rotate.prototype.rotate = function(dt) {
    var targetRot = new pc.Quat();
    targetRot.setFromEulerAngles(0, this.rot, 0);
    this.entity.setRotation(targetRot);

};

Rotate.prototype.keyboardInput = function(dt) {
    if (this.app.keyboard.isPressed(pc.KEY_Q)) {
        this.rot -= (dt * this.rotationSpeed);
    }
    else if (this.app.keyboard.isPressed(pc.KEY_E)) {
        this.rot += (dt * this.rotationSpeed);
    }
}