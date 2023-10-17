var Gem = pc.createScript('gem');

// initialize code called once per entity
Gem.prototype.initialize = function() {
    // Subscribe to the triggerenter event of this entity's collision component.
    // This will be fired when a rigid body enters this collision volume.
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

Gem.prototype.onTriggerEnter = function (otherEntity) {
    // Only end level if player enters trigger
    if (!otherEntity.tags.has("player"))
        return;

    console.log("Player Collected Gem");
    this.app.fire('player:gemCollected');
    this.entity.destroy();
};