var StartButton = pc.createScript('startButton');

StartButton.attributes.add("gameManager",{
    type: "entity",
    title: "Game Manager"
});

// initialize code called once per entity
StartButton.prototype.initialize = function() {
    this.entity.button.on('click', this.clickButton, this);
};

StartButton.prototype.clickButton = function() {
    this.gameManager.script.gameManager.startGame(0);
}