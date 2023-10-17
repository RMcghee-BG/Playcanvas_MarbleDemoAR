var XrBasic = pc.createScript('xrBasic');

XrBasic.attributes.add('xrStartButton', {
    type: 'entity'
});

XrBasic.attributes.add('xrNotSupportedText', {
    type: 'entity'
});

XrBasic.attributes.add('planeDetectionNotSupportedText', {
    type: 'entity'
});

XrBasic.attributes.add('hitTestNotSupportedText', {
    type: 'entity'
});

XrBasic.attributes.add('moveAround', {
    type: 'entity'
});

XrBasic.attributes.add('cameraEntity', {
    type: 'entity'
});

XrBasic.prototype.initialize = function() {
    this.xrNotSupportedText.enabled = false;
    this.planeDetectionNotSupportedText.enabled = false;
    this.hitTestNotSupportedText.enabled = false;
    this.moveAround.enabled = false;

    // Default XR Events
    this.app.xr.on('available:' + pc.XRTYPE_AR, this.xrAvailable, this);
    this.app.xr.on('start', this.xrStart, this);
    this.app.xr.on('end', this.xrEnd, this);
    this.app.xr.on('error', this.xrError, this);

    // XR Plane Detection Events
    this.app.xr.planeDetection.on('add', this.xrPlaneDetectionAdd, this);
};


XrBasic.prototype.startXR = function() {
    this.xrStartButton.enabled = false;

    // Check if platform supports AR
    if (!this.app.xr.supported || !this.app.xr.isAvailable(pc.XRTYPE_AR))
    {
        this.xrNotSupportedText.enabled = true;
        return false;
    }

    // Check if platform supports plane detection
    if (!this.app.xr.planeDetection || !this.app.xr.planeDetection.supported)
    {
        this.planeDetectionNotSupportedText.enabled = true;
        return false;
    }

    // Check if platform supports plane detection
    if (!this.app.xr.hitTest || !this.app.xr.hitTest.supported)
    {
        this.hitTestNotSupportedText.enabled = true;
        return false;
    }

    // start session
    this.cameraEntity.camera.clearColor = new pc.Color(0, 0, 0 ,0);
    this.cameraEntity.camera.startXr(pc.XRTYPE_AR, pc.XRSPACE_LOCALFLOOR, {
        planeDetection: true
    });
    
    this.moveAround.enabled = true;
    return true;
};

// ====================================================================================================
// Default XR Events
// ====================================================================================================
XrBasic.prototype.xrAvailable = function(available) {

}
XrBasic.prototype.xrStart = function() {

}
XrBasic.prototype.xrEnd = function() {

}
XrBasic.prototype.xrError = function(err) {
    console.log(err);
}

// ====================================================================================================
// XR Plane Detection Events
// ====================================================================================================
XrBasic.prototype.xrPlaneDetectionAdd = function() {
    this.moveAround.enabled = false;
}