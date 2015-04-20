var ko = require('knockout'),
    dt = require('./dt');

var bullets = ko.observableArray([]),
    bulletsPreCD = ko.observableArray([]), // bullets after advance time but before collision detection
    currBulletId = 0,
    bulletDy = -1;

function fireBullet(x, y) {
    bullets.push({
        id: currBulletId++,
        x: x,
        y: y
    });
}

dt.subscribe(function (val) {
    var newBullets = [],
        currBullets = bullets();
    for (var i = 0; i < currBullets.length; i++) {
        var bullet = currBullets[i];
        bullet.y += bulletDy * val;
        if (bullet.y >= 0) newBullets.push(bullet);
    }
    bulletsPreCD(newBullets);
});

module.exports = {
    fireBullet: fireBullet,
    bullets: bullets,
    bulletsPreCD: bulletsPreCD
};
