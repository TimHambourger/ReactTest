var dt = require('./dt'),
    bulletStore = require('./bulletStore'),
    targetStore = require('./targetStore');

module.exports = {
    start: function () {
        dt.subscribe(function (val) {
            var bullets = bulletStore.bulletsPreCD(),
                targets = targetStore.targetsPreCD(),
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

            bulletStore.bullets(newBullets);
            targetStore.targets(newTargets);
        });
    }
};

