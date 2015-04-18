var EventEmitter = require('eventemitter3'),
    messageTypes = require('./messageTypes'),
    dispatcher = require('./appDispatcher'),
    subscriptionIds = require('./subscriptionIds');

var CHANGE_EVENT = 'change';

var bullets = [],
    currBulletId = 0,
    bulletDy = -1;

var bulletStore = new EventEmitter();

dispatcher.subscribe(messageTypes.FIRE_BULLET, function (message) {
    bullets.push({
        id: currBulletId++,
        x: message.x,
        y: message.y
    });
    bulletStore.emit(CHANGE_EVENT);
});

// Immediately after ADVANCE_TIME message, update all bullets
// But don't emit change event yet
// Instead, give collision detection a chance to run first
subscriptionIds.advanceBullets = dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message, waitFor) {
    var newBullets = [];
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.y += bulletDy * message.dt;
        if (bullet.y >= 0) newBullets.push(bullet);
    }
    bullets = newBullets;
});

// Then, after collision detection has run, update bullets and emit change event
subscriptionIds.updateBulletsView = dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message, waitFor) {
    return waitFor([subscriptionIds.collisionDetection]).then(function (resolutions) {
        var collisionResolution = resolutions[0];
        bullets = collisionResolution.bullets;
        bulletStore.emit(CHANGE_EVENT);
    });
});

module.exports = {
    getBullets: function () {
        return bullets;
    },
    addChangeListener: function (callback) {
        bulletStore.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        bulletStore.off(CHANGE_EVENT, callback);
    }
};
