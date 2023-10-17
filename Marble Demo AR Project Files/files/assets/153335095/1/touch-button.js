var TouchButton = pc.createScript('touchButton');
TouchButton.attributes.add('identifier', { 
    type: 'string', 
    default: 'button0',
    title: 'Identifier',
    description: 'A unique name for the button to refer to it by in the API. Will give a warning in browser tools if the name is not unique.'
});

TouchButton.attributes.add('vibration', { 
    type: 'number', 
    default: 0,
    title: 'Vibration duration (ms)',
    description: 'If the device supports vibration with \'Navigator.vibrate\', it will vibrate for the duration set here on touch down.Set to 0 to disable.'
});

TouchButton.attributes.add('defaultColor', 
{ 
    type: 'rgba',
    default: [1, 1, 1, 1],
    description: ''
});

TouchButton.attributes.add('pressedColor', 
{ 
    type: 'rgba',
    default: [1, 1, 1, 1],
    description: ''
});

// initialize code called once per entity
TouchButton.prototype.initialize = function() {
    if (window.touchJoypad && window.touchJoypad.buttonStates[this.identifier] !== undefined) {
        console.warn('Touch button identifier already used, please use another for Entity: ' + this.entity.name);
        return;
    }

    this._canVibrate = !!navigator.vibrate;
    console.log(this._canVibrate);

    this._setState(false);

    this.on('state', (state) => {
        this._setEvents(state ? 'on' : 'off');
    });

    this.on('destroy', () => {
        if (window.touchJoypad) {
            window.touchJoypad.buttonStates[this.identifier] = undefined;
        }
    });

    this._setEvents('on');
};

TouchButton.prototype._setEvents = function (offOn) {
    this._state = false;

    this.entity.element[offOn]('mousedown', this._onMouseDown, this);
    this.entity.element[offOn]('mouseup', this._onMouseUp, this);

    if (this.app.touch) {
        this.entity.element[offOn]('touchstart', this._onTouchDown, this);
        this.entity.element[offOn]('touchend', this._onTouchUp, this);
        this.entity.element[offOn]('touchcancel', this._onTouchUp, this);
    }

    if (this.app.xr.input) {
        this.app.xr.input[offOn]('selectstart', this._onXRInputSelectStart, this);
        this.app.xr.input[offOn]('selectend', this._onXRInputSelectEnd, this);
    }
};

// ====================================================================================================
// Mouse Input
// ====================================================================================================
TouchButton.prototype._onMouseDown = function (e) {
    if (!this._state) {
        this._onPointerDown();
        e.stopPropagation();
    }
};
TouchButton.prototype._onMouseUp = function (e) {
    if (this._state) {
        this._onPointerUp();
        e.stopPropagation();
    }
};

// ====================================================================================================
// Touch Screen Input
// ====================================================================================================
TouchButton.prototype._onTouchDown = function (e) {
    if (!this._state) {
        this._onPointerDown();
        e.stopPropagation();
    }
};
TouchButton.prototype._onTouchUp = function (e) {
    if (this._state) {
        this._onPointerUp();
        e.stopPropagation();
    }

    e.event.preventDefault();
};


// ====================================================================================================
// XR Input
// ====================================================================================================
TouchButton.prototype._onXRInputSelectStart = function (input, e) {
    var inputPos = this._getEvent(input);
    var limits = this._getLimits();

    if (inputPos.x < limits.min.x || inputPos.x > limits.max.x) {
        return;
    }
    if (inputPos.y < limits.min.y || inputPos.y > limits.max.y) {
        return;
    }

    if (!this._state) {
        this._onPointerDown();
        e.stopPropagation();
    }
};
TouchButton.prototype._onXRInputSelectEnd = function (input, e) {
    if (this._state) {
        this._onPointerUp();
        e.stopPropagation();
    }

    e.preventDefault();
};

TouchButton.prototype._onPointerDown = function () {
    if (this._canVibrate && this.vibration !== 0) {
        navigator.vibrate(this.vibration);
    }
    
    this._setState(true);
};

TouchButton.prototype._onPointerUp = function () {
    this._setState(false);
};

TouchButton.prototype._setState = function (state) {
    if (window.touchJoypad) {
        window.touchJoypad.buttonStates[this.identifier] = state ? Date.now() : null;
    }

    if (state)
    {
        this.entity.element.color = this.pressedColor;
    }
    else
    {
        this.entity.element.color = this.defaultColor;
    }
    this._state = state;
};

TouchButton.prototype._getEvent = function(inputSource) {
    if (!inputSource) return;

    let axes = inputSource.gamepad.axes; // Both x and y are in the range of -1 to 1;

    const canvasWidth = this.app.graphicsDevice.canvas.clientWidth;
    const canvasHeight = this.app.graphicsDevice.canvas.clientHeight;  

    let x = axes[0];
    x = (x + 1) / 2;
    x = pc.math.lerp(x, canvasWidth, x);

    let y = axes[1];
    y = (y + 1) / 2;
    y = pc.math.lerp(y, canvasHeight, y);

    return {x, y};
}

TouchButton.prototype._getLimits = function() {
    const canvasWidth = this.app.graphicsDevice.canvas.clientWidth;
    const canvasHeight = this.app.graphicsDevice.canvas.clientHeight;

    // Array of points {Bottom Left, Bottom Right, Top Right, Top Left}
    // Bottom left = {0, 0}, Top Right = {w, h}
    var elementCorners = this.entity.element.screenCorners;
    var elementMin = {
        x: elementCorners[3].x,
        y: canvasHeight - elementCorners[3].y
    }; 
    var elementMax = {
        x: elementCorners[1].x,
        y: canvasHeight - elementCorners[1].y
    };

    return {
        min: elementMin,
        max: elementMax
    };
}