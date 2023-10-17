var TouchJoystickTester = pc.createScript('touchJoystickTester');

TouchJoystickTester.attributes.add('identifier', { 
    type: 'string', 
    default: 'joystick0',
    title: 'Idenitifier',
});

// update code called every frame
TouchJoystickTester.prototype.update = function(dt) {
    var joystick = window.touchJoypad.sticks[this.identifier];
    if (joystick && joystick.isPressed)
    {
        var msg = this.identifier + " is pressed";
        console.log(msg);

        var input = {
            x: joystick.x,
            y: joystick.y
        };
        console.log(input);
    }
};