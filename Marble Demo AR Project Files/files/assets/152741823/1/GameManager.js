var GameManager = pc.createScript('gameManager');

GameManager.attributes.add("xrManager",{
    type: "entity",
    title: "XR Manager"
});

GameManager.attributes.add("playerBall",{
    type: "entity",
    title: "Player Ball"
});

GameManager.attributes.add("startLevel",{
    type: "number",
    title: "Start Level"
});

GameManager.attributes.add("levels", {
    type: "asset", 
    array: true, 
    default: [""], 
    title: "Game Levels"
});

GameManager.attributes.add("levelParent",{
    type: "entity",
    title: "Level Parent"
});

GameManager.attributes.add("splashUI",{
    type: "entity",
    title: "Splash UI"
});
GameManager.attributes.add("arSplashUI",{
    type: "entity",
    title: "AR Splash UI"
});
GameManager.attributes.add("gameUI",{
    type: "entity",
    title: "Game UI"
});

// initialize code called once per entity
GameManager.prototype.initialize = function() {
    this.currentLevelNumber = -1;
    this.currentSpawnedLevel = null;
    
    this.placementPos = new pc.Vec3(0, 0, 0);

    this.app.on('player:endGoalHit', this.endGoalHit, this);
    this.app.on('player:resetBall', this.resetBall, this);

    if (this.startLevel >= 0)
    {
        this.startGame(this.startLevel);
    }
    else
    {
        this.startSplash();
    }
};
GameManager.prototype.update = function(dt) {
    if (!this.playerBall || !this.playerBall.enabled) return;
    
    // Reset ball if it falls out of bounds
};
GameManager.prototype.startSplash = function() {
    this.playerBall.enabled = false;

    // Showing game UI 
    this.splashUI.enabled = true;
    this.arSplashUI.enabled = false;
    this.gameUI.enabled = false;
};
GameManager.prototype.startARSplash = function() {
    var arAvailable = this.xrManager.script.xrBasic.startXR();
    if (arAvailable)
    {
        // Showing game UI
        this.splashUI.enabled = false;
        this.arSplashUI.enabled = true;
        this.gameUI.enabled = false;

        this.app.on('xr:hitTestPointerPressed', this.xrHitTestPointerPressed, this);
        this.app.fire('xr:enableHitTestPointer');
    }
};
GameManager.prototype.startGame = function(levelNumber) {
    // Spawning Level and enabling player ball
    this.spawnLevel(levelNumber);
    this.resetBall();

    // Showing game UI
    this.splashUI.enabled = false;
    this.arSplashUI.enabled = false;
    this.gameUI.enabled = true;

    // Starting Game Timer
    this.app.fire('game:startGameTimer');
};


// ====================================================================================================
// Other Level Spawning / Info Handling
// ====================================================================================================
GameManager.prototype.spawnLevel = function(levelNumber) {
    if (this.currentLevelNumber === levelNumber) return;
    if (!this.levels[levelNumber]) return;

    if (this.currentSpawnedLevel)
    {
        this.currentSpawnedLevel.destroy();
        this.currentSpawnedLevel = null;
    }

    var instance = this.levels[levelNumber].resource.instantiate();
    this.levelParent.addChild(instance);

    instance.setPosition(this.placementPos);

    this.currentLevelNumber = levelNumber;
    this.currentSpawnedLevel = instance;
};
GameManager.prototype.spawnNextLevel = function() {
    var nextLevel = this.currentLevelNumber + 1;
    console.log("Spawning Next Level");
    console.log("Current Level = " + String(this.currentLevelNumber));
    console.log("Next Level = " + String(nextLevel));
    this.spawnLevel(nextLevel);
};
GameManager.prototype.spawnPrevLevel = function() {
    var prevLevel = this.currentLevelNumber - 1;
    console.log("Spawning Previous Level");
    console.log("Current Level = " + String(this.currentLevelNumber));
    console.log("Prev Level = " + String(prevLevel));
    this.spawnLevel(prevLevel);
};
GameManager.prototype.isLastLevel = function() {
    return (this.levels.length === (this.currentLevelNumber + 1))
};


// ====================================================================================================
// Other Level Elements Handling
// ====================================================================================================
GameManager.prototype.resetBall = function() {
    // Get Spawn Pos of Current Level
    var startPos = new pc.Vec3(0, 0, 0);
    if (this.currentSpawnedLevel && this.currentSpawnedLevel.script.levelData.spawnPoint)
    {
        startPos = this.currentSpawnedLevel.script.levelData.spawnPoint.getPosition();
    }
    
    // move ball to that point
    this.playerBall.enabled = true;
    this.playerBall.rigidbody.teleport(startPos);
    
    // need to reset angular and linear forces
    this.playerBall.rigidbody.linearVelocity = pc.Vec3.ZERO;
    this.playerBall.rigidbody.angularVelocity = pc.Vec3.ZERO;
};
GameManager.prototype.endGoalHit = function() {
    if (!this.isLastLevel())
    {    
        this.spawnNextLevel();
        this.resetBall();
    }
    else
    {
        this.playerBall.destroy();
        this.app.fire('game:stopGameTimer');
    }
};
GameManager.prototype.gemCollected = function() {
};


// ====================================================================================================
// XR Elements Handling
// ====================================================================================================
GameManager.prototype.xrHitTestPointerPressed = function(position, rotation) {
    this.placementPos = position;
    
    this.app.off('xr:hitTestPointerPressed', this.xrHitTestPointerPressed, this);
    this.app.fire('xr:disableHitTestPointer');

    this.startGame(0);
};