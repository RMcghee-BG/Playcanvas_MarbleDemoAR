var HitTest = pc.createScript('hitTest');

HitTest.attributes.add('pointer', { 
    type: 'entity' 
});
HitTest.attributes.add('startEnabled', { 
    type: 'boolean',
    default: true 
});

// initialize code called once per entity
HitTest.prototype.initialize = function() {
    // Setup pointer
    this.resetPointer();
    this.pointerEnabled = false;
    if (! this.app.xr.hitTest) {
        console.warn("XR Hit Test not available, Hit Test Cursor Can't be enabled")
        return;
    }
    if (this.startEnabled) {
        this.enablePointer();
    }
    
    // when XR session is started
    var self = this;
    this.app.xr.on('start', function() {
        // start hit test from viewer position (middle of the screen)
        this.app.xr.hitTest.start({
            spaceType: pc.XRSPACE_VIEWER,
            callback: function(err, hitTestSource) {
                // when hit test session started
                hitTestSource.on('result', function(position, rotation) {
                    if (self.pointerEnabled) {
                        // store hit point
                        self.pointerPos = position;
                        self.pointerRot = rotation;

                        // set pointer state to 1
                        self.pointerUpdated = 1;
                    }
                });
            }
        });
    });

    // Other Events
    this.app.on('xr:enableHitTestPointer', this.enablePointer, this);
    this.app.on('xr:disableHitTestPointer', this.disablePointer, this);
};
HitTest.prototype.update = function() {
    if (! this.app.xr.hitTest) {
        return;
    }

    if (this.pointerEnabled)
    {
        this.updatePointer();
    }
};

HitTest.prototype.enablePointer = function() {
    if (! this.app.xr.hitTest) {
        console.warn("XR Hit Test not available, Hit Test Cursor Can't be enabled")
        return;
    }

    if (this.pointerEnabled)
            return;

    this.pointerEnabled = true;
    this.resetPointer();
};
HitTest.prototype.updatePointer = function() {
    // if pointer been updated
    if (this.pointerUpdated === 1) {
        // Position pointer to hit point
        this.pointer.enabled = true;
        this.pointer.setPosition(this.pointerPos);
        this.pointer.setRotation(this.pointerRot);
        
        // set pointer state to 2, which will hide pointer next frame
        this.pointerUpdated = 2;
        
        // if user taps on screen (input source is available)
        if (this.app.xr.input.inputSources.length) {
            var now = Date.now();

            // every 200 milliseconds
            if ((now - this.lastCreated) > 200) {
                this.lastCreated = now;
                this.app.fire('xr:hitTestPointerPressed', this.pointerPos, this.pointerRot);
            }
        }
    } 
    else if (this.pointerUpdated === 2) {
        // if pointer state is 2, reset state
        this.pointerUpdated = 0;
        // and hide pointer
        this.pointer.enabled = false;
    }
}
HitTest.prototype.disablePointer = function() {
    if (!this.pointerEnabled)
            return;

    this.pointerEnabled = false;
    this.resetPointer();
};

HitTest.prototype.resetPointer = function() {
    this.lastCreated = 0;
    this.pointerUpdated = 0;

    this.pointerPos = new pc.Vec3();
    this.pointerRot = new pc.Quat();

    this.pointer.setPosition(this.pointerPos);
    this.pointer.setRotation(this.pointerRot);

    this.pointer.enabled = false;
};