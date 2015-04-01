define(function (require) {

    var messageTypes = require('./messageTypes'),
        dispatcher = require('./appDispatcher'),
        subscriptionIds = require('./subscriptionIds'),
        bulletStore = require('./bulletStore'),
        targetStore = require('./targetStore');

    return {
        start: function () {
            // On ADVANCE_TIME message, await to bullet and target stores have advanced, then run collision detection
            subscriptionIds.collisionDetection = dispatcher.subscribe(function (message, after) {
                if (message.type !== messageTypes.ADVANCE_TIME) return;

                return after([subscriptionIds.advanceBullets, subscriptionIds.advanceTargets], function () {
                    var bullets = bulletStore.getBullets(),
                        targets = targetStore.getTargets(),
                        collidedBullets = {},
                        collidedTargets = {},
                        newBullets = [],
                        newTargets = [];

                    // loop through all bullets and targets and get collisions
                    for (var i = 0, bullet; i < bullets.length; i++) {
                        bullet = bullets[i];
                        for (var j = 0, target; j < targets.length; j++) {
                            target = targets[j];
                            var dx = target.x - bullet.x,
                                dy = target.y - bullet.y;
                            if (dx * dx + dy * dy < target.r * target.r) {
                                // collision!
                                collidedBullets[i] = true;
                                collidedTargets[j] = true;
                            }
                        }
                    }

                    // gather non-collided bullets and targets
                    for (var k = 0; k < bullets.length; k++) {
                        if (!collidedBullets[k]) newBullets.push(bullets[k]);
                    }

                    for (var l = 0; l < targets.length; l++) {
                        if (!collidedTargets[l]) newTargets.push(targets[l]);
                    }

                    return {
                        bullets: newBullets,
                        targets: newTargets
                    };
                });
            });
        }
    };
});