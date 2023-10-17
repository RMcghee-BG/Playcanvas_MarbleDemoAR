var Teleporter = pc.createScript('teleporter');

Teleporter.attributes.add('target', {
    type: 'entity',
    title: 'Target Entity',
    description: 'The target entity where we are going to teleport'
});

// initialize code called once per entity
Teleporter.prototype.initialize = function() {
    if (this.target) {
        // Subscribe to the triggerenter event of this entity's collision component.
        // This will be fired when a rigid body enters this collision volume.
        this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    }
};

Teleporter.prototype.onTriggerEnter = function (otherEntity) {
    // Only teleport player
    if (!otherEntity.tags.has("player"))
        return;

    // it is not teleportable
    if (!otherEntity.script.teleportable)
        return;

    // teleport entity to the target entity
    console.log("Player Teleporting");
    otherEntity.script.teleportable.teleport(this.entity, this.target);
};
