var Plane = pc.createScript('plane');

Plane.prototype.initialize = function() {
    this.vec3A = new pc.Vec3();
    this.vec3B = new pc.Vec3();
    this.color = new pc.Color(1, 1, 1);
    
    // Added code
    this.entity.addComponent('collision', {
        type: 'mesh',
    });

    this.entity.addComponent('rigidbody', {
        type: 'static'
    });
    // end of added code

    // create blank mesh for plane
    this.mesh = new pc.Mesh(this.app.graphicsDevice);
    this.mesh.setPositions([ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    this.mesh.setUvs(0, [ 0, 0, 0, 0, 0, 0 ]);
    this.mesh.setIndices([ 0, 0, 0 ]);
    this.mesh.update();
    
    // get material from render component
    let materialAssetId = this.entity.render.materialAssets[0];
    let material = this.app.assets.get(materialAssetId).resource;
    
    // create new mesh instance
    this.meshInstance = new pc.MeshInstance(this.mesh, material);
    this.entity.render.meshInstances = [ this.meshInstance ];
    
    if (this.plane) this.updateMesh();
};

Plane.prototype.setPlane = function(plane) {
    this.plane = plane;
    
    this.plane.on('change', () => {
        this.updateMesh();
    });
    
    this.plane.once('remove', () => {
        this.entity.destroy();
    });
    
    if (this.mesh) this.updateMesh();
};

Plane.prototype.updateMesh = function() {
    this.mesh = new pc.Mesh(this.app.graphicsDevice);
    this.meshInstance.mesh = this.mesh;

    this.mesh.clear(true, false);
    
    if (this.plane) {
        let positions = [ ];
        let indices = [ ];
        let uvs = [ ];
        
        // center point
        positions.push(0); // x
        positions.push(0); // y
        positions.push(0); // z
        uvs.push(0); // u
        uvs.push(0); // v
        
        const points = this.plane._xrPlane.polygon;
        for(let i = 0; i < points.length; i++) {
            positions.push(points[i].x); // x
            positions.push(points[i].y); // y
            positions.push(points[i].z); // z
            uvs.push(points[i].x); // u
            uvs.push(points[i].z); // v
        }
        
        for(let i = 0; i < points.length; i++) {
            indices.push(0); // center
            indices.push(i + 1); // first
            indices.push(((i + 1) % points.length) + 1); // second
        }
        
        this.mesh.setPositions(positions);
        this.mesh.setUvs(0, uvs);
        this.mesh.setIndices(indices);
        this.mesh.update();
            // added code
        this.createCollision();
        // end of added code
        this.entity.render.enabled = true;
    } else {
        this.entity.render.enabled = false;
    }
};

Plane.prototype.update = function(dt) {
    if (this.plane) {
        this.entity.rigidbody.teleport(this.plane.getPosition(),this.plane.getRotation());
    }
};

//added function
Plane.prototype.createCollision = function () {
    var node = new pc.GraphNode();
    var meshInstance = new pc.MeshInstance(this.mesh, this.app.assets.get(this.entity.render.materialAssets[0]).resource,node);
    var collisionModel = new pc.Model();
    collisionModel.graph = node;
    collisionModel.meshInstances.push(meshInstance);
    this.entity.collision.model = collisionModel;
};