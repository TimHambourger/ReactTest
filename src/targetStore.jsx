var EventEmitter = require('../lib/eventemitter2').EventEmitter2,
    messageTypes = require('./messageTypes'),
    dispatcher = require('./appDispatcher'),
    subscriptionIds = require('./subscriptionIds');

var CHANGE_EVENT = 'change';

var targets = [],
    targetDy = .07,
    targetMaxAcceleration = .02,
    targetRadius = 5;

var screenWidth, screenHeight, targetsMissed = 0;

var targetStore = new EventEmitter();

// Immediately after ADVANCE_TIME message, update all targets
// But don't emit change event yet
// Instead, give collision detection a chance to run first
subscriptionIds.advanceTargets = dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message) {
    var newTargets = [];
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        target.dx += 2 * targetMaxAcceleration * Math.random() - targetMaxAcceleration;
        target.x += target.dx * message.dt;
        if (target.x < 0) target.x = target.x + screenWidth;
        if (target.x >= screenWidth) target.x = target.x - screenWidth;
        target.y += targetDy * message.dt;
        if (target.y <= screenHeight) newTargets.push(target);
        else targetsMissed++;
    }
    targets = newTargets;
});

// Then, after collision detection has run, update targets and emit change event
dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message, waitFor) {
    return waitFor([subscriptionIds.collisionDetection]).then(function (resolutions) {
        var collisionResolution = resolutions[0];
        targets = collisionResolution.targets;
        targetStore.emit(CHANGE_EVENT);
    });
});

module.exports = {
    initialize: function (args) {
        screenWidth = args.screenWidth;
        screenHeight = args.screenHeight;
        for (var i = 0; i < args.targetCount; i++) {
            targets.push({
                id: i,
                x: args.screenWidth * Math.random(),
                y: args.maxInitialY * Math.random(),
                dx: 0,
                r: targetRadius
            });
        }
    },
    getTargets: function () {
        return targets;
    },
    getTargetsMissed: function () {
        return targetsMissed;
    },
    addChangeListener: function (callback) {
        targetStore.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        bulletStore.off(CHANGE_EVENT, callback);
    }
};
