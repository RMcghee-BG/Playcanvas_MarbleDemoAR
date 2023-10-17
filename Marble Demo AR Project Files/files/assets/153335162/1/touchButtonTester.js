var TouchButtonTester = pc.createScript('touchButtonTester');

TouchButtonTester.attributes.add('identifier', { 
    type: 'string', 
    default: 'button0',
    title: 'Idenitifier',
});

// update code called every frame
TouchButtonTester.prototype.update = function(dt) {
    if (window.touchJoypad.buttons.wasPressed(this.identifier))
    {
        var msg = this.identifier + " was pressed";
        console.log(msg);
    }
    if (window.touchJoypad.buttons.wasReleased(this.identifier))
    {
        var msg = this.identifier + " was released";
        console.log(msg);
    }
    if (window.touchJoypad.buttons.wasTapped(this.identifier))
    {
        var msg = this.identifier + " was tapped";
        console.log(msg);
    }
};