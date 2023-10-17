var PlaneDetection = pc.createScript('planeDetection');

PlaneDetection.attributes.add('template', {
    type: 'asset',
    assetType: 'template'
});

PlaneDetection.prototype.initialize = function() {
    if (! this.app.xr.planeDetection)
        return;
    
    this.app.xr.planeDetection.on('add', (plane) => {
        let entity = this.template.resource.instantiate();
        entity.script.plane.setPlane(plane);
        this.entity.addChild(entity);
    });
};
