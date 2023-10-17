var LevelTimer = pc.createScript('levelTimer');

LevelTimer.attributes.add("timerText",{
    type: "entity",
    title: "Timer Text"
});

// initialize code called once per entity
LevelTimer.prototype.initialize = function() {
    this.app.on('game:startGameTimer', this.startTimer, this);
    this.app.on('game:stopGameTimer', this.stopTimer, this);
};

// update code called every frame
LevelTimer.prototype.update = function(dt) {
    if (!this.timerEnabled) return;

    this.currentTime = (this.currentTime + dt);
    if (this.timerText)
    {
        this.timerText.element.text = String(this.currentTime.toFixed(2));
    }
};


LevelTimer.prototype.startTimer = function() {
    if (this.timerEnabled) return;

    this.currentTime = 0;
    this.timerEnabled = true;
}
LevelTimer.prototype.stopTimer = function() {
    if (!this.timerEnabled) return;

    this.timerEnabled = false;
}