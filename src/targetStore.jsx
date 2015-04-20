var ko = require('knockout'),
    dt = require('./dt');

var targets = ko.observableArray([]),
    targetsPreCD = ko.observableArray([]), // targets after advance time but before collision detection
    targetDy = .07,
    targetMaxAcceleration = .02,
    targetRadius = 5;

var screenWidth, screenHeight, targetsMissed = ko.observable(0);

dt.subscribe(function (val) {
    var newTargets = [],
        currTargets = targets();
    for (var i = 0; i < currTargets.length; i++) {
        var target = currTargets[i];
        target.dx += 2 * targetMaxAcceleration * Math.random() - targetMaxAcceleration;
        target.x += target.dx * val;
        if (target.x < 0) target.x = target.x + screenWidth;
        if (target.x >= screenWidth) target.x = target.x - screenWidth;
        target.y += targetDy * val;
        if (target.y <= screenHeight) newTargets.push(target);
        else targetsMissed(targetsMissed() + 1);
    }
    targetsPreCD(newTargets);
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
    targets: targets,
    targetsPreCD: targetsPreCD,
    targetsMissed: targetsMissed
};
