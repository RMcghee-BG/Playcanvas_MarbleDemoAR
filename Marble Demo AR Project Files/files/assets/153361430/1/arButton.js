var ArButton = pc.createScript('arButton');

ArButton.attributes.add("gameManager",{
    type: "entity",
    title: "Game Manager"
});

// initialize code called once per entity
ArButton.prototype.initialize = function() {
    this.entity.button.on('click', this.clickButton, this);
};

ArButton.prototype.clickButton = function() {
    this.gameManager.script.gameManager.startARSplash();
}