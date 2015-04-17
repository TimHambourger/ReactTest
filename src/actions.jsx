var dispatcher = require('./appDispatcher'),
    messageTypes = require('./messageTypes');

module.exports = {
    setCursorVelocity: function (dx, dy) {
        dispatcher.dispatch(messageTypes.SET_CURSOR_VELOCITY, { dx: dx, dy: dy });
    },
    fireBullet: function (x, y) {
        dispatcher.dispatch(messageTypes.FIRE_BULLET, { x: x, y: y });
    },
    advanceTime: function (dt) {
        dispatcher.dispatch(messageTypes.ADVANCE_TIME, { dt: dt });
    }
};
