var Movement = pc.createScript('movement');

Movement.attributes.add('speed', {
    type: 'number',    
    default: 0.1,
    min: 0.5,
    max: 5,
    precision: 3,
});

Movement.attributes.add('camera', {
    type: 'entity',
});

// initialize code called once per entity
Movement.prototype.initialize = function() {
    this.force = new pc.Vec3();

    // Setting up the ball falling out of bounds
    // Default falling under the level
    this.resetHeight = -2.5;
    this.app.on('xr:hitTestPointerPressed', this.xrHitTestPointerPressed, this);
    // If in xr mode reset if xr surface is hit
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

// update code called every frame
Movement.prototype.update = function(dt) {
    var joystick = window.touchJoypad.sticks['joystick0'];
    if (joystick && joystick.isPressed)
    {
        this.joystickMovement(dt);
    }
    else
    {
        this.keyboardMovement(dt);
    }

    // Reset ball if it falls out of bounds
    var pos = this.entity.getPosition();
    if (pos.y < this.resetHeight) 
    {
        this.app.fire("player:resetBall");
    }
};


// ====================================================================================================
// Player Input Movement
// ====================================================================================================
Movement.prototype.joystickMovement = function(dt) {
    var forceX = 0;
    var forceZ = 0;

    // Get the joystick by the identifier from the global object
    var joystick = window.touchJoypad.sticks['joystick0'];
    forceX = joystick.x * this.speed;
    forceZ = joystick.y * this.speed;

    this.addForce(forceX, forceZ, dt);
}
Movement.prototype.keyboardMovement = function(dt) {
    var forceX = 0;
    var forceZ = 0;
    
    // calculate force based on pressed keys
    if (this.app.keyboard.isPressed(pc.KEY_A)) {
        forceX = -this.speed;
    }
    else if (this.app.keyboard.isPressed(pc.KEY_D)) {
        forceX = this.speed;
    } 

    if (this.app.keyboard.isPressed(pc.KEY_W)) {
        forceZ = this.speed;
    }
    else if (this.app.keyboard.isPressed(pc.KEY_S)) {
        forceZ = -this.speed;
    }

    this.addForce(forceX, forceZ, dt);
}
Movement.prototype.addForce = function(forceX, forceZ, dt) {
    var forward = new pc.Vec3(
        this.camera.forward.x,
        0,
        this.camera.forward.z
    );
    forward.scale(forceZ);

    var right = new pc.Vec3(
        this.camera.right.x,
        0,
        this.camera.right.z
    );
    right.scale(forceX);

    this.force = new pc.Vec3(
        x = forward.x + right.x,
        y = 0,
        z = forward.z + right.z
    );

    // if we have some non-zero force
    if (this.force.length()) {
        // clamp force to the speed
        if (this.force.length() > this.speed) {
            this.force.normalize().scale(this.speed);
        }
    }

    // apply impulse to move the entity
    this.entity.rigidbody.applyImpulse(this.force.scale(dt));
}

// ====================================================================================================
// XR Elements Events
// ====================================================================================================
Movement.prototype.xrHitTestPointerPressed = function(position, rotation) {
    this.resetHeight = position.y - 2;
    this.app.off('xr:hitTestPointerPressed', this.xrHitTestPointerPressed, this);
};

Movement.prototype.onCollisionStart = function (contactResult) {
    // Only teleport player
    if (!contactResult.other.tags.has("XR Plane"))
        return;
    
    this.app.fire("player:resetBall");
};