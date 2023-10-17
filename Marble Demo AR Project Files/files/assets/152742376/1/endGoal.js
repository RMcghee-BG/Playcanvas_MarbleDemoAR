var EndGoal = pc.createScript('endGoal');


// initialize code called once per entity
EndGoal.prototype.initialize = function() {
    // Subscribe to the triggerenter event of this entity's collision component.
    // This will be fired when a rigid body enters this collision volume.
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

EndGoal.prototype.onTriggerEnter = function (otherEntity) {
    // Only end level if player enters trigger
    if (!otherEntity.tags.has("player"))
        return;

    console.log("Player Hit End Goal");
    this.app.fire('player:endGoalHit');
};