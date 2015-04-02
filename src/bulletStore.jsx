define(function (require) {

    var EventEmitter = require('EventEmitter2'),
        messageTypes = require('./messageTypes'),
        dispatcher = require('./appDispatcher'),
        subscriptionIds = require('./subscriptionIds');

    var CHANGE_EVENT = 'change';

    var bullets = [],
        currBulletId = 0,
        bulletDy = -1;

    var bulletStore = new EventEmitter();

    dispatcher.subscribe(function (message) {
        if (message.type !== messageTypes.FIRE_BULLET) return;
        bullets.push({
            id: currBulletId++,
            x: message.data.x,
            y: message.data.y
        });
        bulletStore.emit(CHANGE_EVENT);
    });

    // Immediately after ADVANCE_TIME message, update all bullets
    // But don't emit change event yet
    // Instead, give collision detection a chance to run first
    subscriptionIds.advanceBullets = dispatcher.subscribe(function (message) {
        if (message.type !== messageTypes.ADVANCE_TIME) return;
        var newBullets = [];
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            bullet.y += bulletDy * message.data.dt;
            if (bullet.y >= 0) newBullets.push(bullet);
        }
        bullets = newBullets;
    });

    // Then, after collision detection has run, update bullets and emit change event
    dispatcher.subscribe(function (message, waitFor) {
        if (message.type !== messageTypes.ADVANCE_TIME) return;
        return waitFor([subscriptionIds.collisionDetection]).then(function (resolutions) {
            var collisionResolution = resolutions[0];
            bullets = collisionResolution.bullets;
            bulletStore.emit(CHANGE_EVENT);
        });
    });

    return {
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
});